<template>
  <div class="contact-fields-manager-view">
    <div class="flex flex-col h-full w-full">
      <div class="flex justify-between items-center mb-4">
        <h1 class="page-title text-xl font-medium">
          {{ $t('CONTACT_CUSTOMIZATION.FIELDS.HEADER') }}
        </h1>
        <div class="flex">
          <woot-button
            color-scheme="primary"
            icon="plus"
            @click="openAddFieldModal"
          >
            {{ $t('CONTACT_CUSTOMIZATION.FIELDS.ADD') }}
          </woot-button>
        </div>
      </div>

      <div v-if="uiFlags.isFetching" class="h-full flex items-center justify-center">
        <spinner size="medium" />
      </div>
      <div v-else-if="!fields.length" class="h-full flex items-center justify-center">
        <div class="text-center">
          <h3 class="text-lg font-medium mb-2">
            {{ $t('CONTACT_CUSTOMIZATION.FIELDS.EMPTY.TITLE') }}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {{ $t('CONTACT_CUSTOMIZATION.FIELDS.EMPTY.DESCRIPTION') }}
          </p>
          <woot-button
            color-scheme="primary"
            icon="plus"
            @click="openAddFieldModal"
          >
            {{ $t('CONTACT_CUSTOMIZATION.FIELDS.ADD') }}
          </woot-button>
        </div>
      </div>
      <div v-else class="flex-1 overflow-y-auto">
        <draggable
          v-model="sortableFields"
          handle=".drag-handle"
          ghost-class="bg-slate-100 dark:bg-slate-700"
          @end="onDragEnd"
        >
          <div
            v-for="field in sortableFields"
            :key="field.id"
            class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-4 hover:border-slate-200 dark:hover:border-slate-600 transition-all"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-center">
                <div class="drag-handle cursor-move mr-2 text-slate-400 dark:text-slate-500">
                  <i class="icon-drag text-lg"></i>
                </div>
                <div>
                  <h3 class="text-lg font-medium">{{ field.name }}</h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    {{ $t(`CONTACT_CUSTOMIZATION.FIELDS.TYPES.${field.field_type.toUpperCase()}`) }}
                    <span v-if="field.required" class="ml-2 text-red-500">*</span>
                  </p>
                </div>
              </div>
              <div class="flex">
                <woot-button
                  variant="clear"
                  color-scheme="secondary"
                  icon="edit"
                  size="small"
                  @click="goToFieldEditor(field.id)"
                />
                <woot-button
                  variant="clear"
                  color-scheme="alert"
                  icon="delete"
                  size="small"
                  @click="confirmDeleteField(field)"
                />
              </div>
            </div>
            
            <div class="mt-2">
              <p v-if="field.description" class="text-sm text-slate-500 dark:text-slate-500 mb-2">
                {{ field.description }}
              </p>
              
              <div v-if="field.field_type === 'dropdown' || field.field_type === 'radio'" class="mt-2">
                <p class="text-xs text-slate-500 dark:text-slate-500 mb-1">
                  {{ $t('CONTACT_CUSTOMIZATION.FIELDS.OPTIONS') }}:
                </p>
                <div class="flex flex-wrap gap-1">
                  <woot-badge
                    v-for="(option, index) in field.options"
                    :key="index"
                    color-scheme="secondary"
                    size="small"
                  >
                    {{ option }}
                  </woot-badge>
                </div>
              </div>
              
              <div class="flex justify-between mt-3">
                <woot-badge
                  :color-scheme="field.active ? 'success' : 'warning'"
                  size="small"
                >
                  {{ field.active ? $t('CONTACT_CUSTOMIZATION.FIELDS.ACTIVE') : $t('CONTACT_CUSTOMIZATION.FIELDS.INACTIVE') }}
                </woot-badge>
              </div>
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <woot-modal :show.sync="showAddFieldModal" :title="$t('CONTACT_CUSTOMIZATION.FIELDS.ADD_MODAL.TITLE')">
      <div class="p-4">
        <form @submit.prevent="createField">
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
            >
              <option v-for="type in fieldTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
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
          
          <div class="flex justify-end">
            <woot-button
              variant="clear"
              color-scheme="secondary"
              class="mr-2"
              @click="showAddFieldModal = false"
            >
              {{ $t('CANCEL') }}
            </woot-button>
            <woot-button
              color-scheme="primary"
              type="submit"
              :loading="uiFlags.isCreating"
            >
              {{ $t('CREATE') }}
            </woot-button>
          </div>
        </form>
      </div>
    </woot-modal>

    <woot-confirm-dialog
      :show.sync="showDeleteConfirmation"
      :title="$t('CONTACT_CUSTOMIZATION.FIELDS.DELETE.TITLE')"
      :message="$t('CONTACT_CUSTOMIZATION.FIELDS.DELETE.MESSAGE', { fieldName: selectedField?.name })"
      :confirm-text="$t('DELETE')"
      :reject-text="$t('CANCEL')"
      @confirm="deleteField"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Draggable from 'vuedraggable';

export default {
  name: 'ContactFieldsManager',
  components: {
    Draggable,
  },
  data() {
    return {
      showAddFieldModal: false,
      showDeleteConfirmation: false,
      selectedField: null,
      fieldForm: {
        name: '',
        field_type: 'text',
        description: '',
        placeholder: '',
        required: false,
        active: true,
      },
      sortableFields: [],
    };
  },
  computed: {
    ...mapGetters({
      fields: 'contactCustomization/getAllFields',
      uiFlags: 'contactCustomization/getUIFlags',
    }),
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
    fields: {
      immediate: true,
      handler(newFields) {
        this.sortableFields = [...newFields];
      },
    },
  },
  mounted() {
    this.fetchFields();
  },
  methods: {
    async fetchFields() {
      try {
        await this.$store.dispatch('contactCustomization/fetchFields');
      } catch (error) {
        this.showAlert(this.$t('CONTACT_CUSTOMIZATION.FIELDS.FETCH_ERROR'), 'error');
      }
    },
    openAddFieldModal() {
      this.fieldForm = {
        name: '',
        field_type: 'text',
        description: '',
        placeholder: '',
        required: false,
        active: true,
      };
      this.showAddFieldModal = true;
    },
    async createField() {
      try {
        const response = await this.$store.dispatch('contactCustomization/createField', this.fieldForm);
        this.showAlert(this.$t('CONTACT_CUSTOMIZATION.FIELDS.CREATE_SUCCESS'));
        this.showAddFieldModal = false;
        
        // Navegar para o editor do campo recém-criado
        if (response && response.id) {
          this.goToFieldEditor(response.id);
        }
      } catch (error) {
        this.showAlert(this.$t('CONTACT_CUSTOMIZATION.FIELDS.CREATE_ERROR'), 'error');
      }
    },
    goToFieldEditor(fieldId) {
      this.$router.push({ name: 'contact_field_editor', params: { fieldId } });
    },
    confirmDeleteField(field) {
      this.selectedField = field;
      this.showDeleteConfirmation = true;
    },
    async deleteField() {
      try {
        await this.$store.dispatch('contactCustomization/deleteField', this.selectedField.id);
        this.showAlert(this.$t('CONTACT_CUSTOMIZATION.FIELDS.DELETE_SUCCESS'));
        this.showDeleteConfirmation = false;
      } catch (error) {
        this.showAlert(this.$t('CONTACT_CUSTOMIZATION.FIELDS.DELETE_ERROR'), 'error');
      }
    },
    async onDragEnd() {
      if (JSON.stringify(this.sortableFields.map(f => f.id)) !== JSON.stringify(this.fields.map(f => f.id))) {
        try {
          await this.$store.dispatch('contactCustomization/reorderFields', this.sortableFields.map(f => f.id));
          this.showAlert(this.$t('CONTACT_CUSTOMIZATION.FIELDS.REORDER_SUCCESS'));
        } catch (error) {
          this.showAlert(this.$t('CONTACT_CUSTOMIZATION.FIELDS.REORDER_ERROR'), 'error');
          // Restaurar a ordem original
          this.sortableFields = [...this.fields];
        }
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
