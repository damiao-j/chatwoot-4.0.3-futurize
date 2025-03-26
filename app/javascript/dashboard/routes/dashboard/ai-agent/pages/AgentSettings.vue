<template>
  <div class="column content-box">
    <woot-button
      color-scheme="secondary"
      class-names="button--fixed-right-top"
      icon="arrow-left"
      @click="goBack"
    >
      {{ $t('GENERAL.BACK') }}
    </woot-button>

    <div class="row">
      <div class="small-12 columns">
        <h1 class="page-title">
          {{ $t('AI_AGENT.SETTINGS.TITLE') }}
        </h1>
      </div>
    </div>

    <woot-loading-state
      v-if="uiFlags.isFetchingAgent"
      :message="$t('AI_AGENT.SETTINGS.LOADING')"
    />

    <div v-else class="row">
      <div class="small-12 columns">
        <div class="agent-details">
          <div class="agent-header">
            <h2>{{ currentAgent.name }}</h2>
            <span
              class="status-badge"
              :class="{ active: currentAgent.active, inactive: !currentAgent.active }"
            >
              {{ currentAgent.active ? $t('GENERAL.ACTIVE') : $t('GENERAL.INACTIVE') }}
            </span>
          </div>
          <p class="agent-description">{{ currentAgent.description }}</p>
        </div>

        <div class="settings-section">
          <h3>{{ $t('AI_AGENT.SETTINGS.PARAMETERS') }}</h3>
          <woot-loading-state
            v-if="uiFlags.isFetchingParameters"
            :message="$t('AI_AGENT.PARAMETERS.LOADING')"
          />
          <div v-else>
            <p v-if="!parameters.length" class="no-items-message">
              {{ $t('AI_AGENT.PARAMETERS.NO_ITEMS') }}
            </p>
            <div v-else class="parameters-list">
              <div
                v-for="parameter in parameters"
                :key="parameter.id"
                class="parameter-item"
              >
                <div class="parameter-content">
                  <div class="parameter-header">
                    <h4>{{ parameter.name }}</h4>
                    <span v-if="parameter.required" class="required-badge">
                      {{ $t('AI_AGENT.PARAMETERS.REQUIRED_BADGE') }}
                    </span>
                  </div>
                  <div class="parameter-details">
                    <div v-if="parameter.description" class="parameter-description">
                      {{ parameter.description }}
                    </div>
                    <div class="parameter-type">
                      <span class="label">{{ $t('AI_AGENT.PARAMETERS.TYPE') }}:</span>
                      <span>{{ getParameterTypeName(parameter.param_type) }}</span>
                    </div>
                    <div v-if="parameter.default_value" class="parameter-default">
                      <span class="label">{{ $t('AI_AGENT.PARAMETERS.DEFAULT') }}:</span>
                      <span>{{ parameter.default_value }}</span>
                    </div>
                    <div v-if="parameter.param_type === 3 && parameter.options && parameter.options.length" class="parameter-options">
                      <span class="label">{{ $t('AI_AGENT.PARAMETERS.OPTIONS') }}:</span>
                      <span>{{ parameter.options.join(', ') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>{{ $t('AI_AGENT.SETTINGS.WEBHOOKS') }}</h3>
          <woot-loading-state
            v-if="uiFlags.isFetchingWebhooks"
            :message="$t('AI_AGENT.WEBHOOKS.LOADING')"
          />
          <div v-else>
            <p v-if="!webhooks.length" class="no-items-message">
              {{ $t('AI_AGENT.WEBHOOKS.NO_ITEMS') }}
            </p>
            <div v-else class="webhooks-list">
              <div
                v-for="webhook in webhooks"
                :key="webhook.id"
                class="webhook-item"
              >
                <div class="webhook-content">
                  <div class="webhook-header">
                    <h4>{{ webhook.event_name }}</h4>
                    <span
                      class="status-badge"
                      :class="{ active: webhook.active, inactive: !webhook.active }"
                    >
                      {{ webhook.active ? $t('GENERAL.ACTIVE') : $t('GENERAL.INACTIVE') }}
                    </span>
                  </div>
                  <div class="webhook-details">
                    <div class="webhook-url">
                      <span class="label">{{ $t('AI_AGENT.WEBHOOKS.URL') }}:</span>
                      <span>{{ webhook.url }}</span>
                    </div>
                    <div v-if="webhook.description" class="webhook-description">
                      <span class="label">{{ $t('AI_AGENT.WEBHOOKS.DESCRIPTION') }}:</span>
                      <span>{{ webhook.description }}</span>
                    </div>
                    <div v-if="Object.keys(webhook.headers || {}).length" class="webhook-headers">
                      <span class="label">{{ $t('AI_AGENT.WEBHOOKS.HEADERS') }}:</span>
                      <div class="headers-list">
                        <div
                          v-for="(value, key) in webhook.headers"
                          :key="key"
                          class="header-item"
                        >
                          <span class="header-key">{{ key }}:</span>
                          <span class="header-value">{{ value }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>{{ $t('AI_AGENT.SETTINGS.INTEGRATION') }}</h3>
          <div class="integration-info">
            <p>{{ $t('AI_AGENT.SETTINGS.INTEGRATION_DESC') }}</p>
            
            <div class="code-block">
              <h4>{{ $t('AI_AGENT.SETTINGS.EXAMPLE_REQUEST') }}</h4>
              <pre><code>curl -X POST "{{ apiBaseUrl }}/api/v1/accounts/{{ accountId }}/ai_agent/agents/{{ agentId }}/webhooks/{{ webhookId }}/trigger" \
  -H "api_access_token: YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  }
}'</code></pre>
              <woot-button
                variant="clear"
                color-scheme="secondary"
                icon="copy"
                @click="copyToClipboard"
              >
                {{ $t('GENERAL.COPY') }}
              </woot-button>
            </div>
            
            <div class="api-documentation">
              <h4>{{ $t('AI_AGENT.SETTINGS.API_DOCUMENTATION') }}</h4>
              <p>{{ $t('AI_AGENT.SETTINGS.API_DOCUMENTATION_DESC') }}</p>
              <ul>
                <li>
                  <strong>{{ $t('AI_AGENT.SETTINGS.ENDPOINT') }}:</strong> 
                  <code>{{ apiBaseUrl }}/api/v1/accounts/{{ accountId }}/ai_agent/agents/{{ agentId }}/webhooks/{{ webhookId }}/trigger</code>
                </li>
                <li>
                  <strong>{{ $t('AI_AGENT.SETTINGS.METHOD') }}:</strong> 
                  <code>POST</code>
                </li>
                <li>
                  <strong>{{ $t('AI_AGENT.SETTINGS.HEADERS') }}:</strong>
                  <ul>
                    <li><code>api_access_token: YOUR_ACCESS_TOKEN</code></li>
                    <li><code>Content-Type: application/json</code></li>
                  </ul>
                </li>
                <li>
                  <strong>{{ $t('AI_AGENT.SETTINGS.REQUEST_BODY') }}:</strong>
                  <p>{{ $t('AI_AGENT.SETTINGS.REQUEST_BODY_DESC') }}</p>
                  <pre><code>{
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  }
}</code></pre>
                </li>
                <li>
                  <strong>{{ $t('AI_AGENT.SETTINGS.RESPONSE') }}:</strong>
                  <p>{{ $t('AI_AGENT.SETTINGS.RESPONSE_DESC') }}</p>
                  <pre><code>{
  "success": true,
  "message": "Webhook triggered successfully"
}</code></pre>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AgentSettings',
  data() {
    return {
      apiBaseUrl: window.location.origin,
    };
  },
  computed: {
    ...mapGetters({
      currentAgent: 'aiAgent/getCurrentAgent',
      parameters: 'aiAgent/getParameters',
      webhooks: 'aiAgent/getWebhooks',
      uiFlags: 'aiAgent/getUIFlags',
      currentUser: 'getCurrentUser',
    }),
    agentId() {
      return this.$route.params.agentId;
    },
    accountId() {
      return this.$route.params.accountId;
    },
    webhookId() {
      return this.webhooks.length > 0 ? this.webhooks[0].id : 'webhook_id';
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
      } catch (error) {
        this.showAlert(this.$t('AI_AGENT.FETCH_ERROR'));
        this.$router.push({ name: 'ai_agents' });
      }
    },
    getParameterTypeName(type) {
      const types = {
        0: this.$t('AI_AGENT.PARAMETERS.FORM.TYPE.TEXT'),
        1: this.$t('AI_AGENT.PARAMETERS.FORM.TYPE.NUMBER'),
        2: this.$t('AI_AGENT.PARAMETERS.FORM.TYPE.BOOLEAN'),
        3: this.$t('AI_AGENT.PARAMETERS.FORM.TYPE.SELECT'),
      };
      return types[type] || types[0];
    },
    copyToClipboard() {
      const curlCommand = `curl -X POST "${this.apiBaseUrl}/api/v1/accounts/${this.accountId}/ai_agent/agents/${this.agentId}/webhooks/${this.webhookId}/trigger" \\
  -H "api_access_token: YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  }
}'`;
      
      navigator.clipboard.writeText(curlCommand).then(() => {
        this.showAlert(this.$t('AI_AGENT.SETTINGS.COPY_SUCCESS'), 'success');
      }).catch(() => {
        this.showAlert(this.$t('AI_AGENT.SETTINGS.COPY_ERROR'));
      });
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
.agent-details {
  margin-bottom: var(--space-large);
  padding: var(--space-normal);
  background-color: var(--s-50);
  border-radius: 4px;
}

.agent-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-small);
  
  h2 {
    margin: 0;
    margin-right: var(--space-small);
  }
}

.agent-description {
  margin: 0;
  color: var(--s-700);
}

.settings-section {
  margin-bottom: var(--space-larger);
  
  h3 {
    border-bottom: 1px solid var(--s-200);
    padding-bottom: var(--space-smaller);
    margin-bottom: var(--space-normal);
  }
}

.no-items-message {
  text-align: center;
  color: var(--s-600);
  margin: var(--space-normal) 0;
}

.parameter-item, .webhook-item {
  border: 1px solid var(--s-200);
  border-radius: 4px;
  margin-bottom: var(--space-small);
  background-color: var(--white);
}

.parameter-content, .webhook-content {
  padding: var(--space-normal);
}

.parameter-header, .webhook-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-smaller);
  
  h4 {
    margin: 0;
    font-size: 1rem;
  }
}

.parameter-details, .webhook-details {
  font-size: 0.9rem;
  color: var(--s-700);
}

.parameter-description, .webhook-description {
  margin-bottom: var(--space-smaller);
}

.status-badge, .required-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-badge {
  &.active {
    background-color: var(--g-400);
    color: var(--white);
  }
  
  &.inactive {
    background-color: var(--s-300);
    color: var(--white);
  }
}

.required-badge {
  background-color: var(--r-400);
  color: var(--white);
}

.label {
  font-weight: 600;
  margin-right: var(--space-smaller);
}

.integration-info {
  background-color: var(--s-50);
  padding: var(--space-normal);
  border-radius: 4px;
}

.code-block {
  background-color: var(--b-900);
  color: var(--white);
  padding: var(--space-normal);
  border-radius: 4px;
  margin: var(--space-normal) 0;
  position: relative;
  
  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }
  
  code {
    font-family: monospace;
  }
  
  h4 {
    color: var(--s-200);
    margin-top: 0;
    margin-bottom: var(--space-small);
  }
  
  .woot-button {
    position: absolute;
    top: var(--space-small);
    right: var(--space-small);
  }
}

.api-documentation {
  h4 {
    margin-bottom: var(--space-small);
  }
  
  ul {
    padding-left: var(--space-normal);
  }
  
  li {
    margin-bottom: var(--space-small);
  }
  
  code {
    background-color: var(--s-100);
    padding: 2px 4px;
    border-radius: 2px;
    font-family: monospace;
  }
  
  pre {
    background-color: var(--s-100);
    padding: var(--space-small);
    border-radius: 4px;
    margin: var(--space-smaller) 0;
    overflow-x: auto;
  }
}

.headers-list {
  margin-top: var(--space-smaller);
  
  .header-item {
    margin-bottom: var(--space-micro);
  }
  
  .header-key {
    font-weight: 600;
    margin-right: var(--space-smaller);
  }
}
</style>
