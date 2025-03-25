<template>
  <div class="parameters-manager">
    <div class="parameters-header">
      <h3 class="parameters-title">{{ $t('AI_AGENT.PARAMETERS.TITLE') }}</h3>
      <p class="parameters-description">
        {{ $t('AI_AGENT.PARAMETERS.DESCRIPTION') }}
      </p>
      <div class="parameters-actions">
        <woot-button
          color-scheme="primary"
          icon="add"
          @click="showParameterForm = true"
        >
          {{ $t('AI_AGENT.PARAMETERS.ADD_BUTTON') }}
        </woot-button>
      </div>
    </div>

    <woot-loading-state
      v-if="uiFlags.isFetchingParameters"
      :message="$t('LOADING')"
    />

    <div v-else-if="!parameters.length" class="empty-state">
      <span class="empty-state-title">
        {{ $t('AI_AGENT.PARAMETERS.EMPTY.TITLE') }}
      </span>
      <span class="empty-state-message">
        {{ $t('AI_AGENT.PARAMETERS.EMPTY.DESCRIPTION') }}
      </span>
      <woot-button
        color-scheme="primary"
        icon="add"
        @click="showParameterForm = true"
      >
        {{ $t('AI_AGENT.PARAMETERS.ADD_BUTTON') }}
      </woot-button>
    </div>

    <draggable
      v-else
      v-model="localParameters"
      class="parameters-list"
      handle=".drag-handle"
      @end="onDragEnd"
    >
      <div
        v-for="parameter in localParameters"
        :key="parameter.id"
        class="parameter-item"
      >
        <div class="parameter-drag">
          <i class="icon-drag drag-handle"></i>
        </div>
        <div class="parameter-content">
          <div class="parameter-header">
            <h4 class="parameter-name">{{ parameter.name }}</h4>
            <span class="parameter-type">
              {{ $t(`AI_AGENT.PARAMETERS.FORM.TYPES.${parameter.param_type.toUpperCase()}`) }}
            </span>
            <span
              v-if="parameter.required"
              class="parameter-required"
            >
              {{ $t('REQUIRED') }}
            </span>
          </div>
          <p v-if="parameter.description" class="parameter-description">
            {{ parameter.description }}
          </p>
          <div v-if="parameter.param_type === 'select'" class="parameter-options">
            <span class="parameter-options-label">{{ $t('OPTIONS') }}:</span>
            <div class="parameter-options-list">
              <span
                v-for="(option, index) in parameter.options"
                :key="index"
                class="parameter-option"
              >
                {{ option }}
              </span>
            </div>
          </div>
        </div>
        <div class="parameter-actions">
          <woot-button
            variant="clear"
            color-scheme="secondary"
            icon="edit"
            @click="editParameter(parameter)"
          />
          <woot-button
            variant="clear"
            color-scheme="alert"
            icon="delete"
            @click="confirmDeleteParameter(parameter.id)"
          />
        </div>
      </div>
    </draggable>

    <woot-modal
      :show.sync="showParameterForm"
      :title="editMode ? $t('AI_AGENT.PARAMETERS.FORM.EDIT_TITLE') : $t('AI_AGENT.PARAMETERS.FORM.TITLE')"
      :on-close="closeParameterForm"
    >
      <div class="parameter-form">
        <div class="form-row">
          <woot-input
            v-model="parameterForm.name"
            :label="$t('AI_AGENT.PARAMETERS.FORM.NAME')"
            :placeholder="$t('AI_AGENT.PARAMETERS.FORM.NAME_PLACEHOLDER')"
            :error="formErrors.name"
            required
          />
        </div>

        <div class="form-row">
          <label class="form-label">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPE') }}</label>
          <select v-model="parameterForm.param_type" class="form-select">
            <option value="text">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPES.TEXT') }}</option>
            <option value="number">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPES.NUMBER') }}</option>
            <option value="boolean">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPES.BOOLEAN') }}</option>
            <option value="select">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPES.SELECT') }}</option>
            <option value="textarea">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPES.TEXTAREA') }}</option>
            <option value="json">{{ $t('AI_AGENT.PARAMETERS.FORM.TYPES.JSON') }}</option>
          </select>
        </div>

        <div class="form-row">
          <woot-input
            v-model="parameterForm.description"
            :label="$t('AI_AGENT.PARAMETERS.FORM.DESCRIPTION')"
            :placeholder="$t('AI_AGENT.PARAMETERS.FORM.DESCRIPTION_PLACEHOLDER')"
            input-type="textarea"
          />
        </div>

        <div class="form-row">
          <woot-input
            v-model="parameterForm.default_value"
            :label="$t('AI_AGENT.PARAMETERS.FORM.DEFAULT_VALUE')"
            :placeholder="$t('AI_AGENT.PARAMETERS.FORM.DEFAULT_VALUE_PLACEHOLDER')"
          />
        </div>

        <div class="form-row">
          <woot-toggle-switch
            v-model="parameterForm.required"
            :label="$t('AI_AGENT.PARAMETERS.FORM.REQUIRED')"
          />
        </div>

        <div v-if="parameterForm.param_type === 'select'" class="form-row">
          <label class="form-label">
            {{ $t('AI_AGENT.PARAMETERS.FORM.OPTIONS') }}
            <span class="form-help">
              {{ $t('AI_AGENT.PARAMETERS.FORM.OPTIONS_HELP') }}
            </span>
          </label>
          <div
            v-for="(option, index) in parameterForm.options"
            :key="index"
            class="option-row"
          >
            <woot-input
              v-model="parameterForm.options[index]"
              :placeholder="$t('AI_AGENT.PARAMETERS.FORM.OPTION_PLACEHOLDER')"
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
            {{ $t('AI_AGENT.PARAMETERS.FORM.ADD_OPTION') }}
          </woot-button>
        </div>
      </div>

      <div slot="footer" class="modal-footer">
        <woot-button
          color-scheme="secondary"
          @click="closeParameterForm"
        >
          {{ $t('CANCEL') }}
        </woot-button>
        <woot-button
          color-scheme="primary"
          @click="saveParameter"
          :loading="uiFlags.isCreatingParameter || uiFlags.isUpdatingParameter"
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
      @confirm="deleteParameter"
      @reject="cancelDeleteParameter"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Draggable from 'vuedraggable';

export default {
  name: 'ParametersManager',
  components: {
    Draggable,
  },
  props: {
    agentId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      showParameterForm: false,
      editMode: false,
      parameterForm: {
        name: '',
        param_type: 'text',
        description: '',
        default_value: '',
        required: false,
        options: [],
      },
      formErrors: {
        name: '',
      },
      localParameters: [],
      showDeleteConfirmation: false,
      parameterToDelete: null,
    };
  },
  computed: {
    ...mapGetters({
      parameters: 'aiAgent/getParameters',
      uiFlags: 'aiAgent/getUIFlags',
    }),
  },
  watch: {
    parameters: {
      immediate: true,
      handler(newVal) {
        this.localParameters = [...newVal];
      },
    },
  },
  mounted() {
    this.fetchParameters();
  },
  methods: {
    async fetchParameters() {
      try {
        await this.$store.dispatch('aiAgent/fetchParameters', this.agentId);
      } catch (error) {
        this.showAlert(this.$t('ERROR'), error.message);
      }
    },
    resetForm() {
      this.parameterForm = {
        name: '',
        param_type: 'text',
        description: '',
        default_value: '',
        required: false,
        options: [],
      };
      this.formErrors = {
        name: '',
      };
    },
    editParameter(parameter) {
      this.editMode = true;
      this.parameterForm = {
        id: parameter.id,
        name: parameter.name,
        param_type: parameter.param_type,
        description: parameter.description || '',
        default_value: parameter.default_value || '',
        required: parameter.required,
        options: [...(parameter.options || [])],
      };
      this.showParameterForm = true;
    },
    closeParameterForm() {
      this.showParameterForm = false;
      this.editMode = false;
      this.resetForm();
    },
    addOption() {
      this.parameterForm.options.push('');
    },
    removeOption(index) {
      this.parameterForm.options.splice(index, 1);
    },
    validateForm() {
      this.formErrors = {
        name: '',
      };

      let isValid = true;

      if (!this.parameterForm.name.trim()) {
        this.formErrors.name = this.$t('FORMS.ERROR.REQUIRED');
        isValid = false;
      }

      return isValid;
    },
    async saveParameter() {
      if (!this.validateForm()) {
        return;
      }

      try {
        if (this.editMode) {
          await this.$store.dispatch('aiAgent/updateParameter', {
            agentId: this.agentId,
            id: this.parameterForm.id,
            name: this.parameterForm.name,
            param_type: this.parameterForm.param_type,
            description: this.parameterForm.description,
            default_value: this.parameterForm.default_value,
            required: this.parameterForm.required,
            options: this.parameterForm.options.filter(o => o.trim()),
          });
        } else {
          await this.$store.dispatch('aiAgent/createParameter', {
            agentId: this.agentId,
            name: this.parameterForm.name,
            param_type: this.parameterForm.param_type,
            description: this.parameterForm.description,
            default_value: this.parameterForm.default_value,
            required: this.parameterForm.required,
            options: this.parameterForm.options.filter(o => o.trim()),
          });
        }
        this.showAlert(
          this.$t('SUCCESS'),
          this.$t('AI_AGENT.PARAMETERS.SAVE_SUCCESS')
        );
        this.closeParameterForm();
      } catch (error) {
        this.showAlert(
          this.$t('ERROR'),
          this.$t('AI_AGENT.PARAMETERS.SAVE_ERROR')
        );
      }
    },
    confirmDeleteParameter(parameterId) {
      this.parameterToDelete = parameterId;
      this.showDeleteConfirmation = true;
    },
    async deleteParameter() {
      try {
        await this.$store.dispatch('aiAgent/deleteParameter', {
          agentId: this.agentId,
          id: this.parameterToDelete,
        });
        this.showAlert(
          this.$t('SUCCESS'),
          this.$t('AI_AGENT.PARAMETERS.DELETE_SUCCESS')
        );
      } catch (error) {
        this.showAlert(
          this.$t('ERROR'),
          this.$t('AI_AGENT.PARAMETERS.DELETE_ERROR')
        );
      } finally {
        this.cancelDeleteParameter();
      }
    },
    cancelDeleteParameter() {
      this.showDeleteConfirmation = false;
      this.parameterToDelete = null;
    },
    async onDragEnd() {
      if (JSON.stringify(this.localParameters) === JSON.stringify(this.parameters)) {
        return;
      }

      try {
        await this.$store.dispatch('aiAgent/reorderParameters', {
          agentId: this.agentId,
          parameterIds: this.localParameters.map(p => p.id),
        });
        this.showAlert(
          this.$t('SUCCESS'),
          this.$t('AI_AGENT.PARAMETERS.REORDER_SUCCESS')
        );
      } catch (error) {
        this.showAlert(
          this.$t('ERROR'),
          this.$t('AI_AGENT.PARAMETERS.REORDER_ERROR')
        );
        // Revert to original order
        this.localParameters = [...this.parameters];
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
.parameters-header {
  margin-bottom: var(--space-medium);
}

.parameters-title {
  font-size: var(--font-size-medium);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-smaller);
}

.parameters-description {
  color: var(--s-600);
  margin-bottom: var(--space-small);
}

.parameters-actions {
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

.parameters-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-small);
}

.parameter-item {
  display: flex;
  align-items: flex-start;
  background-color: var(--white);
  border: 1px solid var(--s-100);
  border-radius: var(--border-radius-small);
  padding: var(--space-small);
}

.parameter-drag {
  padding: var(--space-smaller);
  cursor: grab;
  color: var(--s-500);
}

.parameter-content {
  flex: 1;
  padding: 0 var(--space-small);
}

.parameter-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-smaller);
  margin-bottom: var(--space-smaller);
}

.parameter-name {
  font-weight: var(--font-weight-medium);
  margin: 0;
}

.parameter-type {
  font-size: var(--font-size-small);
  background-color: var(--s-50);
  color: var(--s-700);
  padding: 2px var(--space-smaller);
  border-radius: var(--border-radius-small);
}

.parameter-required {
  font-size: var(--font-size-small);
  background-color: var(--r-50);
  color: var(--r-700);
  padding: 2px var(--space-smaller);
  border-radius: var(--border-radius-small);
}

.parameter-description {
  color: var(--s-600);
  font-size: var(--font-size-small);
  margin-bottom: var(--space-smaller);
}

.parameter-options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-smaller);
  font-size: var(--font-size-small);
}

.parameter-options-label {
  color: var(--s-700);
}

.parameter-options-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-smaller);
}

.parameter-option {
  background-color: var(--b-50);
  color: var(--b-700);
  padding: 2px var(--space-smaller);
  border-radius: var(--border-radius-small);
}

.parameter-actions {
  display: flex;
  gap: var(--space-smaller);
}

.parameter-form {
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

.option-row {
  display: flex;
  align-items: center;
  gap: var(--space-smaller);
  margin-bottom: var(--space-smaller);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-small);
}
</style>
