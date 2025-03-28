<template>
  <div class="column content-box">
    <div class="row">
      <div class="small-8 columns with-right-space">
        <h1 class="page-title">
          {{ $t('HELP_CHAT.CONVERSATIONS.HEADER') }}
        </h1>
      </div>
      <div class="small-4 columns">
        <woot-button
          color-scheme="secondary"
          class-names="button--fixed-right-top"
          icon="refresh"
          @click="fetchConversations"
        >
          {{ $t('GENERAL.REFRESH') }}
        </woot-button>
      </div>
    </div>

    <div class="row">
      <div class="small-12 columns">
        <div class="filter-bar">
          <div class="filter-item">
            <label>{{ $t('HELP_CHAT.CONVERSATIONS.FILTER.STATUS') }}</label>
            <select v-model="filters.status" class="dropdown" @change="handleFilterChange">
              <option value="">{{ $t('HELP_CHAT.CONVERSATIONS.FILTER.ALL') }}</option>
              <option value="active">{{ $t('HELP_CHAT.CONVERSATIONS.FILTER.ACTIVE') }}</option>
              <option value="open">{{ $t('HELP_CHAT.CONVERSATIONS.FILTER.OPEN') }}</option>
              <option value="pending">{{ $t('HELP_CHAT.CONVERSATIONS.FILTER.PENDING') }}</option>
              <option value="resolved">{{ $t('HELP_CHAT.CONVERSATIONS.FILTER.RESOLVED') }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label>{{ $t('HELP_CHAT.CONVERSATIONS.FILTER.ASSIGNEE') }}</label>
            <select v-model="filters.assigneeId" class="dropdown" @change="handleFilterChange">
              <option value="">{{ $t('HELP_CHAT.CONVERSATIONS.FILTER.ANY_AGENT') }}</option>
              <option value="none">{{ $t('HELP_CHAT.CONVERSATIONS.FILTER.UNASSIGNED') }}</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent.id">
                {{ agent.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="small-12 columns">
        <woot-loading-state
          v-if="uiFlags.isFetchingConversations"
          :message="$t('HELP_CHAT.CONVERSATIONS.LOADING')"
        />
        <p v-else-if="!conversations.length" class="no-items-error-message">
          {{ $t('HELP_CHAT.CONVERSATIONS.NO_ITEMS') }}
        </p>
        <table v-else class="woot-table">
          <thead>
            <tr>
              <th>{{ $t('HELP_CHAT.CONVERSATIONS.COLUMNS.ID') }}</th>
              <th>{{ $t('HELP_CHAT.CONVERSATIONS.COLUMNS.USER') }}</th>
              <th>{{ $t('HELP_CHAT.CONVERSATIONS.COLUMNS.ASSIGNEE') }}</th>
              <th>{{ $t('HELP_CHAT.CONVERSATIONS.COLUMNS.STATUS') }}</th>
              <th>{{ $t('HELP_CHAT.CONVERSATIONS.COLUMNS.LAST_MESSAGE') }}</th>
              <th>{{ $t('HELP_CHAT.CONVERSATIONS.COLUMNS.CREATED_AT') }}</th>
              <th>{{ $t('HELP_CHAT.CONVERSATIONS.COLUMNS.ACTIONS') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="conversation in conversations" :key="conversation.id">
              <td>
                <a href="#" @click.prevent="viewConversation(conversation.id)">
                  #{{ conversation.id }}
                </a>
              </td>
              <td>
                {{ getUserName(conversation) }}
              </td>
              <td>
                <span v-if="conversation.assignee">
                  {{ conversation.assignee.name }}
                </span>
                <span v-else class="unassigned">
                  {{ $t('HELP_CHAT.CONVERSATIONS.UNASSIGNED') }}
                </span>
              </td>
              <td>
                <span
                  class="status-badge"
                  :class="conversation.status"
                >
                  {{ getStatusLabel(conversation.status) }}
                </span>
              </td>
              <td>
                <span v-if="conversation.last_message" class="last-message">
                  {{ truncateText(conversation.last_message.content, 30) }}
                </span>
                <span v-else class="no-message">
                  {{ $t('HELP_CHAT.CONVERSATIONS.NO_MESSAGES') }}
                </span>
              </td>
              <td>{{ formatDate(conversation.created_at) }}</td>
              <td>
                <div class="button-group">
                  <woot-button
                    variant="clear"
                    color-scheme="secondary"
                    icon="chat"
                    @click="viewConversation(conversation.id)"
                  />
                  <woot-dropdown v-if="isAdmin" position="bottom-right">
                    <template #dropdown-toggle>
                      <woot-button
                        variant="clear"
                        color-scheme="secondary"
                        icon="more"
                      />
                    </template>
                    <template #dropdown-content>
                      <woot-dropdown-item @click="openAssignModal(conversation)">
                        {{ $t('HELP_CHAT.CONVERSATIONS.ACTIONS.ASSIGN') }}
                      </woot-dropdown-item>
                      <woot-dropdown-item 
                        v-if="conversation.status !== 'resolved'"
                        @click="resolveConversation(conversation.id)"
                      >
                        {{ $t('HELP_CHAT.CONVERSATIONS.ACTIONS.RESOLVE') }}
                      </woot-dropdown-item>
                      <woot-dropdown-item 
                        v-if="conversation.status === 'resolved'"
                        @click="reopenConversation(conversation.id)"
                      >
                        {{ $t('HELP_CHAT.CONVERSATIONS.ACTIONS.REOPEN') }}
                      </woot-dropdown-item>
                    </template>
                  </woot-dropdown>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para visualizar conversa -->
    <woot-modal :show.sync="showConversationModal" :title="conversationTitle">
      <div class="conversation-view">
        <div class="conversation-header">
          <div class="conversation-info">
            <div class="info-item">
              <span class="label">{{ $t('HELP_CHAT.CONVERSATIONS.USER') }}:</span>
              <span>{{ getUserName(currentConversation) }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ $t('HELP_CHAT.CONVERSATIONS.STATUS') }}:</span>
              <span class="status-badge" :class="currentConversation.status">
                {{ getStatusLabel(currentConversation.status) }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">{{ $t('HELP_CHAT.CONVERSATIONS.ASSIGNEE') }}:</span>
              <span v-if="currentConversation.assignee">
                {{ currentConversation.assignee.name }}
              </span>
              <span v-else class="unassigned">
                {{ $t('HELP_CHAT.CONVERSATIONS.UNASSIGNED') }}
              </span>
            </div>
          </div>
          <div class="conversation-actions" v-if="isAdmin">
            <woot-button
              v-if="currentConversation.status !== 'resolved'"
              color-scheme="success"
              size="small"
              @click="resolveConversation(currentConversation.id)"
            >
              {{ $t('HELP_CHAT.CONVERSATIONS.ACTIONS.RESOLVE') }}
            </woot-button>
            <woot-button
              v-if="currentConversation.status === 'resolved'"
              color-scheme="warning"
              size="small"
              @click="reopenConversation(currentConversation.id)"
            >
              {{ $t('HELP_CHAT.CONVERSATIONS.ACTIONS.REOPEN') }}
            </woot-button>
            <woot-button
              color-scheme="secondary"
              size="small"
              @click="openAssignModal(currentConversation)"
            >
              {{ $t('HELP_CHAT.CONVERSATIONS.ACTIONS.ASSIGN') }}
            </woot-button>
          </div>
        </div>
        
        <div class="messages-container" ref="messagesContainer">
          <woot-loading-state
            v-if="uiFlags.isFetchingMessages"
            :message="$t('HELP_CHAT.MESSAGES.LOADING')"
          />
          <p v-else-if="!messages.length" class="no-items-message">
            {{ $t('HELP_CHAT.MESSAGES.NO_ITEMS') }}
          </p>
          <div v-else class="messages-list">
            <div 
              v-for="message in messages" 
              :key="message.id" 
              class="message" 
              :class="getMessageClass(message)"
            >
              <div class="message-content">
                <div v-if="message.message_type === 'activity'" class="activity-message">
                  {{ message.content }}
                </div>
                <div v-else>
                  {{ message.content }}
                </div>
                
                <!-- Artigos sugeridos -->
                <div v-if="message.content_attributes && message.content_attributes.suggested_articles" class="suggested-articles">
                  <div class="suggested-title">{{ $t('HELP_CHAT.MESSAGES.SUGGESTED_ARTICLES') }}:</div>
                  <div 
                    v-for="article in message.content_attributes.suggested_articles" 
                    :key="article.id"
                    class="article-item"
                    @click="viewArticle(article.id)"
                  >
                    <div class="article-title">{{ article.title }}</div>
                    <div class="article-snippet">{{ article.snippet }}</div>
                  </div>
                </div>
              </div>
              <div class="message-meta">
                <div class="message-sender" v-if="message.sender">
                  {{ message.sender.name || $t('HELP_CHAT.MESSAGES.SYSTEM') }}
                </div>
                <div class="message-time">
                  {{ formatTime(message.created_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="message-form" v-if="currentConversation.status !== 'resolved'">
          <textarea 
            v-model="newMessage" 
            :placeholder="$t('HELP_CHAT.MESSAGES.REPLY_PLACEHOLDER')" 
            @keydown.enter.prevent="sendMessage"
            ref="messageInput"
          ></textarea>
          <woot-button
            color-scheme="primary"
            :disabled="!newMessage.trim()"
            @click="sendMessage"
          >
            {{ $t('HELP_CHAT.MESSAGES.SEND') }}
          </woot-button>
        </div>
      </div>
    </woot-modal>

    <!-- Modal para atribuir conversa -->
    <woot-modal :show.sync="showAssignModal" :title="$t('HELP_CHAT.CONVERSATIONS.ASSIGN.TITLE')">
      <div class="assign-form">
        <div class="form-item">
          <label>{{ $t('HELP_CHAT.CONVERSATIONS.ASSIGN.SELECT_AGENT') }}</label>
          <select v-model="assigneeId" class="dropdown">
            <option value="">{{ $t('HELP_CHAT.CONVERSATIONS.ASSIGN.UNASSIGN') }}</option>
            <option v-for="agent in agents" :key="agent.id" :value="agent.id">
              {{ agent.name }}
            </option>
          </select>
        </div>
        
        <div class="modal-footer">
          <woot-button
            color-scheme="secondary"
            @click="showAssignModal = false"
          >
            {{ $t('GENERAL.CANCEL') }}
          </woot-button>
          <woot-button
            color-scheme="primary"
            @click="assignConversation"
            :is-loading="uiFlags.isAssigningConversation"
          >
            {{ $t('GENERAL.SAVE') }}
          </woot-button>
        </div>
      </div>
    </woot-modal>

    <!-- Modal para visualizar artigo -->
    <woot-modal :show.sync="showArticleModal" :title="currentArticle.title">
      <div class="article-view">
        <div class="article-content" v-html="currentArticle.content"></div>
      </div>
    </woot-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatUnixDate } from '../../../../../shared/helpers/DateHelper';

export default {
  name: 'HelpChatConversations',
  data() {
    return {
      filters: {
        status: '',
        assigneeId: '',
      },
      showConversationModal: false,
      showAssignModal: false,
      showArticleModal: false,
      assigneeId: '',
      conversationToAssign: null,
      newMessage: '',
      agents: [],
    };
  },
  computed: {
    ...mapGetters({
      conversations: 'helpChat/getConversations',
      currentConversation: 'helpChat/getCurrentConversation',
      messages: 'helpChat/getMessages',
      currentArticle: 'helpChat/getCurrentArticle',
      uiFlags: 'helpChat/getUIFlags',
      currentUser: 'getCurrentUser',
    }),
    isAdmin() {
      return this.currentUser.role === 'administrator';
    },
    conversationTitle() {
      return `${this.$t('HELP_CHAT.CONVERSATIONS.CONVERSATION')} #${this.currentConversation.id || ''}`;
    },
  },
  mounted() {
    this.fetchConversations();
    this.fetchAgents();
  },
  methods: {
    async fetchConversations() {
      try {
        await this.$store.dispatch('helpChat/fetchConversations', this.filters);
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.CONVERSATIONS.FETCH_ERROR'));
      }
    },
    async fetchAgents() {
      try {
        // Aqui você precisaria implementar uma chamada para buscar os agentes
        // Por enquanto, vamos usar dados de exemplo
        this.agents = [
          { id: 1, name: 'Agente 1' },
          { id: 2, name: 'Agente 2' },
          { id: 3, name: 'Agente 3' },
        ];
      } catch (error) {
        console.error('Erro ao buscar agentes:', error);
      }
    },
    handleFilterChange() {
      this.fetchConversations();
    },
    formatDate(date) {
      return formatUnixDate(date);
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    getUserName(conversation) {
      if (conversation.user) {
        return conversation.user.name || conversation.user.email || `ID: ${conversation.user.id}`;
      }
      return this.$t('HELP_CHAT.CONVERSATIONS.ANONYMOUS_USER');
    },
    getStatusLabel(status) {
      const statusMap = {
        open: this.$t('HELP_CHAT.CONVERSATIONS.STATUS.OPEN'),
        resolved: this.$t('HELP_CHAT.CONVERSATIONS.STATUS.RESOLVED'),
        pending: this.$t('HELP_CHAT.CONVERSATIONS.STATUS.PENDING'),
      };
      return statusMap[status] || status;
    },
    truncateText(text, length) {
      if (!text) return '';
      return text.length > length ? `${text.substring(0, length)}...` : text;
    },
    async viewConversation(conversationId) {
      try {
        await this.$store.dispatch('helpChat/fetchConversation', conversationId);
        this.showConversationModal = true;
        this.$nextTick(() => {
          this.scrollToBottom();
          this.focusMessageInput();
        });
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.CONVERSATIONS.VIEW_ERROR'));
      }
    },
    async viewArticle(articleId) {
      try {
        await this.$store.dispatch('helpChat/fetchArticle', articleId);
        this.showArticleModal = true;
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.ARTICLES.VIEW_ERROR'));
      }
    },
    openAssignModal(conversation) {
      this.conversationToAssign = conversation;
      this.assigneeId = conversation.assignee_id || '';
      this.showAssignModal = true;
    },
    async assignConversation() {
      if (!this.conversationToAssign) return;
      
      try {
        await this.$store.dispatch('helpChat/assignConversation', {
          id: this.conversationToAssign.id,
          assigneeId: this.assigneeId || null,
        });
        
        this.showAlert(this.$t('HELP_CHAT.CONVERSATIONS.ASSIGN.SUCCESS'), 'success');
        this.showAssignModal = false;
        
        // Atualizar a conversa atual se estiver visualizando
        if (this.currentConversation.id === this.conversationToAssign.id) {
          await this.$store.dispatch('helpChat/fetchConversation', this.conversationToAssign.id);
        }
        
        this.fetchConversations();
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.CONVERSATIONS.ASSIGN.ERROR'));
      }
    },
    async resolveConversation(conversationId) {
      try {
        await this.$store.dispatch('helpChat/resolveConversation', conversationId);
        this.showAlert(this.$t('HELP_CHAT.CONVERSATIONS.RESOLVE.SUCCESS'), 'success');
        
        // Atualizar a conversa atual se estiver visualizando
        if (this.currentConversation.id === conversationId) {
          await this.$store.dispatch('helpChat/fetchConversation', conversationId);
        }
        
        this.fetchConversations();
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.CONVERSATIONS.RESOLVE.ERROR'));
      }
    },
    async reopenConversation(conversationId) {
      try {
        await this.$store.dispatch('helpChat/reopenConversation', conversationId);
        this.showAlert(this.$t('HELP_CHAT.CONVERSATIONS.REOPEN.SUCCESS'), 'success');
        
        // Atualizar a conversa atual se estiver visualizando
        if (this.currentConversation.id === conversationId) {
          await this.$store.dispatch('helpChat/fetchConversation', conversationId);
        }
        
        this.fetchConversations();
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.CONVERSATIONS.REOPEN.ERROR'));
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return;
      
      try {
        const messageData = {
          content: this.newMessage,
          message_type: 'outgoing',
          sender_type: 'User',
          sender_id: this.currentUser.id,
        };
        
        await this.$store.dispatch('helpChat/createMessage', {
          conversationId: this.currentConversation.id,
          ...messageData,
        });
        
        this.newMessage = '';
        this.$nextTick(() => {
          this.scrollToBottom();
          this.focusMessageInput();
        });
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.MESSAGES.SEND_ERROR'));
      }
    },
    getMessageClass(message) {
      if (message.message_type === 'activity') {
        return 'activity';
      }
      if (message.message_type === 'ai') {
        return 'ai';
      }
      return message.message_type === 'incoming' ? 'user' : 'agent';
    },
    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
      }
    },
    focusMessageInput() {
      if (this.$refs.messageInput) {
        this.$refs.messageInput.focus();
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
.filter-bar {
  display: flex;
  margin-bottom: var(--space-normal);
  
  .filter-item {
    margin-right: var(--space-normal);
    
    label {
      display: block;
      margin-bottom: var(--space-micro);
      font-size: 0.9rem;
    }
    
    .dropdown {
      min-width: 150px;
    }
  }
}

.no-items-error-message, .no-items-message {
  margin-top: var(--space-large);
  text-align: center;
  color: var(--s-600);
}

.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  
  &.open {
    background-color: var(--w-400);
    color: var(--white);
  }
  
  &.resolved {
    background-color: var(--g-400);
    color: var(--white);
  }
  
  &.pending {
    background-color: var(--y-400);
    color: var(--s-900);
  }
}

.unassigned {
  color: var(--s-500);
  font-style: italic;
}

.last-message {
  color: var(--s-700);
  font-size: 0.9rem;
}

.no-message {
  color: var(--s-500);
  font-style: italic;
  font-size: 0.9rem;
}

.conversation-view {
  display: flex;
  flex-direction: column;
  height: 500px;
  
  .conversation-header {
    padding: var(--space-small);
    border-bottom: 1px solid var(--s-200);
    display: flex;
    justify-content: space-between;
    
    .conversation-info {
      .info-item {
        display: inline-block;
        margin-right: var(--space-normal);
        
        .label {
          font-weight: 600;
          margin-right: var(--space-micro);
        }
      }
    }
    
    .conversation-actions {
      button {
        margin-left: var(--space-smaller);
      }
    }
  }
  
  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-normal);
    
    .messages-list {
      .message {
        margin-bottom: var(--space-normal);
        display: flex;
        flex-direction: column;
        max-width: 80%;
        
        &.user {
          margin-left: auto;
          align-items: flex-end;
          
          .message-content {
            background-color: var(--s-100);
            border-radius: 18px 18px 4px 18px;
          }
        }
        
        &.agent {
          margin-right: auto;
          align-items: flex-start;
          
          .message-content {
            background-color: var(--w-100);
            border-radius: 18px 18px 18px 4px;
          }
        }
        
        &.ai {
          margin-right: auto;
          align-items: flex-start;
          
          .message-content {
            background-color: var(--b-100);
            border-radius: 18px 18px 18px 4px;
          }
        }
        
        &.activity {
          margin: 10px auto;
          max-width: 90%;
          
          .message-content {
            background-color: transparent;
            color: var(--s-600);
            font-style: italic;
            font-size: 12px;
            text-align: center;
            padding: 0;
          }
        }
        
        .message-content {
          padding: var(--space-small) var(--space-normal);
          word-break: break-word;
          
          .suggested-articles {
            margin-top: var(--space-small);
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            padding-top: var(--space-smaller);
            
            .suggested-title {
              font-weight: 600;
              margin-bottom: var(--space-smaller);
              font-size: 13px;
            }
            
            .article-item {
              background-color: white;
              border-radius: 8px;
              padding: var(--space-smaller);
              margin-bottom: var(--space-smaller);
              cursor: pointer;
              transition: background-color 0.2s;
              
              &:hover {
                background-color: var(--s-50);
              }
              
              .article-title {
                font-weight: 600;
                font-size: 13px;
                margin-bottom: 3px;
              }
              
              .article-snippet {
                font-size: 12px;
                color: var(--s-600);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
        
        .message-meta {
          margin-top: 4px;
          font-size: 11px;
          color: var(--s-500);
          padding: 0 var(--space-smaller);
          
          .message-sender {
            font-weight: 600;
            margin-right: var(--space-smaller);
          }
          
          .message-time {
            display: inline-block;
          }
        }
      }
    }
  }
  
  .message-form {
    padding: var(--space-small);
    border-top: 1px solid var(--s-200);
    display: flex;
    align-items: center;
    
    textarea {
      flex: 1;
      border: 1px solid var(--s-300);
      border-radius: 4px;
      padding: var(--space-smaller) var(--space-small);
      resize: none;
      height: 60px;
      font-family: inherit;
      font-size: 14px;
      margin-right: var(--space-small);
      
      &:focus {
        outline: none;
        border-color: var(--w-500);
      }
    }
  }
}

.assign-form {
  .form-item {
    margin-bottom: var(--space-normal);
    
    label {
      display: block;
      margin-bottom: var(--space-micro);
      font-weight: 600;
    }
    
    .dropdown {
      width: 100%;
    }
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-normal);
    
    button {
      margin-left: var(--space-small);
    }
  }
}

.article-view {
  .article-content {
    line-height: 1.5;
  }
}
</style>
