<template>
  <div class="layout-themes-view">
    <div class="flex flex-col h-full w-full">
      <div class="flex justify-between items-center mb-4">
        <h1 class="page-title text-xl font-medium">
          {{ $t('LAYOUT_CUSTOMIZATION.THEMES.HEADER') }}
        </h1>
        <div class="flex">
          <woot-button
            color-scheme="primary"
            icon="plus"
            @click="openAddThemeModal"
          >
            {{ $t('LAYOUT_CUSTOMIZATION.THEMES.ADD') }}
          </woot-button>
        </div>
      </div>

      <div v-if="uiFlags.isFetching" class="h-full flex items-center justify-center">
        <spinner size="medium" />
      </div>
      <div v-else-if="!themes.length" class="h-full flex items-center justify-center">
        <div class="text-center">
          <h3 class="text-lg font-medium mb-2">
            {{ $t('LAYOUT_CUSTOMIZATION.THEMES.EMPTY.TITLE') }}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {{ $t('LAYOUT_CUSTOMIZATION.THEMES.EMPTY.DESCRIPTION') }}
          </p>
          <woot-button
            color-scheme="primary"
            icon="plus"
            @click="openAddThemeModal"
          >
            {{ $t('LAYOUT_CUSTOMIZATION.THEMES.ADD') }}
          </woot-button>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="theme in themes"
          :key="theme.id"
          class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:border-slate-200 dark:hover:border-slate-600 transition-all"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-medium">{{ theme.name }}</h3>
            <div class="flex">
              <woot-button
                variant="clear"
                color-scheme="secondary"
                icon="edit"
                size="small"
                @click="goToThemeEditor(theme.id)"
              />
              <woot-button
                v-if="!theme.is_active"
                variant="clear"
                color-scheme="alert"
                icon="delete"
                size="small"
                @click="confirmDeleteTheme(theme)"
              />
            </div>
          </div>
          
          <div class="mb-4 flex items-center">
            <div v-if="theme.logo" class="w-16 h-16 mr-4 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center overflow-hidden">
              <img :src="theme.logo.url" :alt="theme.name" class="max-w-full max-h-full object-contain" />
            </div>
            <div v-else class="w-16 h-16 mr-4 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center">
              <span class="text-slate-400 dark:text-slate-500">
                <i class="icon-image text-2xl"></i>
              </span>
            </div>
            <div>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                {{ theme.site_name || $t('LAYOUT_CUSTOMIZATION.THEMES.NO_SITE_NAME') }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-500">
                {{ formatDate(theme.updated_at) }}
              </p>
            </div>
          </div>
          
          <div class="flex justify-between">
            <woot-button
              v-if="!theme.is_active"
              color-scheme="primary"
              size="small"
              @click="activateTheme(theme.id)"
            >
              {{ $t('LAYOUT_CUSTOMIZATION.THEMES.ACTIVATE') }}
            </woot-button>
            <woot-badge
              v-else
              color-scheme="success"
              size="small"
            >
              {{ $t('LAYOUT_CUSTOMIZATION.THEMES.ACTIVE') }}
            </woot-badge>
          </div>
        </div>
      </div>
    </div>

    <woot-modal :show.sync="showAddThemeModal" :title="$t('LAYOUT_CUSTOMIZATION.THEMES.ADD_MODAL.TITLE')">
      <div class="p-4">
        <form @submit.prevent="createTheme">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="theme-name">
              {{ $t('LAYOUT_CUSTOMIZATION.THEMES.FORM.NAME.LABEL') }}
            </label>
            <input
              id="theme-name"
              v-model="themeForm.name"
              type="text"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('LAYOUT_CUSTOMIZATION.THEMES.FORM.NAME.PLACEHOLDER')"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="theme-site-name">
              {{ $t('LAYOUT_CUSTOMIZATION.THEMES.FORM.SITE_NAME.LABEL') }}
            </label>
            <input
              id="theme-site-name"
              v-model="themeForm.site_name"
              type="text"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('LAYOUT_CUSTOMIZATION.THEMES.FORM.SITE_NAME.PLACEHOLDER')"
            />
          </div>
          <div class="flex justify-end">
            <woot-button
              variant="clear"
              color-scheme="secondary"
              class="mr-2"
              @click="showAddThemeModal = false"
            >
              {{ $t('CANCEL') }}
            </woot-button>
            <woot-button
              color-scheme="primary"
              type="submit"
              :loading="uiFlags.isCreating"
            >
              {{ $t('CREATE') }}
            </woot-button>
          </div>
        </form>
      </div>
    </woot-modal>

    <woot-confirm-dialog
      :show.sync="showDeleteConfirmation"
      :title="$t('LAYOUT_CUSTOMIZATION.THEMES.DELETE.TITLE')"
      :message="$t('LAYOUT_CUSTOMIZATION.THEMES.DELETE.MESSAGE', { themeName: selectedTheme?.name })"
      :confirm-text="$t('DELETE')"
      :reject-text="$t('CANCEL')"
      @confirm="deleteTheme"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LayoutThemes',
  data() {
    return {
      showAddThemeModal: false,
      showDeleteConfirmation: false,
      selectedTheme: null,
      themeForm: {
        name: '',
        site_name: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      themes: 'layoutCustomization/getAllThemes',
      uiFlags: 'layoutCustomization/getUIFlags',
    }),
  },
  mounted() {
    this.fetchThemes();
  },
  methods: {
    async fetchThemes() {
      try {
        await this.$store.dispatch('layoutCustomization/fetchThemes');
      } catch (error) {
        this.showAlert(this.$t('LAYOUT_CUSTOMIZATION.THEMES.FETCH_ERROR'), 'error');
      }
    },
    openAddThemeModal() {
      this.themeForm = {
        name: '',
        site_name: '',
      };
      this.showAddThemeModal = true;
    },
    async createTheme() {
      try {
        const response = await this.$store.dispatch('layoutCustomization/createTheme', this.themeForm);
        this.showAlert(this.$t('LAYOUT_CUSTOMIZATION.THEMES.CREATE_SUCCESS'));
        this.showAddThemeModal = false;
        
        // Navegar para o editor do tema recém-criado
        if (response && response.id) {
          this.goToThemeEditor(response.id);
        }
      } catch (error) {
        this.showAlert(this.$t('LAYOUT_CUSTOMIZATION.THEMES.CREATE_ERROR'), 'error');
      }
    },
    goToThemeEditor(themeId) {
      this.$router.push({ name: 'layout_theme_editor', params: { themeId } });
    },
    confirmDeleteTheme(theme) {
      this.selectedTheme = theme;
      this.showDeleteConfirmation = true;
    },
    async deleteTheme() {
      try {
        await this.$store.dispatch('layoutCustomization/deleteTheme', this.selectedTheme.id);
        this.showAlert(this.$t('LAYOUT_CUSTOMIZATION.THEMES.DELETE_SUCCESS'));
        this.showDeleteConfirmation = false;
      } catch (error) {
        this.showAlert(this.$t('LAYOUT_CUSTOMIZATION.THEMES.DELETE_ERROR'), 'error');
      }
    },
    async activateTheme(themeId) {
      try {
        await this.$store.dispatch('layoutCustomization/activateTheme', themeId);
        this.showAlert(this.$t('LAYOUT_CUSTOMIZATION.THEMES.ACTIVATE_SUCCESS'));
      } catch (error) {
        this.showAlert(this.$t('LAYOUT_CUSTOMIZATION.THEMES.ACTIVATE_ERROR'), 'error');
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(this.$i18n.locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    },
    showAlert(message, type = 'success') {
      this.$store.dispatch('notifications/create', {
        type,
        message,
      });
    },
  },
};
</script>
