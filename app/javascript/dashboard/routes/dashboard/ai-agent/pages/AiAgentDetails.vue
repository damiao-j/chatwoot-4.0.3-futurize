<template>
  <div class="ai-agent-details">
    <page-header
      :title="agent.name || $t('AI_AGENT.DETAILS.TITLE')"
      :header-content="agent.description"
    >
      <div class="page-header-actions">
        <woot-button
          color-scheme="secondary"
          icon="arrow-left"
          @click="goBack"
        >
          {{ $t('BACK') }}
        </woot-button>
      </div>
    </page-header>

    <div class="section-wrapper">
      <div class="section-body">
        <woot-loading-state
          v-if="uiFlags.isFetchingAgent"
          :message="$t('LOADING')"
        />

        <div v-else class="agent-details">
          <div class="agent-basic-info">
            <div class="form-section">
              <h3 class="form-section-title">
                {{ $t('AI_AGENT.CREATE.BASIC_INFO') }}
              </h3>

              <div class="form-row">
                <woot-input
                  v-model="agent.name"
                  :label="$t('AI_AGENT.CREATE.NAME')"
                  :placeholder="$t('AI_AGENT.CREATE.NAME_PLACEHOLDER')"
                  :error="errors.name"
                  required
                />
              </div>

              <div class="form-row">
                <woot-input
                  v-model="agent.description"
                  :label="$t('AI_AGENT.CREATE.DESCRIPTION')"
                  :placeholder="$t('AI_AGENT.CREATE.DESCRIPTION_PLACEHOLDER')"
                  :error="errors.description"
                  input-type="textarea"
                  required
                />
              </div>

              <div class="form-row">
                <woot-toggle-switch
                  v-model="agent.active"
                  :label="$t('AI_AGENT.CREATE.ACTIVE')"
                />
              </div>

              <div class="form-footer">
                <woot-button
                  color-scheme="primary"
                  @click="updateAgent"
                  :loading="uiFlags.isUpdatingAgent"
                >
                  {{ $t('AI_AGENT.DETAILS.SAVE_BUTTON') }}
                </woot-button>
              </div>
            </div>
          </div>

          <div class="agent-tabs">
            <woot-tabs :index="activeTabIndex" @change="onTabChange">
              <woot-tabs-item :name="$t('AI_AGENT.DETAILS.TABS.PARAMETERS')">
                <parameters-manager :agent-id="agentId" />
              </woot-tabs-item>
              <woot-tabs-item :name="$t('AI_AGENT.DETAILS.TABS.WEBHOOKS')">
                <webhooks-manager :agent-id="agentId" />
              </woot-tabs-item>
            </woot-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ParametersManager from '../components/ParametersManager.vue';
import WebhooksManager from '../components/WebhooksManager.vue';

export default {
  name: 'AiAgentDetails',
  components: {
    ParametersManager,
    WebhooksManager,
  },
  data() {
    return {
      activeTabIndex: 0,
      agent: {
        name: '',
        description: '',
        active: true,
        settings: {},
      },
      errors: {
        name: '',
        description: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      currentAgent: 'aiAgent/getCurrentAgent',
      uiFlags: 'aiAgent/getUIFlags',
    }),
    agentId() {
      return this.$route.params.agentId;
    },
  },
  mounted() {
    this.fetchAgent();
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'ai_agents' });
    },
    async fetchAgent() {
      try {
        await this.$store.dispatch('aiAgent/fetchAgent', this.agentId);
        this.agent = { ...this.currentAgent };
      } catch (error) {
        this.showAlert(this.$t('ERROR'), error.message);
      }
    },
    onTabChange(index) {
      this.activeTabIndex = index;
    },
    validateForm() {
      this.errors = {
        name: '',
        description: '',
      };

      let isValid = true;

      if (!this.agent.name.trim()) {
        this.errors.name = this.$t('FORMS.ERROR.REQUIRED');
        isValid = false;
      }

      if (!this.agent.description.trim()) {
        this.errors.description = this.$t('FORMS.ERROR.REQUIRED');
        isValid = false;
      }

      return isValid;
    },
    async updateAgent() {
      if (!this.validateForm()) {
        return;
      }

      try {
        await this.$store.dispatch('aiAgent/updateAgent', {
          id: this.agentId,
          ...this.agent,
        });
        this.showAlert(
          this.$t('SUCCESS'),
          this.$t('AI_AGENT.DETAILS.SUCCESS')
        );
      } catch (error) {
        this.showAlert(
          this.$t('ERROR'),
          this.$t('AI_AGENT.DETAILS.ERROR')
        );
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
.agent-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-medium);
}

.form-section {
  background-color: var(--white);
  border: 1px solid var(--s-100);
  border-radius: var(--border-radius-medium);
  padding: var(--space-large);
  margin-bottom: var(--space-medium);
}

.form-section-title {
  font-size: var(--font-size-medium);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-medium);
  color: var(--s-900);
}

.form-row {
  margin-bottom: var(--space-medium);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--space-medium) 0;
}

.agent-tabs {
  background-color: var(--white);
  border: 1px solid var(--s-100);
  border-radius: var(--border-radius-medium);
}
</style>
