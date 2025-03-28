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
          {{ $t('AI_AGENT.EDIT.TITLE') }}
        </h1>
      </div>
    </div>

    <woot-loading-state
      v-if="uiFlags.isFetchingAgent"
      :message="$t('AI_AGENT.EDIT.LOADING')"
    />

    <div v-else class="row">
      <div class="small-12 columns">
        <form @submit.prevent="updateAgent">
          <div class="row">
            <div class="small-12 medium-8 columns">
              <woot-input
                v-model="agentForm.name"
                :label="$t('AI_AGENT.FORM.NAME.LABEL')"
                :placeholder="$t('AI_AGENT.FORM.NAME.PLACEHOLDER')"
                :error="$v.agentForm.name.$error ? $t('AI_AGENT.FORM.NAME.ERROR') : ''"
                @blur="$v.agentForm.name.$touch"
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="small-12 medium-8 columns">
              <woot-input
                v-model="agentForm.description"
                :label="$t('AI_AGENT.FORM.DESCRIPTION.LABEL')"
                :placeholder="$t('AI_AGENT.FORM.DESCRIPTION.PLACEHOLDER')"
                :error="$v.agentForm.description.$error ? $t('AI_AGENT.FORM.DESCRIPTION.ERROR') : ''"
                @blur="$v.agentForm.description.$touch"
                required
                multiline
                :rows="4"
              />
            </div>
          </div>

          <div class="row">
            <div class="small-12 medium-8 columns">
              <label class="block-label">
                {{ $t('AI_AGENT.FORM.STATUS.LABEL') }}
                <div class="checkbox-wrap">
                  <input
                    v-model="agentForm.active"
                    type="checkbox"
                  />
                  <span class="checkbox-label">
                    {{ $t('AI_AGENT.FORM.STATUS.ACTIVE') }}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <woot-button
                :is-loading="uiFlags.isUpdatingAgent"
                :disabled="$v.agentForm.$invalid"
                color-scheme="success"
                type="submit"
              >
                {{ $t('AI_AGENT.EDIT.SUBMIT') }}
              </woot-button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div v-if="!uiFlags.isFetchingAgent" class="row">
      <div class="small-12 columns">
        <div class="tabs-container">
          <div class="tabs">
            <div
              class="tab"
              :class="{ active: activeTab === 'parameters' }"
              @click="activeTab = 'parameters'"
            >
              {{ $t('AI_AGENT.TABS.PARAMETERS') }}
            </div>
            <div
              class="tab"
              :class="{ active: activeTab === 'webhooks' }"
              @click="activeTab = 'webhooks'"
            >
              {{ $t('AI_AGENT.TABS.WEBHOOKS') }}
            </div>
          </div>

          <div class="tabs-content">
            <div v-if="activeTab === 'parameters'" class="parameters-tab">
              <div class="section-header">
                <h2>{{ $t('AI_AGENT.PARAMETERS.TITLE') }}</h2>
                <woot-button
                  color-scheme="primary"
                  icon="add"
                  @click="openAddParameter"
                >
                  {{ $t('AI_AGENT.PARAMETERS.ADD') }}
                </woot-button>
              </div>

              <woot-loading-state
                v-if="uiFlags.isFetchingParameters"
                :message="$t('AI_AGENT.PARAMETERS.LOADING')"
              />
              <div v-else>
                <p v-if="!parameters.length" class="no-items-message">
                  {{ $t('AI_AGENT.PARAMETERS.NO_ITEMS') }}
                </p>
                <draggable
                  v-else
                  v-model="parameters"
                  handle=".drag-handle"
                  @end="handleParameterReorder"
                >
                  <div
                    v-for="parameter in parameters"
                    :key="parameter.id"
                    class="parameter-item"
                  >
                    <div class="drag-handle">
                      <i class="icon ion-drag"></i>
                    </div>
                    <div class="parameter-content">
                      <div class="parameter-header">
                        <h3>{{ parameter.name }}</h3>
                        <div class="parameter-actions">
                          <woot-button
                            variant="clear"
                            color-scheme="secondary"
                            icon="edit"
                            @click="openEditParameter(parameter)"
                          />
                          <woot-button
                            variant="clear"
                            color-scheme="alert"
                            icon="delete"
                            @click="confirmDeleteParameter(parameter.id, parameter.name)"
                          />
                        </div>
                      </div>
                      <div class="parameter-details">
                        <div class="parameter-type">
                          <span class="label">{{ $t('AI_AGENT.PARAMETERS.TYPE') }}:</span>
                          <span>{{ getParameterTypeName(parameter.param_type) }}</span>
                        </div>
                        <div class="parameter-required">
                          <span class="label">{{ $t('AI_AGENT.PARAMETERS.REQUIRED') }}:</span>
                          <span>{{ parameter.required ? $t('GENERAL.YES') : $t('GENERAL.NO') }}</span>
                        </div>
                        <div v-if="parameter.description" class="parameter-description">
                          <span class="label">{{ $t('AI_AGENT.PARAMETERS.DESCRIPTION') }}:</span>
                          <span>{{ parameter.description }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </div>
            </div>

            <div v-if="activeTab === 'webhooks'" class="webhooks-tab">
              <div class="section-header">
                <h2>{{ $t('AI_AGENT.WEBHOOKS.TITLE') }}</h2>
                <woot-button
                  color-scheme="primary"
                  icon="add"
                  @click="openAddWebhook"
                >
                  {{ $t('AI_AGENT.WEBHOOKS.ADD') }}
                </woot-button>
              </div>

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
                        <h3>{{ webhook.event_name }}</h3>
                        <div class="webhook-actions">
                          <woot-button
                            variant="clear"
                            color-scheme="primary"
                            icon="play"
                            @click="testWebhook(webhook.id)"
                            :is-loading="uiFlags.isTestingWebhook && testingWebhookId === webhook.id"
                          />
                          <woot-button
                            variant="clear"
                            color-scheme="secondary"
                            icon="edit"
                            @click="openEditWebhook(webhook)"
                          />
                          <woot-button
                            variant="clear"
                            color-scheme="alert"
                            icon="delete"
                            @click="confirmDeleteWebhook(webhook.id, webhook.event_name)"
                          />
                        </div>
                      </div>
                      <div class="webhook-details">
                        <div class="webhook-url">
                          <span class="label">{{ $t('AI_AGENT.WEBHOOKS.URL') }}:</span>
                          <span>{{ webhook.url }}</span>
                        </div>
                        <div class="webhook-status">
                          <span class="label">{{ $t('AI_AGENT.WEBHOOKS.STATUS') }}:</span>
                          <span
                            class="status-badge"
                            :class="{ active: webhook.active, inactive: !webhook.active }"
                          >
                            {{ webhook.active ? $t('GENERAL.ACTIVE') : $t('GENERAL.INACTIVE') }}
                          </span>
                        </div>
                        <div v-if="webhook.description" class="webhook-description">
                          <span class="label">{{ $t('AI_AGENT.WEBHOOKS.DESCRIPTION') }}:</span>
                          <span>{{ webhook.description }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modais para parâmetros -->
    <woot-modal :show.sync="showParameterModal" :title="parameterModalTitle">
      <div class="parameter-form">
        <form @submit.prevent="submitParameter">
          <div class="row">
            <div class="small-12 columns">
              <woot-input
                v-model="parameterForm.name"
                :label="$t('AI_AGENT.PARAMETERS.FORM.NAME.LABEL')"
                :placeholder="$t('AI_AGENT.PARAMETERS.FORM.NAME.PLACEHOLDER')"
                :error="$v.parameterForm.name.$error ? $t('AI_AGENT.PARAMETERS.FORM.NAME.ERROR') : ''"
                @blur="$v.parameterForm.name.$touch"
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <label class="block-label">
                {{ $t('AI_AGENT.PARAMETERS.FORM.TYPE.LABEL') }}
                <select v-model="parameterForm.param_type" class="dropdown">
                  <option value="0">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPE.TEXT') }}</option>
                  <option value="1">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPE.NUMBER') }}</option>
                  <option value="2">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPE.BOOLEAN') }}</option>
                  <option value="3">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPE.SELECT') }}</option>
                </select>
              </label>
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <label class="block-label">
                {{ $t('AI_AGENT.PARAMETERS.FORM.REQUIRED.LABEL') }}
                <div class="checkbox-wrap">
                  <input
                    v-model="parameterForm.required"
                    type="checkbox"
                  />
                  <span class="checkbox-label">
                    {{ $t('AI_AGENT.PARAMETERS.FORM.REQUIRED.TEXT') }}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <woot-input
                v-model="parameterForm.description"
                :label="$t('AI_AGENT.PARAMETERS.FORM.DESCRIPTION.LABEL')"
                :placeholder="$t('AI_AGENT.PARAMETERS.FORM.DESCRIPTION.PLACEHOLDER')"
                multiline
                :rows="3"
              />
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <woot-input
                v-model="parameterForm.default_value"
                :label="$t('AI_AGENT.PARAMETERS.FORM.DEFAULT.LABEL')"
                :placeholder="$t('AI_AGENT.PARAMETERS.FORM.DEFAULT.PLACEHOLDER')"
              />
            </div>
          </div>

          <div v-if="parameterForm.param_type === '3'" class="row">
            <div class="small-12 columns">
              <label class="block-label">
                {{ $t('AI_AGENT.PARAMETERS.FORM.OPTIONS.LABEL') }}
                <div v-for="(option, index) in parameterForm.options" :key="index" class="option-item">
                  <woot-input
                    v-model="parameterForm.options[index]"
                    :placeholder="$t('AI_AGENT.PARAMETERS.FORM.OPTIONS.PLACEHOLDER')"
                  />
                  <woot-button
                    variant="clear"
                    color-scheme="alert"
                    icon="delete"
                    @click="removeOption(index)"
                  />
                </div>
                <woot-button
                  color-scheme="secondary"
                  icon="add"
                  @click="addOption"
                >
                  {{ $t('AI_AGENT.PARAMETERS.FORM.OPTIONS.ADD') }}
                </woot-button>
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <div class="medium-12 columns">
              <woot-button
                class="button--fixed-right-bottom"
                :is-loading="isSubmittingParameter"
                :disabled="$v.parameterForm.name.$invalid"
                color-scheme="success"
                type="submit"
              >
                {{ $t('GENERAL.SAVE') }}
              </woot-button>
            </div>
          </div>
        </form>
      </div>
    </woot-modal>

    <!-- Modais para webhooks -->
    <woot-modal :show.sync="showWebhookModal" :title="webhookModalTitle">
      <div class="webhook-form">
        <form @submit.prevent="submitWebhook">
          <div class="row">
            <div class="small-12 columns">
              <woot-input
                v-model="webhookForm.event_name"
                :label="$t('AI_AGENT.WEBHOOKS.FORM.EVENT.LABEL')"
                :placeholder="$t('AI_AGENT.WEBHOOKS.FORM.EVENT.PLACEHOLDER')"
                :error="$v.webhookForm.event_name.$error ? $t('AI_AGENT.WEBHOOKS.FORM.EVENT.ERROR') : ''"
                @blur="$v.webhookForm.event_name.$touch"
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <woot-input
                v-model="webhookForm.url"
                :label="$t('AI_AGENT.WEBHOOKS.FORM.URL.LABEL')"
                :placeholder="$t('AI_AGENT.WEBHOOKS.FORM.URL.PLACEHOLDER')"
                :error="$v.webhookForm.url.$error ? $t('AI_AGENT.WEBHOOKS.FORM.URL.ERROR') : ''"
                @blur="$v.webhookForm.url.$touch"
                required
              />
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <label class="block-label">
                {{ $t('AI_AGENT.WEBHOOKS.FORM.STATUS.LABEL') }}
                <div class="checkbox-wrap">
                  <input
                    v-model="webhookForm.active"
                    type="checkbox"
                  />
                  <span class="checkbox-label">
                    {{ $t('AI_AGENT.WEBHOOKS.FORM.STATUS.ACTIVE') }}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <woot-input
                v-model="webhookForm.description"
                :label="$t('AI_AGENT.WEBHOOKS.FORM.DESCRIPTION.LABEL')"
                :placeholder="$t('AI_AGENT.WEBHOOKS.FORM.DESCRIPTION.PLACEHOLDER')"
                multiline
                :rows="3"
              />
            </div>
          </div>

          <div class="row">
            <div class="small-12 columns">
              <label class="block-label">
                {{ $t('AI_AGENT.WEBHOOKS.FORM.HEADERS.LABEL') }}
                <div v-for="(value, key) in webhookForm.headers" :key="key" class="header-item">
                  <div class="header-key">
                    <woot-input
                      v-model="headerKeys[key]"
                      :placeholder="$t('AI_AGENT.WEBHOOKS.FORM.HEADERS.KEY_PLACEHOLDER')"
                      @input="updateHeaderKey(key)"
                    />
                  </div>
                  <div class="header-value">
                    <woot-input
                      v-model="webhookForm.headers[key]"
                      :placeholder="$t('AI_AGENT.WEBHOOKS.FORM.HEADERS.VALUE_PLACEHOLDER')"
                    />
                  </div>
                  <woot-button
                    variant="clear"
                    color-scheme="alert"
                    icon="delete"
                    @click="removeHeader(key)"
                  />
                </div>
                <woot-button
                  color-scheme="secondary"
                  icon="add"
                  @click="addHeader"
                >
                  {{ $t('AI_AGENT.WEBHOOKS.FORM.HEADERS.ADD') }}
                </woot-button>
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <div class="medium-12 columns">
              <woot-button
                class="button--fixed-right-bottom"
                :is-loading="isSubmittingWebhook"
                :disabled="$v.webhookForm.event_name.$invalid || $v.webhookForm.url.$invalid"
                color-scheme="success"
                type="submit"
              >
                {{ $t('GENERAL.SAVE') }}
              </woot-button>
            </div>
          </div>
        </form>
      </div>
    </woot-modal>

    <!-- Modais de confirmação de exclusão -->
    <woot-confirm-delete-modal
      :show.sync="showDeleteParameterConfirmation"
      :title="$t('AI_AGENT.PARAMETERS.DELETE.CONFIRM.TITLE')"
      :message="deleteParameterMessage"
      :confirm-text="$t('AI_AGENT.PARAMETERS.DELETE.CONFIRM.YES')"
      :reject-text="$t('AI_AGENT.PARAMETERS.DELETE.CONFIRM.NO')"
      @confirm="deleteParameter"
      @close="hideDeleteParameterConfirmation"
    />

    <woot-confirm-delete-modal
      :show.sync="showDeleteWebhookConfirmation"
      :title="$t('AI_AGENT.WEBHOOKS.DELETE.CONFIRM.TITLE')"
      :message="deleteWebhookMessage"
      :confirm-text="$t('AI_AGENT.WEBHOOKS.DELETE.CONFIRM.YES')"
      :reject-text="$t('AI_AGENT.WEBHOOKS.DELETE.CONFIRM.NO')"
      @confirm="deleteWebhook"
      @close="hideDeleteWebhookConfirmation"
    />
  </div>
</template>

<script>
import { required, url } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';

export default {
  name: 'AgentEdit',
  components: {
    draggable,
  },
  data() {
    return {
      agentForm: {
        name: '',
        description: '',
        active: true,
        settings: {},
      },
      activeTab: 'parameters',
      
      // Parâmetros
      showParameterModal: false,
      parameterModalTitle: '',
      parameterForm: {
        name: '',
        param_type: '0',
        required: false,
        description: '',
        default_value: '',
        options: [],
      },
      isEditingParameter: false,
      editingParameterId: null,
      isSubmittingParameter: false,
      showDeleteParameterConfirmation: false,
      parameterToDelete: null,
      deleteParameterMessage: '',
      
      // Webhooks
      showWebhookModal: false,
      webhookModalTitle: '',
      webhookForm: {
        event_name: '',
        url: '',
        active: true,
        description: '',
        headers: {},
      },
      headerKeys: {},
      isEditingWebhook: false,
      editingWebhookId: null,
      isSubmittingWebhook: false,
      showDeleteWebhookConfirmation: false,
      webhookToDelete: null,
      deleteWebhookMessage: '',
      testingWebhookId: null,
    };
  },
  validations: {
    agentForm: {
      name: { required },
      description: { required },
    },
    parameterForm: {
      name: { required },
    },
    webhookForm: {
      event_name: { required },
      url: { required, url },
    },
  },
  computed: {
    ...mapGetters({
      currentAgent: 'aiAgent/getCurrentAgent',
      parameters: 'aiAgent/getParameters',
      webhooks: 'aiAgent/getWebhooks',
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
        this.agentForm = {
          name: this.currentAgent.name,
          description: this.currentAgent.description,
          active: this.currentAgent.active,
          settings: this.currentAgent.settings || {},
        };
      } catch (error) {
        this.showAlert(this.$t('AI_AGENT.FETCH_ERROR'));
        this.$router.push({ name: 'ai_agents' });
      }
    },
    async updateAgent() {
      this.$v.agentForm.$touch();
      if (this.$v.agentForm.$invalid) {
        return;
      }

      try {
        await this.$store.dispatch('aiAgent/updateAgent', {
          id: this.agentId,
          ...this.agentForm,
        });
        this.showAlert(this.$t('AI_AGENT.EDIT.SUCCESS'), 'success');
      } catch (error) {
        this.showAlert(this.$t('AI_AGENT.EDIT.ERROR'));
      }
    },
    
    // Métodos para parâmetros
    getParameterTypeName(type) {
      const types = {
        0: this.$t('AI_AGENT.PARAMETERS.FORM.TYPE.TEXT'),
        1: this.$t('AI_AGENT.PARAMETERS.FORM.TYPE.NUMBER'),
        2: this.$t('AI_AGENT.PARAMETERS.FORM.TYPE.BOOLEAN'),
        3: this.$t('AI_AGENT.PARAMETERS.FORM.TYPE.SELECT'),
      };
      return types[type] || types[0];
    },
    openAddParameter() {
      this.isEditingParameter = false;
      this.editingParameterId = null;
      this.parameterForm = {
        name: '',
        param_type: '0',
        required: false,
        description: '',
        default_value: '',
        options: [],
      };
      this.parameterModalTitle = this.$t('AI_AGENT.PARAMETERS.ADD_TITLE');
      this.showParameterModal = true;
    },
    openEditParameter(parameter) {
      this.isEditingParameter = true;
      this.editingParameterId = parameter.id;
      this.parameterForm = {
        name: parameter.name,
        param_type: parameter.param_type.toString(),
        required: parameter.required,
        description: parameter.description || '',
        default_value: parameter.default_value || '',
        options: parameter.options || [],
      };
      this.parameterModalTitle = this.$t('AI_AGENT.PARAMETERS.EDIT_TITLE');
      this.showParameterModal = true;
    },
    addOption() {
      this.parameterForm.options.push('');
    },
    removeOption(index) {
      this.parameterForm.options.splice(index, 1);
    },
    async submitParameter() {
      this.$v.parameterForm.$touch();
      if (this.$v.parameterForm.name.$invalid) {
        return;
      }

      this.isSubmittingParameter = true;
      try {
        const paramData = {
          ...this.parameterForm,
          param_type: parseInt(this.parameterForm.param_type, 10),
        };

        if (this.isEditingParameter) {
          await this.$store.dispatch('aiAgent/updateParameter', {
            agentId: this.agentId,
            id: this.editingParameterId,
            ...paramData,
          });
          this.showAlert(this.$t('AI_AGENT.PARAMETERS.EDIT_SUCCESS'), 'success');
        } else {
          await this.$store.dispatch('aiAgent/createParameter', {
            agentId: this.agentId,
            ...paramData,
          });
          this.showAlert(this.$t('AI_AGENT.PARAMETERS.ADD_SUCCESS'), 'success');
        }
        this.showParameterModal = false;
      } catch (error) {
        this.showAlert(
          this.isEditingParameter
            ? this.$t('AI_AGENT.PARAMETERS.EDIT_ERROR')
            : this.$t('AI_AGENT.PARAMETERS.ADD_ERROR')
        );
      } finally {
        this.isSubmittingParameter = false;
      }
    },
    confirmDeleteParameter(parameterId, parameterName) {
      this.parameterToDelete = parameterId;
      this.deleteParameterMessage = this.$t('AI_AGENT.PARAMETERS.DELETE.CONFIRM.MESSAGE', {
        parameterName,
      });
      this.showDeleteParameterConfirmation = true;
    },
    hideDeleteParameterConfirmation() {
      this.showDeleteParameterConfirmation = false;
      this.parameterToDelete = null;
      this.deleteParameterMessage = '';
    },
    async deleteParameter() {
      try {
        await this.$store.dispatch('aiAgent/deleteParameter', {
          agentId: this.agentId,
          id: this.parameterToDelete,
        });
        this.showAlert(this.$t('AI_AGENT.PARAMETERS.DELETE.SUCCESS'), 'success');
      } catch (error) {
        this.showAlert(this.$t('AI_AGENT.PARAMETERS.DELETE.ERROR'));
      } finally {
        this.hideDeleteParameterConfirmation();
      }
    },
    async handleParameterReorder() {
      const parameterIds = this.parameters.map(parameter => parameter.id);
      try {
        await this.$store.dispatch('aiAgent/reorderParameters', {
          agentId: this.agentId,
          parameterIds,
        });
      } catch (error) {
        this.showAlert(this.$t('AI_AGENT.PARAMETERS.REORDER_ERROR'));
      }
    },
    
    // Métodos para webhooks
    openAddWebhook() {
      this.isEditingWebhook = false;
      this.editingWebhookId = null;
      this.webhookForm = {
        event_name: '',
        url: '',
        active: true,
        description: '',
        headers: {},
      };
      this.headerKeys = {};
      this.webhookModalTitle = this.$t('AI_AGENT.WEBHOOKS.ADD_TITLE');
      this.showWebhookModal = true;
    },
    openEditWebhook(webhook) {
      this.isEditingWebhook = true;
      this.editingWebhookId = webhook.id;
      this.webhookForm = {
        event_name: webhook.event_name,
        url: webhook.url,
        active: webhook.active,
        description: webhook.description || '',
        headers: { ...webhook.headers } || {},
      };
      this.headerKeys = {};
      Object.keys(this.webhookForm.headers).forEach(key => {
        this.headerKeys[key] = key;
      });
      this.webhookModalTitle = this.$t('AI_AGENT.WEBHOOKS.EDIT_TITLE');
      this.showWebhookModal = true;
    },
    addHeader() {
      const newKey = `header_${Date.now()}`;
      this.$set(this.webhookForm.headers, newKey, '');
      this.$set(this.headerKeys, newKey, '');
    },
    removeHeader(key) {
      this.$delete(this.webhookForm.headers, key);
      this.$delete(this.headerKeys, key);
    },
    updateHeaderKey(oldKey) {
      const newKey = this.headerKeys[oldKey];
      if (newKey !== oldKey && newKey) {
        const value = this.webhookForm.headers[oldKey];
        this.$delete(this.webhookForm.headers, oldKey);
        this.$set(this.webhookForm.headers, newKey, value);
        this.$delete(this.headerKeys, oldKey);
        this.$set(this.headerKeys, newKey, newKey);
      }
    },
    async submitWebhook() {
      this.$v.webhookForm.$touch();
      if (this.$v.webhookForm.event_name.$invalid || this.$v.webhookForm.url.$invalid) {
        return;
      }

      this.isSubmittingWebhook = true;
      try {
        // Limpar cabeçalhos vazios
        const headers = {};
        Object.keys(this.webhookForm.headers).forEach(key => {
          if (this.webhookForm.headers[key]) {
            headers[key] = this.webhookForm.headers[key];
          }
        });

        const webhookData = {
          ...this.webhookForm,
          headers,
        };

        if (this.isEditingWebhook) {
          await this.$store.dispatch('aiAgent/updateWebhook', {
            agentId: this.agentId,
            id: this.editingWebhookId,
            ...webhookData,
          });
          this.showAlert(this.$t('AI_AGENT.WEBHOOKS.EDIT_SUCCESS'), 'success');
        } else {
          await this.$store.dispatch('aiAgent/createWebhook', {
            agentId: this.agentId,
            ...webhookData,
          });
          this.showAlert(this.$t('AI_AGENT.WEBHOOKS.ADD_SUCCESS'), 'success');
        }
        this.showWebhookModal = false;
      } catch (error) {
        this.showAlert(
          this.isEditingWebhook
            ? this.$t('AI_AGENT.WEBHOOKS.EDIT_ERROR')
            : this.$t('AI_AGENT.WEBHOOKS.ADD_ERROR')
        );
      } finally {
        this.isSubmittingWebhook = false;
      }
    },
    confirmDeleteWebhook(webhookId, webhookName) {
      this.webhookToDelete = webhookId;
      this.deleteWebhookMessage = this.$t('AI_AGENT.WEBHOOKS.DELETE.CONFIRM.MESSAGE', {
        webhookName,
      });
      this.showDeleteWebhookConfirmation = true;
    },
    hideDeleteWebhookConfirmation() {
      this.showDeleteWebhookConfirmation = false;
      this.webhookToDelete = null;
      this.deleteWebhookMessage = '';
    },
    async deleteWebhook() {
      try {
        await this.$store.dispatch('aiAgent/deleteWebhook', {
          agentId: this.agentId,
          id: this.webhookToDelete,
        });
        this.showAlert(this.$t('AI_AGENT.WEBHOOKS.DELETE.SUCCESS'), 'success');
      } catch (error) {
        this.showAlert(this.$t('AI_AGENT.WEBHOOKS.DELETE.ERROR'));
      } finally {
        this.hideDeleteWebhookConfirmation();
      }
    },
    async testWebhook(webhookId) {
      this.testingWebhookId = webhookId;
      try {
        const result = await this.$store.dispatch('aiAgent/testWebhook', {
          agentId: this.agentId,
          id: webhookId,
        });
        if (result.success) {
          this.showAlert(this.$t('AI_AGENT.WEBHOOKS.TEST_SUCCESS'), 'success');
        } else {
          this.showAlert(this.$t('AI_AGENT.WEBHOOKS.TEST_ERROR'));
        }
      } catch (error) {
        this.showAlert(this.$t('AI_AGENT.WEBHOOKS.TEST_ERROR'));
      } finally {
        this.testingWebhookId = null;
      }
    },
    
    // Métodos gerais
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
.tabs-container {
  margin-top: var(--space-large);
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--s-200);
  margin-bottom: var(--space-normal);
}

.tab {
  padding: var(--space-small) var(--space-normal);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  
  &.active {
    border-bottom-color: var(--w-600);
    font-weight: 600;
  }
  
  &:hover:not(.active) {
    border-bottom-color: var(--s-300);
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-normal);
}

.no-items-message {
  text-align: center;
  color: var(--s-600);
  margin: var(--space-large) 0;
}

.parameter-item, .webhook-item {
  display: flex;
  border: 1px solid var(--s-200);
  border-radius: 4px;
  margin-bottom: var(--space-small);
  background-color: var(--white);
}

.parameter-content, .webhook-content {
  flex: 1;
  padding: var(--space-small);
}

.parameter-header, .webhook-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 1rem;
  }
}

.parameter-actions, .webhook-actions {
  display: flex;
}

.parameter-details, .webhook-details {
  margin-top: var(--space-small);
  font-size: 0.9rem;
  color: var(--s-700);
}

.drag-handle {
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  color: var(--s-500);
  background-color: var(--s-50);
  border-right: 1px solid var(--s-200);
}

.label {
  font-weight: 600;
  margin-right: var(--space-smaller);
}

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

.header-item, .option-item {
  display: flex;
  margin-bottom: var(--space-smaller);
  align-items: center;
}

.header-key, .header-value {
  flex: 1;
  margin-right: var(--space-smaller);
}

.modal-footer {
  margin-top: var(--space-medium);
}
</style>
