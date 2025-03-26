<template>
  <div class="help-chat-window" v-if="isOpen" :class="windowPosition">
    <div class="help-chat-header" :style="{ backgroundColor: buttonColor }">
      <div class="title">{{ chatTitle }}</div>
      <div class="actions">
        <i class="icon ion-close-round" @click="closeChat"></i>
      </div>
    </div>
    
    <div class="help-chat-body">
      <div class="messages-container" ref="messagesContainer">
        <div v-if="!currentConversation.id" class="welcome-message">
          {{ welcomeMessage }}
        </div>
        
        <template v-else>
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
                <div class="suggested-title">Artigos sugeridos:</div>
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
            <div class="message-time">
              {{ formatTime(message.created_at) }}
            </div>
          </div>
        </template>
      </div>
      
      <div v-if="showArticleView" class="article-view">
        <div class="article-header">
          <i class="icon ion-arrow-left-c" @click="closeArticle"></i>
          <div class="article-title">{{ currentArticle.title }}</div>
        </div>
        <div class="article-content" v-html="currentArticle.content"></div>
        <div class="article-feedback">
          <div>Este artigo foi útil?</div>
          <div class="feedback-buttons">
            <button @click="articleFeedback(true)" class="helpful-button">Sim</button>
            <button @click="articleFeedback(false)" class="not-helpful-button">Não</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="help-chat-footer" v-if="!showArticleView">
      <textarea 
        v-model="newMessage" 
        placeholder="Digite sua mensagem..." 
        @keydown.enter.prevent="sendMessage"
        ref="messageInput"
      ></textarea>
      <button class="send-button" @click="sendMessage" :disabled="!newMessage.trim()">
        <i class="icon ion-paper-airplane"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatUnixDate } from '../../../helper/DateHelper';

export default {
  name: 'HelpChatWindow',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newMessage: '',
      showArticleView: false,
      currentArticleId: null,
    };
  },
  computed: {
    ...mapGetters({
      settings: 'helpChat/getSettings',
      currentConversation: 'helpChat/getCurrentConversation',
      messages: 'helpChat/getMessages',
      currentArticle: 'helpChat/getCurrentArticle',
      uiFlags: 'helpChat/getUIFlags',
      currentUser: 'getCurrentUser',
    }),
    buttonColor() {
      return this.settings?.ui_settings?.button_color || '#1f93ff';
    },
    windowPosition() {
      const position = this.settings?.ui_settings?.button_position || 'bottom-right';
      return `position-${position}`;
    },
    chatTitle() {
      return this.settings?.ui_settings?.chat_title || 'Ajuda';
    },
    welcomeMessage() {
      return this.settings?.ui_settings?.welcome_message || 'Olá! Como podemos ajudar você hoje?';
    },
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.initializeChat();
      } else {
        this.showArticleView = false;
      }
    },
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
  },
  methods: {
    async initializeChat() {
      try {
        // Carregar configurações se ainda não estiverem carregadas
        if (!this.settings.id) {
          await this.$store.dispatch('helpChat/fetchSettings');
        }
        
        // Verificar se já existe uma conversa ativa
        if (!this.currentConversation.id) {
          // Criar nova conversa
          const conversationData = {
            browser_info: navigator.userAgent,
            browser_language: navigator.language,
            referer: document.referrer,
            create_welcome_message: true,
          };
          
          // Se o usuário estiver logado, associar a conversa a ele
          if (this.currentUser.id) {
            conversationData.user_id = this.currentUser.id;
          }
          
          await this.$store.dispatch('helpChat/createConversation', conversationData);
        }
        
        this.$nextTick(() => {
          this.focusMessageInput();
        });
      } catch (error) {
        console.error('Erro ao inicializar chat:', error);
      }
    },
    closeChat() {
      this.$emit('close-chat');
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return;
      
      try {
        const messageData = {
          content: this.newMessage,
          message_type: 'incoming',
          sender_type: this.currentUser.id ? 'User' : 'Guest',
          sender_id: this.currentUser.id || null,
        };
        
        await this.$store.dispatch('helpChat/createMessage', {
          conversationId: this.currentConversation.id,
          ...messageData,
        });
        
        this.newMessage = '';
        this.focusMessageInput();
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    },
    async viewArticle(articleId) {
      try {
        this.currentArticleId = articleId;
        await this.$store.dispatch('helpChat/fetchArticle', articleId);
        this.showArticleView = true;
      } catch (error) {
        console.error('Erro ao carregar artigo:', error);
      }
    },
    closeArticle() {
      this.showArticleView = false;
      this.currentArticleId = null;
    },
    async articleFeedback(isHelpful) {
      try {
        const articleData = {
          ...this.currentArticle,
        };
        
        if (isHelpful) {
          articleData.helpful_count = (this.currentArticle.helpful_count || 0) + 1;
        } else {
          articleData.not_helpful_count = (this.currentArticle.not_helpful_count || 0) + 1;
        }
        
        await this.$store.dispatch('helpChat/updateArticle', {
          id: this.currentArticle.id,
          ...articleData,
        });
        
        // Adicionar mensagem de feedback
        const feedbackMessage = isHelpful 
          ? 'Obrigado pelo feedback positivo!'
          : 'Obrigado pelo feedback. Vamos trabalhar para melhorar este artigo.';
        
        const messageData = {
          content: feedbackMessage,
          message_type: 'activity',
          sender_type: 'System',
          sender_id: null,
        };
        
        await this.$store.dispatch('helpChat/createMessage', {
          conversationId: this.currentConversation.id,
          ...messageData,
        });
        
        this.closeArticle();
      } catch (error) {
        console.error('Erro ao enviar feedback:', error);
      }
    },
    getMessageClass(message) {
      if (message.message_type === 'activity') {
        return 'activity';
      }
      if (message.message_type === 'ai') {
        return 'ai';
      }
      return message.sender_type === 'User' ? 'user' : 'agent';
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
  },
};
</script>

<style lang="scss" scoped>
.help-chat-window {
  position: fixed;
  width: 360px;
  height: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  z-index: 999;
  overflow: hidden;
  
  &.position-bottom-right {
    bottom: 90px;
    right: 20px;
  }
  
  &.position-bottom-left {
    bottom: 90px;
    left: 20px;
  }
  
  &.position-top-right {
    top: 90px;
    right: 20px;
  }
  
  &.position-top-left {
    top: 90px;
    left: 20px;
  }
  
  .help-chat-header {
    padding: 15px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-weight: 600;
      font-size: 16px;
    }
    
    .actions {
      cursor: pointer;
      
      .icon {
        font-size: 20px;
      }
    }
  }
  
  .help-chat-body {
    flex: 1;
    overflow: hidden;
    position: relative;
    
    .messages-container {
      height: 100%;
      overflow-y: auto;
      padding: 15px;
      
      .welcome-message {
        text-align: center;
        color: var(--s-600);
        margin: 20px 0;
      }
      
      .message {
        margin-bottom: 15px;
        max-width: 80%;
        
        &.user {
          margin-left: auto;
          
          .message-content {
            background-color: var(--w-500);
            color: white;
            border-radius: 18px 18px 4px 18px;
          }
        }
        
        &.agent {
          margin-right: auto;
          
          .message-content {
            background-color: var(--s-100);
            color: var(--s-900);
            border-radius: 18px 18px 18px 4px;
          }
        }
        
        &.ai {
          margin-right: auto;
          
          .message-content {
            background-color: var(--b-100);
            color: var(--s-900);
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
          }
        }
        
        .message-content {
          padding: 10px 15px;
          word-break: break-word;
          
          .suggested-articles {
            margin-top: 10px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            padding-top: 8px;
            
            .suggested-title {
              font-weight: 600;
              margin-bottom: 5px;
              font-size: 13px;
            }
            
            .article-item {
              background-color: white;
              border-radius: 8px;
              padding: 8px;
              margin-bottom: 5px;
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
        
        .message-time {
          font-size: 11px;
          color: var(--s-500);
          margin-top: 4px;
          text-align: right;
        }
      }
    }
    
    .article-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: white;
      z-index: 2;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      
      .article-header {
        padding: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--s-200);
        
        .icon {
          margin-right: 10px;
          font-size: 20px;
          cursor: pointer;
        }
        
        .article-title {
          font-weight: 600;
          font-size: 16px;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      
      .article-content {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        line-height: 1.5;
      }
      
      .article-feedback {
        padding: 15px;
        border-top: 1px solid var(--s-200);
        text-align: center;
        
        .feedback-buttons {
          display: flex;
          justify-content: center;
          margin-top: 10px;
          
          button {
            margin: 0 5px;
            padding: 8px 15px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            
            &.helpful-button {
              background-color: var(--g-400);
              color: white;
            }
            
            &.not-helpful-button {
              background-color: var(--s-300);
              color: white;
            }
          }
        }
      }
    }
  }
  
  .help-chat-footer {
    padding: 10px 15px;
    border-top: 1px solid var(--s-200);
    display: flex;
    align-items: center;
    
    textarea {
      flex: 1;
      border: 1px solid var(--s-300);
      border-radius: 20px;
      padding: 8px 15px;
      resize: none;
      height: 40px;
      max-height: 100px;
      font-family: inherit;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: var(--w-500);
      }
    }
    
    .send-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--w-500);
      color: white;
      border: none;
      margin-left: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:disabled {
        background-color: var(--s-300);
        cursor: not-allowed;
      }
      
      .icon {
        font-size: 18px;
      }
    }
  }
}
</style>
