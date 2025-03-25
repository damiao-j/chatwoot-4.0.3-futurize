<template>
  <div class="ai-agent-list">
    <page-header
      :title="$t('AI_AGENT.LIST.TITLE')"
      :header-content="$t('AI_AGENT.DESCRIPTION')"
    >
      <div class="page-header-actions">
        <woot-button
          color-scheme="success"
          icon="add"
          @click="onClickNewAgent"
        >
          {{ $t('AI_AGENT.LIST.NEW_BUTTON') }}
        </woot-button>
      </div>
    </page-header>

    <div class="section-wrapper">
      <div class="section-body">
        <woot-loading-state
          v-if="uiFlags.isFetchingAgents"
          :message="$t('LOADING')"
        />

        <div v-else-if="!agents.length" class="empty-state">
          <span class="empty-state-title">
            {{ $t('AI_AGENT.EMPTY.TITLE') }}
          </span>
          <span class="empty-state-message">
            {{ $t('AI_AGENT.EMPTY.DESCRIPTION') }}
          </span>
          <woot-button
            color-scheme="primary"
            icon="add"
            @click="onClickNewAgent"
          >
            {{ $t('AI_AGENT.LIST.NEW_BUTTON') }}
          </woot-button>
        </div>

        <div v-else class="agents-table">
          <table class="woot-table">
            <thead>
              <tr>
                <th>{{ $t('NAME') }}</th>
                <th>{{ $t('DESCRIPTION') }}</th>
                <th>{{ $t('STATUS') }}</th>
                <th>{{ $t('AI_AGENT.LIST.PARAMETERS_COUNT') }}</th>
                <th>{{ $t('AI_AGENT.LIST.WEBHOOKS_COUNT') }}</th>
                <th>{{ $t('AI_AGENT.LIST.ACTIONS') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="agent in agents" :key="agent.id">
                <td>
                  <router-link :to="agentDetailsPath(agent.id)">
                    {{ agent.name }}
                  </router-link>
                </td>
                <td>{{ agent.description }}</td>
                <td>
                  <span
                    class="status-badge"
                    :class="{ active: agent.active }"
                  >
                    {{ agent.active ? $t('AI_AGENT.LIST.ACTIVE') : $t('AI_AGENT.LIST.INACTIVE') }}
                  </span>
                </td>
                <td>{{ agent.parameters_count }}</td>
                <td>{{ agent.webhooks_count }}</td>
                <td class="action-buttons">
                  <woot-button
                    variant="clear"
                    color-scheme="secondary"
                    icon="edit"
                    @click="onClickEditAgent(agent.id)"
                  >
                    {{ $t('AI_AGENT.LIST.EDIT') }}
                  </woot-button>
                  <woot-button
                    variant="clear"
                    color-scheme="alert"
                    icon="delete"
                    @click="onClickDeleteAgent(agent.id)"
                  >
                    {{ $t('AI_AGENT.LIST.DELETE') }}
                  </woot-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <woot-confirm-dialog
      :show="showDeleteConfirmation"
      :title="$t('CONFIRM')"
      :message="$t('AI_AGENT.LIST.CONFIRM_DELETE')"
      :confirm-text="$t('DELETE')"
      :reject-text="$t('CANCEL')"
      @confirm="confirmDeleteAgent"
      @reject="cancelDeleteAgent"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AiAgentList',
  data() {
    return {
      showDeleteConfirmation: false,
      agentToDelete: null,
    };
  },
  computed: {
    ...mapGetters({
      agents: 'aiAgent/getAgents',
      uiFlags: 'aiAgent/getUIFlags',
    }),
  },
  mounted() {
    this.fetchAgents();
  },
  methods: {
    async fetchAgents() {
      try {
        await this.$store.dispatch('aiAgent/fetchAgents');
      } catch (error) {
        this.showAlert(this.$t('ERROR'), error.message);
      }
    },
    onClickNewAgent() {
      this.$router.push({ name: 'ai_agent_create' });
    },
    onClickEditAgent(agentId) {
      this.$router.push({ name: 'ai_agent_details', params: { agentId } });
    },
    agentDetailsPath(agentId) {
      return {
        name: 'ai_agent_details',
        params: { agentId },
      };
    },
    onClickDeleteAgent(agentId) {
      this.agentToDelete = agentId;
      this.showDeleteConfirmation = true;
    },
    async confirmDeleteAgent() {
      try {
        await this.$store.dispatch('aiAgent/deleteAgent', this.agentToDelete);
        this.showAlert(
          this.$t('SUCCESS'),
          this.$t('AI_AGENT.DETAILS.DELETE_SUCCESS')
        );
      } catch (error) {
        this.showAlert(
          this.$t('ERROR'),
          this.$t('AI_AGENT.DETAILS.DELETE_ERROR')
        );
      } finally {
        this.cancelDeleteAgent();
      }
    },
    cancelDeleteAgent() {
      this.showDeleteConfirmation = false;
      this.agentToDelete = null;
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

.agents-table {
  width: 100%;
  overflow-x: auto;
}

.status-badge {
  display: inline-block;
  padding: var(--space-smaller) var(--space-small);
  border-radius: var(--border-radius-small);
  font-size: var(--font-size-small);
  background-color: var(--s-50);
  color: var(--s-700);

  &.active {
    background-color: var(--g-50);
    color: var(--g-800);
  }
}

.action-buttons {
  display: flex;
  gap: var(--space-small);
}
</style>
