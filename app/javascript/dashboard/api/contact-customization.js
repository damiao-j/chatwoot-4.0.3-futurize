import apiClient from '../api_client';

const ContactCustomizationAPI = {
  getFields() {
    return apiClient.get('/api/v1/accounts/contact_customization/fields');
  },

  getField(fieldId) {
    return apiClient.get(`/api/v1/accounts/contact_customization/fields/${fieldId}`);
  },

  createField(fieldData) {
    return apiClient.post('/api/v1/accounts/contact_customization/fields', { field: fieldData });
  },

  updateField(fieldId, fieldData) {
    return apiClient.patch(`/api/v1/accounts/contact_customization/fields/${fieldId}`, { field: fieldData });
  },

  deleteField(fieldId) {
    return apiClient.delete(`/api/v1/accounts/contact_customization/fields/${fieldId}`);
  },

  reorderFields(fieldIds) {
    return apiClient.post('/api/v1/accounts/contact_customization/fields/reorder', { fields: fieldIds });
  },

  getFieldValues(contactId) {
    return apiClient.get(`/api/v1/accounts/contacts/${contactId}/contact_customization/field_values`);
  },

  createFieldValue(contactId, fieldValueData) {
    return apiClient.post(`/api/v1/accounts/contacts/${contactId}/contact_customization/field_values`, { field_value: fieldValueData });
  },

  updateFieldValue(contactId, fieldValueId, fieldValueData) {
    return apiClient.patch(`/api/v1/accounts/contacts/${contactId}/contact_customization/field_values/${fieldValueId}`, { field_value: fieldValueData });
  },

  deleteFieldValue(contactId, fieldValueId) {
    return apiClient.delete(`/api/v1/accounts/contacts/${contactId}/contact_customization/field_values/${fieldValueId}`);
  },

  updateFieldValues(contactId, fieldValues) {
    return apiClient.post(`/api/v1/accounts/contacts/${contactId}/contact_customization/field_values/bulk_update`, { field_values: fieldValues });
  },
};

export default ContactCustomizationAPI;
