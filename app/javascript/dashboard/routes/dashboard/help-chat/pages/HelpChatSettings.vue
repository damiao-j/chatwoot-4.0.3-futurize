<template>
  <div class="column content-box">
    <div class="row">
      <div class="small-8 columns with-right-space">
        <h1 class="page-title">
          {{ $t('HELP_CHAT.SETTINGS.HEADER') }}
        </h1>
      </div>
    </div>

    <woot-loading-state
      v-if="uiFlags.isFetchingSettings"
      :message="$t('HELP_CHAT.SETTINGS.LOADING')"
    />
    
    <div v-else class="settings-container">
      <div class="settings-section">
        <div class="section-header">
          <h2>{{ $t('HELP_CHAT.SETTINGS.GENERAL.TITLE') }}</h2>
          <div class="toggle-container">
            <woot-toggle-switch
              :value="settings.enabled"
              @input="toggleHelpChat"
              :disabled="uiFlags.isEnablingSettings || uiFlags.isDisablingSettings"
            />
            <span class="toggle-label">
              {{ settings.enabled ? $t('GENERAL.ENABLED') : $t('GENERAL.DISABLED') }}
            </span>
          </div>
        </div>
        
        <div class="section-content">
          <p class="section-description">
            {{ $t('HELP_CHAT.SETTINGS.GENERAL.DESCRIPTION') }}
          </p>
        </div>
      </div>
      
      <div class="settings-section">
        <div class="section-header">
          <h2>{{ $t('HELP_CHAT.SETTINGS.UI.TITLE') }}</h2>
        </div>
        
        <div class="section-content">
          <div class="row">
            <div class="medium-6 columns">
              <woot-input
                v-model="uiSettings.chat_title"
                :label="$t('HELP_CHAT.SETTINGS.UI.CHAT_TITLE.LABEL')"
                :placeholder="$t('HELP_CHAT.SETTINGS.UI.CHAT_TITLE.PLACEHOLDER')"
                :help-text="$t('HELP_CHAT.SETTINGS.UI.CHAT_TITLE.HELP_TEXT')"
              />
            </div>
            
            <div class="medium-6 columns">
              <label class="block-label">
                {{ $t('HELP_CHAT.SETTINGS.UI.BUTTON_COLOR.LABEL') }}
                <div class="color-picker-container">
                  <input
                    v-model="uiSettings.button_color"
                    type="color"
                    class="color-picker"
                  />
                  <span class="color-value">{{ uiSettings.button_color }}</span>
                </div>
                <span class="help-text">
                  {{ $t('HELP_CHAT.SETTINGS.UI.BUTTON_COLOR.HELP_TEXT') }}
                </span>
              </label>
            </div>
          </div>
          
          <div class="row">
            <div class="medium-6 columns">
              <label class="block-label">
                {{ $t('HELP_CHAT.SETTINGS.UI.BUTTON_POSITION.LABEL') }}
                <select v-model="uiSettings.button_position" class="dropdown">
                  <option value="bottom-right">{{ $t('HELP_CHAT.SETTINGS.UI.BUTTON_POSITION.BOTTOM_RIGHT') }}</option>
                  <option value="bottom-left">{{ $t('HELP_CHAT.SETTINGS.UI.BUTTON_POSITION.BOTTOM_LEFT') }}</option>
                  <option value="top-right">{{ $t('HELP_CHAT.SETTINGS.UI.BUTTON_POSITION.TOP_RIGHT') }}</option>
                  <option value="top-left">{{ $t('HELP_CHAT.SETTINGS.UI.BUTTON_POSITION.TOP_LEFT') }}</option>
                </select>
                <span class="help-text">
                  {{ $t('HELP_CHAT.SETTINGS.UI.BUTTON_POSITION.HELP_TEXT') }}
                </span>
              </label>
            </div>
            
            <div class="medium-6 columns">
              <label class="block-label">
                {{ $t('HELP_CHAT.SETTINGS.UI.WELCOME_MESSAGE.LABEL') }}
                <textarea
                  v-model="uiSettings.welcome_message"
                  class="woot-input__textarea"
                  :placeholder="$t('HELP_CHAT.SETTINGS.UI.WELCOME_MESSAGE.PLACEHOLDER')"
                  rows="3"
                ></textarea>
                <span class="help-text">
                  {{ $t('HELP_CHAT.SETTINGS.UI.WELCOME_MESSAGE.HELP_TEXT') }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <div class="section-header">
          <h2>{{ $t('HELP_CHAT.SETTINGS.KNOWLEDGE_BASE.TITLE') }}</h2>
          <div class="toggle-container">
            <woot-toggle-switch
              :value="knowledgeBaseSettings.enabled_kb"
              @input="toggleKnowledgeBase"
            />
            <span class="toggle-label">
              {{ knowledgeBaseSettings.enabled_kb ? $t('GENERAL.ENABLED') : $t('GENERAL.DISABLED') }}
            </span>
          </div>
        </div>
        
        <div class="section-content" v-if="knowledgeBaseSettings.enabled_kb">
          <div class="row">
            <div class="medium-6 columns">
              <div class="checkbox-wrap">
                <input
                  v-model="knowledgeBaseSettings.suggest_articles"
                  type="checkbox"
                  id="suggest-articles"
                />
                <label for="suggest-articles" class="checkbox-label">
                  {{ $t('HELP_CHAT.SETTINGS.KNOWLEDGE_BASE.SUGGEST_ARTICLES.LABEL') }}
                </label>
              </div>
              <span class="help-text block-help-text">
                {{ $t('HELP_CHAT.SETTINGS.KNOWLEDGE_BASE.SUGGEST_ARTICLES.HELP_TEXT') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <div class="section-header">
          <h2>{{ $t('HELP_CHAT.SETTINGS.AI.TITLE') }}</h2>
          <div class="toggle-container">
            <woot-toggle-switch
              :value="aiSettings.enabled_ai"
              @input="toggleAI"
            />
            <span class="toggle-label">
              {{ aiSettings.enabled_ai ? $t('GENERAL.ENABLED') : $t('GENERAL.DISABLED') }}
            </span>
          </div>
        </div>
        
        <div class="section-content" v-if="aiSettings.enabled_ai">
          <div class="row">
            <div class="medium-6 columns">
              <woot-input
                v-model="aiSettings.ai_model"
                :label="$t('HELP_CHAT.SETTINGS.AI.MODEL.LABEL')"
                :placeholder="$t('HELP_CHAT.SETTINGS.AI.MODEL.PLACEHOLDER')"
                :help-text="$t('HELP_CHAT.SETTINGS.AI.MODEL.HELP_TEXT')"
              />
            </div>
            
            <div class="medium-6 columns">
              <woot-input
                v-model="aiSettings.ai_webhook_url"
                :label="$t('HELP_CHAT.SETTINGS.AI.WEBHOOK_URL.LABEL')"
                :placeholder="$t('HELP_CHAT.SETTINGS.AI.WEBHOOK_URL.PLACEHOLDER')"
                :help-text="$t('HELP_CHAT.SETTINGS.AI.WEBHOOK_URL.HELP_TEXT')"
              />
            </div>
          </div>
          
          <div class="row">
            <div class="medium-12 columns">
              <label class="block-label">
                {{ $t('HELP_CHAT.SETTINGS.AI.PROMPT.LABEL') }}
                <textarea
                  v-model="aiSettings.ai_prompt"
                  class="woot-input__textarea"
                  :placeholder="$t('HELP_CHAT.SETTINGS.AI.PROMPT.PLACEHOLDER')"
                  rows="4"
                ></textarea>
                <span class="help-text">
                  {{ $t('HELP_CHAT.SETTINGS.AI.PROMPT.HELP_TEXT') }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-action">
        <woot-button
          color-scheme="primary"
          :is-loading="uiFlags.isUpdatingSettings"
          @click="saveSettings"
        >
          {{ $t('GENERAL.SAVE') }}
        </woot-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HelpChatSettings',
  data() {
    return {
      uiSettings: {
        button_color: '#1f93ff',
        button_position: 'bottom-right',
        chat_title: 'Ajuda',
        welcome_message: 'Olá! Como podemos ajudar você hoje?',
      },
      knowledgeBaseSettings: {
        enabled_kb: false,
        suggest_articles: true,
      },
      aiSettings: {
        enabled_ai: false,
        ai_model: 'gpt-3.5-turbo',
        ai_prompt: 'Você é um assistente de suporte amigável. Responda às perguntas do usuário de forma clara e concisa.',
        ai_webhook_url: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      settings: 'helpChat/getSettings',
      uiFlags: 'helpChat/getUIFlags',
      currentUser: 'getCurrentUser',
    }),
    isAdmin() {
      return this.currentUser.role === 'administrator';
    },
  },
  watch: {
    settings: {
      handler(newSettings) {
        if (newSettings.id) {
          this.loadSettingsToForm(newSettings);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.fetchSettings();
  },
  methods: {
    async fetchSettings() {
      try {
        await this.$store.dispatch('helpChat/fetchSettings');
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.SETTINGS.FETCH_ERROR'));
      }
    },
    loadSettingsToForm(settings) {
      // UI Settings
      this.uiSettings = {
        button_color: settings.ui_settings?.button_color || '#1f93ff',
        button_position: settings.ui_settings?.button_position || 'bottom-right',
        chat_title: settings.ui_settings?.chat_title || 'Ajuda',
        welcome_message: settings.ui_settings?.welcome_message || 'Olá! Como podemos ajudar você hoje?',
      };
      
      // Knowledge Base Settings
      this.knowledgeBaseSettings = {
        enabled_kb: settings.knowledge_base_settings?.enabled_kb || false,
        suggest_articles: settings.knowledge_base_settings?.suggest_articles || true,
      };
      
      // AI Settings
      this.aiSettings = {
        enabled_ai: settings.ai_settings?.enabled_ai || false,
        ai_model: settings.ai_settings?.ai_model || 'gpt-3.5-turbo',
        ai_prompt: settings.ai_settings?.ai_prompt || 'Você é um assistente de suporte amigável. Responda às perguntas do usuário de forma clara e concisa.',
        ai_webhook_url: settings.ai_settings?.ai_webhook_url || '',
      };
    },
    async saveSettings() {
      try {
        const settingsData = {
          ui_settings: this.uiSettings,
          knowledge_base_settings: this.knowledgeBaseSettings,
          ai_settings: this.aiSettings,
        };
        
        await this.$store.dispatch('helpChat/updateSettings', settingsData);
        this.showAlert(this.$t('HELP_CHAT.SETTINGS.SAVE_SUCCESS'), 'success');
      } catch (error) {
        this.showAlert(this.$t('HELP_CHAT.SETTINGS.SAVE_ERROR'));
      }
    },
    async toggleHelpChat(enabled) {
      try {
        if (enabled) {
          await this.$store.dispatch('helpChat/enableSettings');
        } else {
          await this.$store.dispatch('helpChat/disableSettings');
        }
        
        this.showAlert(
          enabled
            ? this.$t('HELP_CHAT.SETTINGS.ENABLE_SUCCESS')
            : this.$t('HELP_CHAT.SETTINGS.DISABLE_SUCCESS'),
          'success'
        );
      } catch (error) {
        this.showAlert(
          enabled
            ? this.$t('HELP_CHAT.SETTINGS.ENABLE_ERROR')
            : this.$t('HELP_CHAT.SETTINGS.DISABLE_ERROR')
        );
      }
    },
    toggleKnowledgeBase(enabled) {
      this.knowledgeBaseSettings.enabled_kb = enabled;
    },
    toggleAI(enabled) {
      this.aiSettings.enabled_ai = enabled;
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
.settings-container {
  padding: var(--space-normal) 0;
}

.settings-section {
  margin-bottom: var(--space-large);
  background-color: var(--white);
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  .section-header {
    padding: var(--space-normal);
    border-bottom: 1px solid var(--s-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }
    
    .toggle-container {
      display: flex;
      align-items: center;
      
      .toggle-label {
        margin-left: var(--space-smaller);
        font-size: 0.9rem;
      }
    }
  }
  
  .section-content {
    padding: var(--space-normal);
    
    .section-description {
      margin-bottom: var(--space-normal);
      color: var(--s-600);
    }
  }
}

.block-label {
  display: block;
  margin-bottom: var(--space-normal);
  
  .help-text {
    display: block;
    font-size: 0.8rem;
    color: var(--s-500);
    margin-top: 4px;
  }
}

.block-help-text {
  display: block;
  font-size: 0.8rem;
  color: var(--s-500);
  margin-top: 4px;
}

.color-picker-container {
  display: flex;
  align-items: center;
  
  .color-picker {
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .color-value {
    margin-left: var(--space-small);
    font-family: monospace;
  }
}

.checkbox-wrap {
  display: flex;
  align-items: center;
  
  input[type="checkbox"] {
    margin-right: var(--space-smaller);
  }
  
  .checkbox-label {
    margin-bottom: 0;
  }
}

.settings-action {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-large);
}
</style>
