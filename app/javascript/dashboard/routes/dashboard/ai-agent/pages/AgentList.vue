<template>
  <div class="column content-box">
    <woot-button
      v-if="isAdmin"
      color-scheme="success"
      class-names="button--fixed-right-top"
      icon="add"
      @click="openAddAgent"
    >
      {{ $t('AI_AGENT.ADD.BUTTON') }}
    </woot-button>

    <div class="row">
      <div class="small-8 columns with-right-space">
        <h1 class="page-title">
          {{ $t('AI_AGENT.HEADER') }}
        </h1>
      </div>
      <div class="small-4 columns">
        <woot-button
          v-if="isAdmin"
          color-scheme="secondary"
          class-names="button--fixed-right-top"
          icon="refresh"
          @click="fetchAgents"
        >
          {{ $t('GENERAL.REFRESH') }}
        </woot-button>
      </div>
    </div>

    <div class="row">
      <div class="small-12 columns">
        <p v-if="!agents.length && !uiFlags.isFetchingAgents" class="no-items-error-message">
          {{ $t('AI_AGENT.LIST.NO_ITEMS') }}
        </p>
        <woot-loading-state
          v-if="uiFlags.isFetchingAgents"
          :message="$t('AI_AGENT.LIST.LOADING')"
        />
        <table v-else-if="agents.length" class="woot-table">
          <thead>
            <tr>
              <th>{{ $t('AI_AGENT.LIST.COLUMNS.NAME') }}</th>
              <th>{{ $t('AI_AGENT.LIST.COLUMNS.DESCRIPTION') }}</th>
              <th>{{ $t('AI_AGENT.LIST.COLUMNS.STATUS') }}</th>
              <th>{{ $t('AI_AGENT.LIST.COLUMNS.CREATED_AT') }}</th>
              <th v-if="isAdmin">{{ $t('AI_AGENT.LIST.COLUMNS.ACTIONS') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="agent in agents" :key="agent.id">
              <td>
                <router-link
                  :to="{
                    name: isAdmin ? 'ai_agent_edit' : 'ai_agent_settings',
                    params: { agentId: agent.id },
                  }"
                >
                  {{ agent.name }}
                </router-link>
              </td>
              <td>{{ agent.description }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="{ active: agent.active, inactive: !agent.active }"
                >
                  {{ agent.active ? $t('GENERAL.ACTIVE') : $t('GENERAL.INACTIVE') }}
                </span>
              </td>
              <td>{{ formatDate(agent.created_at) }}</td>
              <td v-if="isAdmin">
                <div class="button-group">
                  <woot-button
                    variant="clear"
                    color-scheme="secondary"
                    icon="edit"
                    @click="openEditAgent(agent.id)"
                  />
                  <woot-button
                    variant="clear"
                    color-scheme="alert"
                    icon="delete"
                    @click="confirmDeleteAgent(agent.id, agent.name)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <woot-confirm-delete-modal
      :show.sync="showDeleteConfirmation"
      :title="$t('AI_AGENT.DELETE.CONFIRM.TITLE')"
      :message="deleteMessage"
      :confirm-text="$t('AI_AGENT.DELETE.CONFIRM.YES')"
      :reject-text="$t('AI_AGENT.DELETE.CONFIRM.NO')"
      @confirm="deleteAgent"
      @close="hideDeleteConfirmation"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatUnixDate } from '../../../../../shared/helpers/DateHelper';

export default {
  name: 'AgentList',
  data() {
    return {
      showDeleteConfirmation: false,
      agentToDelete: null,
      deleteMessage: '',
    };
  },
  computed: {
    ...mapGetters({
      agents: 'aiAgent/getAgents',
      uiFlags: 'aiAgent/getUIFlags',
      currentUser: 'getCurrentUser',
    }),
    isAdmin() {
      return this.currentUser.role === 'administrator';
    },
  },
  mounted() {
    this.fetchAgents();
  },
  methods: {
    async fetchAgents() {
      try {
        await this.$store.dispatch('aiAgent/fetchAgents');
      } catch (error) {
        this.showAlert(this.$t('AI_AGENT.FETCH_ERROR'));
      }
    },
    formatDate(date) {
      return formatUnixDate(date);
    },
    openAddAgent() {
      this.$router.push({ name: 'ai_agent_create' });
    },
    openEditAgent(agentId) {
      this.$router.push({
        name: 'ai_agent_edit',
        params: { agentId },
      });
    },
    confirmDeleteAgent(agentId, agentName) {
      this.agentToDelete = agentId;
      this.deleteMessage = this.$t('AI_AGENT.DELETE.CONFIRM.MESSAGE', {
        agentName,
      });
      this.showDeleteConfirmation = true;
    },
    hideDeleteConfirmation() {
      this.showDeleteConfirmation = false;
      this.agentToDelete = null;
      this.deleteMessage = '';
    },
    async deleteAgent() {
      try {
        await this.$store.dispatch('aiAgent/deleteAgent', this.agentToDelete);
        this.showAlert(this.$t('AI_AGENT.DELETE.SUCCESS'));
      } catch (error) {
        this.showAlert(this.$t('AI_AGENT.DELETE.ERROR'));
      } finally {
        this.hideDeleteConfirmation();
      }
    },
    showAlert(message) {
      this.$store.dispatch('notifications/create', {
        type: 'error',
        message,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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

.no-items-error-message {
  margin-top: var(--space-large);
  text-align: center;
  color: var(--s-600);
}
</style>
