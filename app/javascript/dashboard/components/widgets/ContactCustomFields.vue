<template>
  <div class="custom-fields-section">
    <div class="section-title">
      <h3 class="text-base font-medium mb-2">
        {{ $t('CONTACT_CUSTOMIZATION.CONTACT_FORM.CUSTOM_FIELDS') }}
      </h3>
    </div>
    
    <div v-if="uiFlags.isFetchingValues" class="flex items-center justify-center py-4">
      <spinner size="small" />
    </div>
    <div v-else-if="!activeFields.length" class="text-center py-4 text-slate-500 text-sm">
      {{ $t('CONTACT_CUSTOMIZATION.CONTACT_FORM.NO_FIELDS') }}
    </div>
    <div v-else class="space-y-4">
      <div v-for="field in activeFields" :key="field.id" class="custom-field-item">
        <label class="block text-sm font-medium mb-1">
          {{ field.name }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        
        <p v-if="field.description" class="text-xs text-slate-500 mb-2">
          {{ field.description }}
        </p>
        
        <!-- Text input -->
        <input
          v-if="field.field_type === 'text'"
          v-model="fieldValues[field.id]"
          type="text"
          class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
          :placeholder="field.placeholder"
          :required="field.required"
        />
        
        <!-- Email input -->
        <input
          v-else-if="field.field_type === 'email'"
          v-model="fieldValues[field.id]"
          type="email"
          class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
          :placeholder="field.placeholder"
          :required="field.required"
        />
        
        <!-- Number input -->
        <input
          v-else-if="field.field_type === 'number'"
          v-model="fieldValues[field.id]"
          type="number"
          class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
          :placeholder="field.placeholder"
          :required="field.required"
        />
        
        <!-- Phone input -->
        <input
          v-else-if="field.field_type === 'phone'"
          v-model="fieldValues[field.id]"
          type="tel"
          class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
          :placeholder="field.placeholder"
          :required="field.required"
        />
        
        <!-- Link input -->
        <input
          v-else-if="field.field_type === 'link'"
          v-model="fieldValues[field.id]"
          type="url"
          class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
          :placeholder="field.placeholder"
          :required="field.required"
        />
        
        <!-- Textarea -->
        <textarea
          v-else-if="field.field_type === 'textarea'"
          v-model="fieldValues[field.id]"
          class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
          :placeholder="field.placeholder"
          rows="3"
          :required="field.required"
        ></textarea>
        
        <!-- Date input -->
        <input
          v-else-if="field.field_type === 'date'"
          v-model="fieldValues[field.id]"
          type="date"
          class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
          :required="field.required"
        />
        
        <!-- Checkbox -->
        <div v-else-if="field.field_type === 'checkbox'" class="flex items-center">
          <input
            :id="`field-${field.id}`"
            v-model="fieldValues[field.id]"
            type="checkbox"
            class="rounded border-slate-300 dark:border-slate-700 text-woot-500 focus:ring-woot-500"
            :required="field.required"
            true-value="true"
            false-value="false"
          />
          <label :for="`field-${field.id}`" class="ml-2 text-sm">
            {{ field.placeholder || $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.CHECKBOX_LABEL') }}
          </label>
        </div>
        
        <!-- Radio buttons -->
        <div v-else-if="field.field_type === 'radio'" class="space-y-2">
          <div
            v-for="(option, index) in field.options"
            :key="index"
            class="flex items-center"
          >
            <input
              :id="`field-${field.id}-option-${index}`"
              v-model="fieldValues[field.id]"
              type="radio"
              :name="`field-${field.id}`"
              :value="option"
              class="border-slate-300 dark:border-slate-700 text-woot-500 focus:ring-woot-500"
              :required="field.required"
            />
            <label :for="`field-${field.id}-option-${index}`" class="ml-2 text-sm">
              {{ option }}
            </label>
          </div>
        </div>
        
        <!-- Dropdown -->
        <select
          v-else-if="field.field_type === 'dropdown'"
          v-model="fieldValues[field.id]"
          class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
          :required="field.required"
        >
          <option value="" disabled selected>
            {{ field.placeholder || $t('CONTACT_CUSTOMIZATION.FIELD_EDITOR.SELECT_PLACEHOLDER') }}
          </option>
          <option
            v-for="(option, index) in field.options"
            :key="index"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
      
      <div class="flex justify-end mt-4">
        <woot-button
          color-scheme="primary"
          :loading="uiFlags.isUpdatingValues"
          @click="saveCustomFields"
        >
          {{ $t('SAVE') }}
        </woot-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ContactCustomFields',
  props: {
    contact: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fieldValues: {},
    };
  },
  computed: {
    ...mapGetters({
      activeFields: 'contactCustomization/getActiveFields',
      existingValues: 'contactCustomization/getFieldValues',
      uiFlags: 'contactCustomization/getUIFlags',
    }),
    contactId() {
      return this.contact.id;
    },
  },
  watch: {
    contactId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.fetchFieldValues();
        }
      },
    },
    existingValues: {
      immediate: true,
      handler(newValues) {
        this.initializeFieldValues(newValues);
      },
    },
  },
  methods: {
    async fetchFieldValues() {
      try {
        await this.$store.dispatch('contactCustomization/fetchFields');
        await this.$store.dispatch('contactCustomization/fetchFieldValues', this.contactId);
      } catch (error) {
        // Tratar erro
      }
    },
    initializeFieldValues(values) {
      const fieldValues = {};
      
      // Inicializar com valores vazios para todos os campos ativos
      this.activeFields.forEach(field => {
        fieldValues[field.id] = '';
        
        // Definir valor padrão para checkbox
        if (field.field_type === 'checkbox') {
          fieldValues[field.id] = 'false';
        }
      });
      
      // Preencher com valores existentes
      if (values && values.length) {
        values.forEach(value => {
          fieldValues[value.field_id] = value.value;
        });
      }
      
      this.fieldValues = fieldValues;
    },
    async saveCustomFields() {
      try {
        const fieldValuesArray = Object.keys(this.fieldValues).map(fieldId => ({
          field_id: parseInt(fieldId, 10),
          value: this.fieldValues[fieldId],
        }));
        
        await this.$store.dispatch('contactCustomization/updateFieldValues', {
          contactId: this.contactId,
          fieldValues: fieldValuesArray,
        });
        
        this.showAlert(this.$t('CONTACT_CUSTOMIZATION.CONTACT_FORM.SAVE_SUCCESS'));
      } catch (error) {
        this.showAlert(this.$t('CONTACT_CUSTOMIZATION.CONTACT_FORM.SAVE_ERROR'), 'error');
      }
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
