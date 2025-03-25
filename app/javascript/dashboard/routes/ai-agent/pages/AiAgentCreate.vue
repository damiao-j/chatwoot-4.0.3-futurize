<template>
  <div class="ai-agent-create">
    <page-header
      :title="$t('AI_AGENT.CREATE.TITLE')"
      :header-content="$t('AI_AGENT.DESCRIPTION')"
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
          v-if="uiFlags.isCreatingAgent"
          :message="$t('LOADING')"
        />

        <form v-else @submit.prevent="createAgent" class="agent-form">
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
          </div>

          <div class="form-footer">
            <woot-button
              color-scheme="primary"
              type="submit"
              :loading="uiFlags.isCreatingAgent"
            >
              {{ $t('AI_AGENT.CREATE.SAVE_BUTTON') }}
            </woot-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AiAgentCreate',
  data() {
    return {
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
      uiFlags: 'aiAgent/getUIFlags',
    }),
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'ai_agents' });
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
    async createAgent() {
      if (!this.validateForm()) {
        return;
      }

      try {
        const agent = await this.$store.dispatch('aiAgent/createAgent', this.agent);
        this.showAlert(
          this.$t('SUCCESS'),
          this.$t('AI_AGENT.CREATE.SUCCESS')
        );
        this.$router.push({
          name: 'ai_agent_details',
          params: { agentId: agent.id },
        });
      } catch (error) {
        this.showAlert(
          this.$t('ERROR'),
          this.$t('AI_AGENT.CREATE.ERROR')
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
.agent-form {
  max-width: 720px;
  margin: 0 auto;
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
</style>
