<template>
  <div class="webhooks-manager">
    <div class="webhooks-header">
      <h3 class="webhooks-title">{{ $t('AI_AGENT.WEBHOOKS.TITLE') }}</h3>
      <p class="webhooks-description">
        {{ $t('AI_AGENT.WEBHOOKS.DESCRIPTION') }}
      </p>
      <div class="webhooks-actions">
        <woot-button
          color-scheme="primary"
          icon="add"
          @click="showWebhookForm = true"
        >
          {{ $t('AI_AGENT.WEBHOOKS.ADD_BUTTON') }}
        </woot-button>
      </div>
    </div>

    <woot-loading-state
      v-if="uiFlags.isFetchingWebhooks"
      :message="$t('LOADING')"
    />

    <div v-else-if="!webhooks.length" class="empty-state">
      <span class="empty-state-title">
        {{ $t('AI_AGENT.WEBHOOKS.EMPTY.TITLE') }}
      </span>
      <span class="empty-state-message">
        {{ $t('AI_AGENT.WEBHOOKS.EMPTY.DESCRIPTION') }}
      </span>
      <woot-button
        color-scheme="primary"
        icon="add"
        @click="showWebhookForm = true"
      >
        {{ $t('AI_AGENT.WEBHOOKS.ADD_BUTTON') }}
      </woot-button>
    </div>

    <div v-else class="webhooks-list">
      <div
        v-for="webhook in webhooks"
        :key="webhook.id"
        class="webhook-item"
      >
        <div class="webhook-content">
          <div class="webhook-header">
            <h4 class="webhook-name">{{ webhook.event_name }}</h4>
            <span
              class="webhook-status"
              :class="{ active: webhook.active }"
            >
              {{ webhook.active ? $t('ACTIVE') : $t('INACTIVE') }}
            </span>
          </div>
          <div class="webhook-url">
            {{ webhook.url }}
          </div>
          <p v-if="webhook.description" class="webhook-description">
            {{ webhook.description }}
          </p>
          <div v-if="Object.keys(webhook.headers).length" class="webhook-headers">
            <span class="webhook-headers-label">{{ $t('HEADERS') }}:</span>
            <div class="webhook-headers-list">
              <div
                v-for="(value, key) in webhook.headers"
                :key="key"
                class="webhook-header-item"
              >
                <span class="webhook-header-key">{{ key }}:</span>
                <span class="webhook-header-value">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="webhook-actions">
          <woot-button
            variant="clear"
            color-scheme="secondary"
            icon="edit"
            @click="editWebhook(webhook)"
          />
          <woot-button
            variant="clear"
            color-scheme="secondary"
            icon="play"
            @click="testWebhook(webhook.id)"
            :loading="testingWebhookId === webhook.id"
          />
          <woot-button
            variant="clear"
            color-scheme="alert"
            icon="delete"
            @click="confirmDeleteWebhook(webhook.id)"
          />
        </div>
      </div>
    </div>

    <woot-modal
      :show.sync="showWebhookForm"
      :title="editMode ? $t('AI_AGENT.WEBHOOKS.FORM.EDIT_TITLE') : $t('AI_AGENT.WEBHOOKS.FORM.TITLE')"
      :on-close="closeWebhookForm"
    >
      <div class="webhook-form">
        <div class="form-row">
          <woot-input
            v-model="webhookForm.url"
            :label="$t('AI_AGENT.WEBHOOKS.FORM.URL')"
            :placeholder="$t('AI_AGENT.WEBHOOKS.FORM.URL_PLACEHOLDER')"
            :error="formErrors.url"
            required
          />
        </div>

        <div class="form-row">
          <label class="form-label">{{ $t('AI_AGENT.WEBHOOKS.FORM.EVENT') }}</label>
          <select v-model="webhookForm.event_name" class="form-select">
            <option value="agent_created">{{ $t('AI_AGENT.WEBHOOKS.FORM.EVENTS.AGENT_CREATED') }}</option>
            <option value="agent_updated">{{ $t('AI_AGENT.WEBHOOKS.FORM.EVENTS.AGENT_UPDATED') }}</option>
            <option value="agent_deleted">{{ $t('AI_AGENT.WEBHOOKS.FORM.EVENTS.AGENT_DELETED') }}</option>
          </select>
        </div>

        <div class="form-row">
          <woot-input
            v-model="webhookForm.description"
            :label="$t('AI_AGENT.WEBHOOKS.FORM.DESCRIPTION')"
            :placeholder="$t('AI_AGENT.WEBHOOKS.FORM.DESCRIPTION_PLACEHOLDER')"
            input-type="textarea"
          />
        </div>

        <div class="form-row">
          <woot-toggle-switch
            v-model="webhookForm.active"
            :label="$t('AI_AGENT.WEBHOOKS.FORM.ACTIVE')"
          />
        </div>

        <div class="form-row">
          <label class="form-label">
            {{ $t('AI_AGENT.WEBHOOKS.FORM.HEADERS') }}
            <span class="form-help">
              {{ $t('AI_AGENT.WEBHOOKS.FORM.HEADERS_HELP') }}
            </span>
          </label>
          <div
            v-for="(header, index) in headers"
            :key="index"
            class="header-row"
          >
            <woot-input
              v-model="header.key"
              :placeholder="$t('AI_AGENT.WEBHOOKS.FORM.HEADER_KEY')"
              class="header-key-input"
            />
            <woot-input
              v-model="header.value"
              :placeholder="$t('AI_AGENT.WEBHOOKS.FORM.HEADER_VALUE')"
              class="header-value-input"
            />
            <woot-button
              variant="clear"
              color-scheme="alert"
              icon="delete"
              @click="removeHeader(index)"
            />
          </div>
          <woot-button
            color-scheme="secondary"
            icon="add"
            @click="addHeader"
          >
            {{ $t('AI_AGENT.WEBHOOKS.FORM.ADD_HEADER') }}
          </woot-button>
        </div>
      </div>

      <div slot="footer" class="modal-footer">
        <woot-button
          color-scheme="secondary"
          @click="closeWebhookForm"
        >
          {{ $t('CANCEL') }}
        </woot-button>
        <woot-button
          color-scheme="primary"
          @click="saveWebhook"
          :loading="uiFlags.isCreatingWebhook || uiFlags.isUpdatingWebhook"
        >
          {{ $t('SAVE') }}
        </woot-button>
      </div>
    </woot-modal>

    <woot-confirm-dialog
      :show="showDeleteConfirmation"
      :title="$t('CONFIRM')"
      :message="$t('CONFIRM_DELETE')"
      :confirm-text="$t('DELETE')"
      :reject-text="$t('CANCEL')"
      @confirm="deleteWebhook"
      @reject="cancelDeleteWebhook"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'WebhooksManager',
  props: {
    agentId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      showWebhookForm: false,
      editMode: false,
      webhookForm: {
        url: '',
        event_name: 'agent_created',
        description: '',
        active: true,
        headers: {},
      },
      headers: [],
      formErrors: {
        url: '',
      },
      showDeleteConfirmation: false,
      webhookToDelete: null,
      testingWebhookId: null,
    };
  },
  computed: {
    ...mapGetters({
      webhooks: 'aiAgent/getWebhooks',
      uiFlags: 'aiAgent/getUIFlags',
    }),
  },
  mounted() {
    this.fetchWebhooks();
  },
  methods: {
    async fetchWebhooks() {
      try {
        await this.$store.dispatch('aiAgent/fetchWebhooks', this.agentId);
      } catch (error) {
        this.showAlert(this.$t('ERROR'), error.message);
      }
    },
    resetForm() {
      this.webhookForm = {
        url: '',
        event_name: 'agent_created',
        description: '',
        active: true,
        headers: {},
      };
      this.headers = [];
      this.formErrors = {
        url: '',
      };
    },
    editWebhook(webhook) {
      this.editMode = true;
      this.webhookForm = {
        id: webhook.id,
        url: webhook.url,
        event_name: webhook.event_name,
        description: webhook.description || '',
        active: webhook.active,
        headers: { ...webhook.headers },
      };
      this.headers = Object.entries(webhook.headers || {}).map(([key, value]) => ({ key, value }));
      this.showWebhookForm = true;
    },
    closeWebhookForm() {
      this.showWebhookForm = false;
      this.editMode = false;
      this.resetForm();
    },
    addHeader() {
      this.headers.push({ key: '', value: '' });
    },
    removeHeader(index) {
      this.headers.splice(index, 1);
    },
    validateForm() {
      this.formErrors = {
        url: '',
      };

      let isValid = true;

      if (!this.webhookForm.url.trim()) {
        this.formErrors.url = this.$t('FORMS.ERROR.REQUIRED');
        isValid = false;
      } else if (!/^https?:\/\/.+/.test(this.webhookForm.url)) {
        this.formErrors.url = this.$t('FORMS.ERROR.URL');
        isValid = false;
      }

      return isValid;
    },
    getHeadersObject() {
      const headers = {};
      this.headers.forEach(header => {
        if (header.key.trim() && header.value.trim()) {
          headers[header.key.trim()] = header.value.trim();
        }
      });
      return headers;
    },
    async saveWebhook() {
      if (!this.validateForm()) {
        return;
      }

      const headers = this.getHeadersObject();

      try {
        if (this.editMode) {
          await this.$store.dispatch('aiAgent/updateWebhook', {
            agentId: this.agentId,
            id: this.webhookForm.id,
            url: this.webhookForm.url,
            event_name: this.webhookForm.event_name,
            description: this.webhookForm.description,
            active: this.webhookForm.active,
            headers,
          });
        } else {
          await this.$store.dispatch('aiAgent/createWebhook', {
            agentId: this.agentId,
            url: this.webhookForm.url,
            event_name: this.webhookForm.event_name,
            description: this.webhookForm.description,
            active: this.webhookForm.active,
            headers,
          });
        }
        this.showAlert(
          this.$t('SUCCESS'),
          this.$t('AI_AGENT.WEBHOOKS.SAVE_SUCCESS')
        );
        this.closeWebhookForm();
      } catch (error) {
        this.showAlert(
          this.$t('ERROR'),
          this.$t('AI_AGENT.WEBHOOKS.SAVE_ERROR')
        );
      }
    },
    confirmDeleteWebhook(webhookId) {
      this.webhookToDelete = webhookId;
      this.showDeleteConfirmation = true;
    },
    async deleteWebhook() {
      try {
        await this.$store.dispatch('aiAgent/deleteWebhook', {
          agentId: this.agentId,
          id: this.webhookToDelete,
        });
        this.showAlert(
          this.$t('SUCCESS'),
          this.$t('AI_AGENT.WEBHOOKS.DELETE_SUCCESS')
        );
      } catch (error) {
        this.showAlert(
          this.$t('ERROR'),
          this.$t('AI_AGENT.WEBHOOKS.DELETE_ERROR')
        );
      } finally {
        this.cancelDeleteWebhook();
      }
    },
    cancelDeleteWebhook() {
      this.showDeleteConfirmation = false;
      this.webhookToDelete = null;
    },
    async testWebhook(webhookId) {
      this.testingWebhookId = webhookId;
      try {
        await this.$store.dispatch('aiAgent/testWebhook', {
          agentId: this.agentId,
          id: webhookId,
        });
        this.showAlert(
          this.$t('SUCCESS'),
          this.$t('AI_AGENT.WEBHOOKS.TEST_SUCCESS')
        );
      } catch (error) {
        this.showAlert(
          this.$t('ERROR'),
          this.$t('AI_AGENT.WEBHOOKS.TEST_ERROR')
        );
      } finally {
        this.testingWebhookId = null;
      }
    },
    showAlert(title, message) {
      this.$store.dispatch('notifications/create', {
        title,
        message,
        type: title === 'ERROR' ? 'error' : 'success',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.webhooks-header {
  margin-bottom: var(--space-medium);
}

.webhooks-title {
  font-size: var(--font-size-medium);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-smaller);
}

.webhooks-description {
  color: var(--s-600);
  margin-bottom: var(--space-small);
}

.webhooks-actions {
  margin-top: var(--space-small);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-large);
  text-align: center;

  .empty-state-title {
    font-size: var(--font-size-large);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--space-small);
  }

  .empty-state-message {
    color: var(--s-600);
    margin-bottom: var(--space-medium);
  }
}

.webhooks-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-small);
}

.webhook-item {
  display: flex;
  align-items: flex-start;
  background-color: var(--white);
  border: 1px solid var(--s-100);
  border-radius: var(--border-radius-small);
  padding: var(--space-small);
}

.webhook-content {
  flex: 1;
  padding: 0 var(--space-small);
}

.webhook-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-smaller);
  margin-bottom: var(--space-smaller);
}

.webhook-name {
  font-weight: var(--font-weight-medium);
  margin: 0;
}

.webhook-status {
  font-size: var(--font-size-small);
  background-color: var(--s-50);
  color: var(--s-700);
  padding: 2px var(--space-smaller);
  border-radius: var(--border-radius-small);

  &.active {
    background-color: var(--g-50);
    color: var(--g-800);
  }
}

.webhook-url {
  font-family: monospace;
  background-color: var(--s-50);
  padding: var(--space-smaller);
  border-radius: var(--border-radius-small);
  margin-bottom: var(--space-smaller);
  word-break: break-all;
}

.webhook-description {
  color: var(--s-600);
  font-size: var(--font-size-small);
  margin-bottom: var(--space-smaller);
}

.webhook-headers {
  display: flex;
  flex-direction: column;
  gap: var(--space-smaller);
  font-size: var(--font-size-small);
}

.webhook-headers-label {
  color: var(--s-700);
}

.webhook-headers-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-micro);
}

.webhook-header-item {
  display: flex;
  align-items: center;
  gap: var(--space-smaller);
}

.webhook-header-key {
  font-weight: var(--font-weight-medium);
}

.webhook-header-value {
  color: var(--s-700);
}

.webhook-actions {
  display: flex;
  gap: var(--space-smaller);
}

.webhook-form {
  padding: var(--space-small) 0;
}

.form-row {
  margin-bottom: var(--space-medium);
}

.form-label {
  display: block;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-smaller);
}

.form-help {
  font-weight: normal;
  color: var(--s-500);
}

.form-select {
  width: 100%;
  padding: var(--space-small);
  border: 1px solid var(--s-200);
  border-radius: var(--border-radius-small);
  background-color: var(--white);
}

.header-row {
  display: flex;
  align-items: center;
  gap: var(--space-smaller);
  margin-bottom: var(--space-smaller);
}

.header-key-input {
  flex: 1;
}

.header-value-input {
  flex: 2;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-small);
}
</style>
