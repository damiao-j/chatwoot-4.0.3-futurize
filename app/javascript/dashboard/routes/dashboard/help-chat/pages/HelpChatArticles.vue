<template>
  <div class="column content-box">
    <div class="row">
      <div class="small-8 columns with-right-space">
        <h1 class="page-title">
          {{ $t('HELP_CHAT.ARTICLES.HEADER') }}
        </h1>
      </div>
      <div class="small-4 columns">
        <woot-button
          v-if="isAdmin"
          color-scheme="success"
          class-names="button--fixed-right-top"
          icon="add"
          @click="openAddArticle"
        >
          {{ $t('HELP_CHAT.ARTICLES.ADD.BUTTON') }}
        </woot-button>
      </div>
    </div>

    <div class="row">
      <div class="small-12 columns">
        <div class="search-box">
          <woot-input
            v-model="searchQuery"
            :placeholder="$t('HELP_CHAT.ARTICLES.SEARCH.PLACEHOLDER')"
            @input="handleSearch"
          >
            <template #prefix>
              <i class="icon ion-ios-search"></i>
            </template>
          </woot-input>
          <woot-button
            color-scheme="secondary"
            variant="clear"
            @click="clearSearch"
            v-if="searchQuery"
          >
            {{ $t('GENERAL.CLEAR') }}
          </woot-button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="small-12 columns">
        <woot-loading-state
          v-if="uiFlags.isFetchingArticles"
          :message="$t('HELP_CHAT.ARTICLES.LOADING')"
        />
        <p v-else-if="!articles.length" class="no-items-error-message">
          {{ searchQuery ? $t('HELP_CHAT.ARTICLES.NO_SEARCH_RESULTS') : $t('HELP_CHAT.ARTICLES.NO_ITEMS') }}
        </p>
        <table v-else class="woot-table">
          <thead>
            <tr>
              <th>{{ $t('HELP_CHAT.ARTICLES.COLUMNS.TITLE') }}</th>
              <th>{{ $t('HELP_CHAT.ARTICLES.COLUMNS.STATUS') }}</th>
              <th>{{ $t('HELP_CHAT.ARTICLES.COLUMNS.VIEWS') }}</th>
              <th>{{ $t('HELP_CHAT.ARTICLES.COLUMNS.HELPFUL') }}</th>
              <th>{{ $t('HELP_CHAT.ARTICLES.COLUMNS.CREATED_AT') }}</th>
              <th v-if="isAdmin">{{ $t('HELP_CHAT.ARTICLES.COLUMNS.ACTIONS') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in articles" :key="article.id">
              <td>
                <a href="#" @click.prevent="viewArticle(article.id)">
                  {{ article.title }}
                </a>
              </td>
              <td>
                <span
                  class="status-badge"
                  :class="{ active: article.active, inactive: !article.active }"
                >
                  {{ article.active ? $t('GENERAL.ACTIVE') : $t('GENERAL.INACTIVE') }}
                </span>
              </td>
              <td>{{ article.views_count }}</td>
              <td>
                {{ article.helpful_count }} / {{ article.helpful_count + article.not_helpful_count }}
                <span v-if="article.helpful_count + article.not_helpful_count > 0">
                  ({{ calculateHelpfulPercentage(article) }}%)
                </span>
              </td>
              <td>{{ formatDate(article.created_at) }}</td>
              <td v-if="isAdmin">
                <div class="button-group">
                  <woot-button
                    variant="clear"
                    color-scheme="secondary"
                    icon="edit"
                    @click="openEditArticle(article.id)"
                  />
                  <woot-button
                    variant="clear"
                    color-scheme="alert"
                    icon="delete"
                    @click="confirmDeleteArticle(article.id, article.title)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para visualizar artigo -->
    <woot-modal :show.sync="showArticleViewModal" :title="currentArticle.title">
      <div class="article-view">
        <div class="article-content" v-html="currentArticle.content"></div>
        <div class="article-meta">
          <div class="meta-item">
            <span class="label">{{ $t('HELP_CHAT.ARTICLES.VIEWS') }}:</span>
            <span>{{ currentArticle.views_count }}</span>
          </div>
          <div class="meta-item">
            <span class="label">{{ $t('HELP_CHAT.ARTICLES.HELPFUL') }}:</span>
            <span>{{ currentArticle.helpful_count }}</span>
          </div>
          <div class="meta-item">
            <span class="label">{{ $t('HELP_CHAT.ARTICLES.NOT_HELPFUL') }}:</span>
            <span>{{ currentArticle.not_helpful_count }}</span>
          </div>
          <div class="meta-item" v-if="currentArticle.tags && currentArticle.tags.length">
            <span class="label">{{ $t('HELP_CHAT.ARTICLES.TAGS') }}:</span>
            <span>{{ currentArticle.tags.join(', ') }}</span>
          </div>
        </div>
      </div>
    </woot-modal>

    <!-- Modal para adicionar/editar artigo -->
    <woot-modal :show.sync="showArticleFormModal" :title="articleFormTitle">
      <div class="article-form">
        <form @submit.prevent="submitArticle">
          <div class="row">
            <div class="small-12 columns">
              <woot-input
                v-model="articleForm.title"
                :label="$t('HELP_CHAT.ARTICLES.FORM.TITLE.LABEL')"
                :placeholder="$t('HELP_CHAT.ARTICLES.FORM.TITLE.PLACEHOLDER')"
                :error="$v.articleForm.title.$error ? $t('HELP_CHAT.ARTICLES.FORM.TITLE.ERROR') : ''"
                @blur="$v.articleForm.title.$touch"
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <label class="block-label">
                {{ $t('HELP_CHAT.ARTICLES.FORM.CONTENT.LABEL') }}
                <textarea
                  v-model="articleForm.content"
                  class="woot-input__textarea"
                  :placeholder="$t('HELP_CHAT.ARTICLES.FORM.CONTENT.PLACEHOLDER')"
                  rows="10"
                  @blur="$v.articleForm.content.$touch"
                ></textarea>
                <span v-if="$v.articleForm.content.$error" class="error-message">
                  {{ $t('HELP_CHAT.ARTICLES.FORM.CONTENT.ERROR') }}
                </span>
              </label>
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <label class="block-label">
                {{ $t('HELP_CHAT.ARTICLES.FORM.TAGS.LABEL') }}
                <div class="tags-input">
                  <div v-for="(tag, index) in articleForm.tags" :key="index" class="tag-item">
                    <span>{{ tag }}</span>
                    <i class="icon ion-close-round" @click="removeTag(index)"></i>
                  </div>
                  <input
                    v-model="newTag"
                    :placeholder="$t('HELP_CHAT.ARTICLES.FORM.TAGS.PLACEHOLDER')"
                    @keydown.enter.prevent="addTag"
                    @keydown.tab.prevent="addTag"
                    @keydown.comma.prevent="addTag"
                  />
                </div>
              </label>
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <label class="block-label">
                {{ $t('HELP_CHAT.ARTICLES.FORM.STATUS.LABEL') }}
                <div class="checkbox-wrap">
                  <input
                    v-model="articleForm.active"
                    type="checkbox"
                  />
                  <span class="checkbox-label">
                    {{ $t('HELP_CHAT.ARTICLES.FORM.STATUS.ACTIVE') }}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <div class="medium-12 columns">
              <woot-button
                class="button--fixed-right-bottom"
                :is-loading="isSubmittingArticle"
                :disabled="$v.articleForm.$invalid"
                color-scheme="success"
                type="submit"
              >
                {{ $t('GENERAL.SAVE') }}
              </woot-button>
            </div>
          </div>
        </form>
      </div>
    </woot-modal>

    <!-- Modal de confirmação de exclusão -->
    <woot-confirm-delete-modal
      :show.sync="showDeleteConfirmation"
      :title="$t('HELP_CHAT.ARTICLES.DELETE.CONFIRM.TITLE')"
      :message="deleteMessage"
      :confirm-text="$t('HELP_CHAT.ARTICLES.DELETE.CONFIRM.YES')"
      :reject-text="$t('HELP_CHAT.ARTICLES.DELETE.CONFIRM.NO')"
      @confirm="deleteArticle"
      @close="hideDeleteConfirmation"
    />
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import { formatUnixDate } from '../../../helper/DateHelper';

export default {
  name: 'HelpChatArticles',
  data() {
    return {
      searchQuery: '',
      searchTimeout: null,
      showArticleViewModal: false,
      showArticleFormModal: false,
      isEditingArticle: false,
      articleForm: {
        title: '',
        content: '',
        active: true,
        tags: [],
      },
      newTag: '',
      isSubmittingArticle: false,
      showDeleteConfirmation: false,
      articleToDelete: null,
      deleteMessage: '',
    };
  },
  validations: {
    articleForm: {
      title: { required },
      content: { required },
    },
  },
  computed: {
    ...mapGetters({
      articles: 'helpChat/getArticles',
      currentArticle: 'helpChat/getCurrentArticle',
      uiFlags: 'helpChat/getUIFlags',
      currentUser: 'getCurrentUser',
    }),
    isAdmin() {
      return this.currentUser.role === 'administrator';
    },
    articleFormTitle() {
      return this.isEditingArticle
        ? this.$t('HELP_CHAT.ARTICLES.EDIT.TITLE')
        : this.$t('HELP_CHAT.ARTICLES.ADD.TITLE');
    },
  },
  mounted() {
    this.fetchArticles();
  },
  methods: {
    async fetchArticles() {
      try {
        await this.$store.dispatch('helpChat/fetchArticles');
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.ARTICLES.FETCH_ERROR'));
      }
    },
    formatDate(date) {
      return formatUnixDate(date);
    },
    calculateHelpfulPercentage(article) {
      const total = article.helpful_count + article.not_helpful_count;
      if (total === 0) return 0;
      return Math.round((article.helpful_count / total) * 100);
    },
    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchArticles();
      }, 500);
    },
    async searchArticles() {
      try {
        if (this.searchQuery) {
          await this.$store.dispatch('helpChat/searchArticles', this.searchQuery);
        } else {
          await this.fetchArticles();
        }
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.ARTICLES.SEARCH_ERROR'));
      }
    },
    clearSearch() {
      this.searchQuery = '';
      this.fetchArticles();
    },
    async viewArticle(articleId) {
      try {
        await this.$store.dispatch('helpChat/fetchArticle', articleId);
        this.showArticleViewModal = true;
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.ARTICLES.VIEW_ERROR'));
      }
    },
    openAddArticle() {
      this.isEditingArticle = false;
      this.articleForm = {
        title: '',
        content: '',
        active: true,
        tags: [],
      };
      this.showArticleFormModal = true;
    },
    async openEditArticle(articleId) {
      try {
        await this.$store.dispatch('helpChat/fetchArticle', articleId);
        this.isEditingArticle = true;
        this.articleForm = {
          title: this.currentArticle.title,
          content: this.currentArticle.content,
          active: this.currentArticle.active,
          tags: [...(this.currentArticle.tags || [])],
        };
        this.showArticleFormModal = true;
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.ARTICLES.FETCH_ERROR'));
      }
    },
    addTag() {
      const tag = this.newTag.trim();
      if (tag && !this.articleForm.tags.includes(tag)) {
        this.articleForm.tags.push(tag);
      }
      this.newTag = '';
    },
    removeTag(index) {
      this.articleForm.tags.splice(index, 1);
    },
    async submitArticle() {
      this.$v.articleForm.$touch();
      if (this.$v.articleForm.$invalid) {
        return;
      }

      this.isSubmittingArticle = true;
      try {
        if (this.isEditingArticle) {
          await this.$store.dispatch('helpChat/updateArticle', {
            id: this.currentArticle.id,
            ...this.articleForm,
          });
          this.showAlert(this.$t('HELP_CHAT.ARTICLES.EDIT_SUCCESS'), 'success');
        } else {
          await this.$store.dispatch('helpChat/createArticle', this.articleForm);
          this.showAlert(this.$t('HELP_CHAT.ARTICLES.ADD_SUCCESS'), 'success');
        }
        this.showArticleFormModal = false;
        this.fetchArticles();
      } catch (error) {
        this.showAlert(
          this.isEditingArticle
            ? this.$t('HELP_CHAT.ARTICLES.EDIT_ERROR')
            : this.$t('HELP_CHAT.ARTICLES.ADD_ERROR')
        );
      } finally {
        this.isSubmittingArticle = false;
      }
    },
    confirmDeleteArticle(articleId, articleTitle) {
      this.articleToDelete = articleId;
      this.deleteMessage = this.$t('HELP_CHAT.ARTICLES.DELETE.CONFIRM.MESSAGE', {
        articleTitle,
      });
      this.showDeleteConfirmation = true;
    },
    hideDeleteConfirmation() {
      this.showDeleteConfirmation = false;
      this.articleToDelete = null;
      this.deleteMessage = '';
    },
    async deleteArticle() {
      try {
        await this.$store.dispatch('helpChat/deleteArticle', this.articleToDelete);
        this.showAlert(this.$t('HELP_CHAT.ARTICLES.DELETE_SUCCESS'), 'success');
        this.fetchArticles();
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.ARTICLES.DELETE_ERROR'));
      } finally {
        this.hideDeleteConfirmation();
      }
    },
    showAlert(message, type = 'error') {
      this.$store.dispatch('notifications/create', {
        type,
        message,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-normal);
  
  .woot-input {
    flex: 1;
    margin-right: var(--space-small);
  }
}

.no-items-error-message {
  margin-top: var(--space-large);
  text-align: center;
  color: var(--s-600);
}

.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  
  &.active {
    background-color: var(--g-400);
    color: var(--white);
  }
  
  &.inactive {
    background-color: var(--s-300);
    color: var(--white);
  }
}

.article-view {
  .article-content {
    margin-bottom: var(--space-normal);
    line-height: 1.5;
  }
  
  .article-meta {
    border-top: 1px solid var(--s-200);
    padding-top: var(--space-small);
    
    .meta-item {
      margin-bottom: var(--space-smaller);
      
      .label {
        font-weight: 600;
        margin-right: var(--space-smaller);
      }
    }
  }
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--s-300);
  border-radius: 4px;
  padding: 5px;
  min-height: 38px;
  
  .tag-item {
    background-color: var(--s-100);
    border-radius: 3px;
    padding: 2px 8px;
    margin: 3px;
    display: flex;
    align-items: center;
    
    span {
      margin-right: 5px;
    }
    
    .icon {
      cursor: pointer;
      font-size: 14px;
      
      &:hover {
        color: var(--r-500);
      }
    }
  }
  
  input {
    flex: 1;
    min-width: 100px;
    border: none;
    outline: none;
    padding: 5px;
    margin: 3px;
  }
}

.error-message {
  color: var(--r-500);
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
}

.modal-footer {
  margin-top: var(--space-medium);
}
</style>
