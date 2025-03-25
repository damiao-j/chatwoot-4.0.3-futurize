<template>
  <div class="contact-field-editor-view">
    <div class="flex flex-col h-full w-full">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <woot-button
            variant="clear"
            color-scheme="secondary"
            icon="arrow-left"
            class="mr-2"
            @click="goBack"
          />
          <h1 class="page-title text-xl font-medium">
            {{ isNewField ? $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.NEW_FIELD') : field.name }}
          </h1>
        </div>
        <div class="flex">
          <woot-button
            color-scheme="primary"
            @click="saveField"
            :loading="uiFlags.isUpdating"
          >
            {{ $t('SAVE') }}
          </woot-button>
        </div>
      </div>

      <div v-if="uiFlags.isFetching" class="h-full flex items-center justify-center">
        <spinner size="medium" />
      </div>
      <div v-else-if="!isNewField && !field.id" class="h-full flex items-center justify-center">
        <div class="text-center">
          <h3 class="text-lg font-medium mb-2">
            {{ $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.NOT_FOUND.TITLE') }}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {{ $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.NOT_FOUND.DESCRIPTION') }}
          </p>
          <woot-button
            color-scheme="primary"
            icon="arrow-left"
            @click="goBack"
          >
            {{ $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.GO_BACK') }}
          </woot-button>
        </div>
      </div>
      <div v-else class="flex-1 overflow-y-auto">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <h2 class="text-lg font-medium mb-4">{{ $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.BASIC_INFO') }}</h2>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="field-name">
              {{ $t('CONTACT_CUSTOMIZATION.FIELDS.FORM.NAME.LABEL') }}
            </label>
            <input
              id="field-name"
              v-model="fieldForm.name"
              type="text"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('CONTACT_CUSTOMIZATION.FIELDS.FORM.NAME.PLACEHOLDER')"
              required
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="field-type">
              {{ $t('CONTACT_CUSTOMIZATION.FIELDS.FORM.TYPE.LABEL') }}
            </label>
            <select
              id="field-type"
              v-model="fieldForm.field_type"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              required
              :disabled="!isNewField"
            >
              <option v-for="type in fieldTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
            <p v-if="!isNewField" class="text-xs text-slate-500 mt-1">
              {{ $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.TYPE_LOCKED') }}
            </p>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="field-description">
              {{ $t('CONTACT_CUSTOMIZATION.FIELDS.FORM.DESCRIPTION.LABEL') }}
            </label>
            <input
              id="field-description"
              v-model="fieldForm.description"
              type="text"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('CONTACT_CUSTOMIZATION.FIELDS.FORM.DESCRIPTION.PLACEHOLDER')"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="field-placeholder">
              {{ $t('CONTACT_CUSTOMIZATION.FIELDS.FORM.PLACEHOLDER.LABEL') }}
            </label>
            <input
              id="field-placeholder"
              v-model="fieldForm.placeholder"
              type="text"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('CONTACT_CUSTOMIZATION.FIELDS.FORM.PLACEHOLDER.PLACEHOLDER')"
            />
          </div>
          
          <div class="mb-4 flex items-center">
            <input
              id="field-required"
              v-model="fieldForm.required"
              type="checkbox"
              class="rounded border-slate-300 dark:border-slate-700 text-woot-500 focus:ring-woot-500"
            />
            <label class="ml-2 text-sm font-medium" for="field-required">
              {{ $t('CONTACT_CUSTOMIZATION.FIELDS.FORM.REQUIRED.LABEL') }}
            </label>
          </div>
          
          <div class="mb-4 flex items-center">
            <input
              id="field-active"
              v-model="fieldForm.active"
              type="checkbox"
              class="rounded border-slate-300 dark:border-slate-700 text-woot-500 focus:ring-woot-500"
            />
            <label class="ml-2 text-sm font-medium" for="field-active">
              {{ $t('CONTACT_CUSTOMIZATION.FIELDS.FORM.ACTIVE.LABEL') }}
            </label>
          </div>
        </div>
        
        <div v-if="showOptionsEditor" class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <h2 class="text-lg font-medium mb-4">{{ $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.OPTIONS') }}</h2>
          
          <div class="mb-4">
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {{ $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.OPTIONS_HELP') }}
            </p>
            
            <div v-for="(option, index) in fieldForm.options" :key="index" class="flex mb-2">
              <input
                v-model="fieldForm.options[index]"
                type="text"
                class="flex-1 rounded-l-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
                :placeholder="$t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.OPTION_PLACEHOLDER')"
              />
              <button
                type="button"
                class="rounded-r-md border border-l-0 border-slate-300 dark:border-slate-700 px-3 py-2 bg-slate-50 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                @click="removeOption(index)"
              >
                <i class="icon-delete"></i>
              </button>
            </div>
            
            <woot-button
              variant="clear"
              color-scheme="secondary"
              size="small"
              icon="plus"
              class="mt-2"
              @click="addOption"
            >
              {{ $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.ADD_OPTION') }}
            </woot-button>
          </div>
        </div>
        
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <h2 class="text-lg font-medium mb-4">{{ $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.PREVIEW') }}</h2>
          
          <div class="preview-container border border-slate-200 dark:border-slate-600 rounded-lg p-4">
            <label class="block text-sm font-medium mb-1">
              {{ fieldForm.name }}
              <span v-if="fieldForm.required" class="text-red-500">*</span>
            </label>
            
            <p v-if="fieldForm.description" class="text-xs text-slate-500 mb-2">
              {{ fieldForm.description }}
            </p>
            
            <!-- Text input -->
            <input
              v-if="['text', 'email', 'number', 'phone', 'link'].includes(fieldForm.field_type)"
              type="text"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="fieldForm.placeholder"
              disabled
            />
            
            <!-- Textarea -->
            <textarea
              v-else-if="fieldForm.field_type === 'textarea'"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="fieldForm.placeholder"
              rows="3"
              disabled
            ></textarea>
            
            <!-- Date input -->
            <input
              v-else-if="fieldForm.field_type === 'date'"
              type="date"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              disabled
            />
            
            <!-- Checkbox -->
            <div v-else-if="fieldForm.field_type === 'checkbox'" class="flex items-center">
              <input
                type="checkbox"
                class="rounded border-slate-300 dark:border-slate-700 text-woot-500 focus:ring-woot-500"
                disabled
              />
              <span class="ml-2 text-sm">{{ fieldForm.placeholder || $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.CHECKBOX_LABEL') }}</span>
            </div>
            
            <!-- Radio buttons -->
            <div v-else-if="fieldForm.field_type === 'radio'" class="space-y-2">
              <div
                v-for="(option, index) in fieldForm.options.length ? fieldForm.options : ['Option 1', 'Option 2']"
                :key="index"
                class="flex items-center"
              >
                <input
                  type="radio"
                  name="preview-radio"
                  class="border-slate-300 dark:border-slate-700 text-woot-500 focus:ring-woot-500"
                  disabled
                />
                <span class="ml-2 text-sm">{{ option }}</span>
              </div>
            </div>
            
            <!-- Dropdown -->
            <select
              v-else-if="fieldForm.field_type === 'dropdown'"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              disabled
            >
              <option value="" disabled selected>{{ fieldForm.placeholder || $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.SELECT_PLACEHOLDER') }}</option>
              <option
                v-for="(option, index) in fieldForm.options.length ? fieldForm.options : ['Option 1', 'Option 2']"
                :key="index"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ContactFieldEditor',
  data() {
    return {
      fieldForm: {
        name: '',
        field_type: 'text',
        description: '',
        placeholder: '',
        required: false,
        active: true,
        options: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      field: 'contactCustomization/getCurrentField',
      uiFlags: 'contactCustomization/getUIFlags',
    }),
    fieldId() {
      return this.$route.params.fieldId;
    },
    isNewField() {
      return this.fieldId === 'new';
    },
    showOptionsEditor() {
      return ['dropdown', 'radio'].includes(this.fieldForm.field_type);
    },
    fieldTypes() {
      return [
        { value: 'text', label: this.$t('CONTACT_CUSTOMIZATION.FIELDS.TYPES.TEXT') },
        { value: 'number', label: this.$t('CONTACT_CUSTOMIZATION.FIELDS.TYPES.NUMBER') },
        { value: 'email', label: this.$t('CONTACT_CUSTOMIZATION.FIELDS.TYPES.EMAIL') },
        { value: 'phone', label: this.$t('CONTACT_CUSTOMIZATION.FIELDS.TYPES.PHONE') },
        { value: 'date', label: this.$t('CONTACT_CUSTOMIZATION.FIELDS.TYPES.DATE') },
        { value: 'dropdown', label: this.$t('CONTACT_CUSTOMIZATION.FIELDS.TYPES.DROPDOWN') },
        { value: 'checkbox', label: this.$t('CONTACT_CUSTOMIZATION.FIELDS.TYPES.CHECKBOX') },
        { value: 'radio', label: this.$t('CONTACT_CUSTOMIZATION.FIELDS.TYPES.RADIO') },
        { value: 'textarea', label: this.$t('CONTACT_CUSTOMIZATION.FIELDS.TYPES.TEXTAREA') },
        { value: 'link', label: this.$t('CONTACT_CUSTOMIZATION.FIELDS.TYPES.LINK') },
      ];
    },
  },
  watch: {
    field: {
      immediate: true,
      handler(newField) {
        if (newField && newField.id && !this.isNewField) {
          this.initializeForm(newField);
        }
      },
    },
    'fieldForm.field_type': function(newType) {
      // Limpar opções se o tipo não for dropdown ou radio
      if (!['dropdown', 'radio'].includes(newType)) {
        this.fieldForm.options = [];
      } else if (this.fieldForm.options.length === 0) {
        // Adicionar opções padrão se o tipo for dropdown ou radio e não houver opções
        this.fieldForm.options = ['Option 1', 'Option 2'];
      }
    },
  },
  mounted() {
    if (!this.isNewField) {
      this.fetchField();
    } else {
      // Inicializar formulário para novo campo
      this.fieldForm = {
        name: '',
        field_type: 'text',
        description: '',
        placeholder: '',
        required: false,
        active: true,
        options: [],
      };
    }
  },
  methods: {
    async fetchField() {
      try {
        await this.$store.dispatch('contactCustomization/fetchField', this.fieldId);
      } catch (error) {
        this.showAlert(this.$t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.FETCH_ERROR'), 'error');
      }
    },
    initializeForm(field) {
      this.fieldForm = {
        name: field.name || '',
        field_type: field.field_type || 'text',
        description: field.description || '',
        placeholder: field.placeholder || '',
        required: field.required || false,
        active: field.active || true,
        options: field.options || [],
      };
    },
    goBack() {
      this.$router.push({ name: 'contact_fields_manager' });
    },
    async saveField() {
      try {
        if (this.isNewField) {
          await this.$store.dispatch('contactCustomization/createField', this.fieldForm);
          this.showAlert(this.$t('CONTACT_CUSTOMIZATION.FIELDS.CREATE_SUCCESS'));
          this.goBack();
        } else {
          await this.$store.dispatch('contactCustomization/updateField', {
            id: this.fieldId,
            ...this.fieldForm,
          });
          this.showAlert(this.$t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.UPDATE_SUCCESS'));
        }
      } catch (error) {
        this.showAlert(
          this.isNewField
            ? this.$t('CONTACT_CUSTOMIZATION.FIELDS.CREATE_ERROR')
            : this.$t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.UPDATE_ERROR'),
          'error'
        );
      }
    },
    addOption() {
      this.fieldForm.options.push('');
    },
    removeOption(index) {
      this.fieldForm.options.splice(index, 1);
    },
    showAlert(message, type = 'success') {
      this.$store.dispatch('notifications/create', {
        type,
        message,
      });
    },
  },
};
</script>
