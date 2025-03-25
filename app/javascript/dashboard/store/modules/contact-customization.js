import ContactCustomizationAPI from '../../api/contact-customization';

const state = {
  fields: [],
  currentField: {},
  fieldValues: {},
  uiFlags: {
    isFetching: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isReordering: false,
    isFetchingValues: false,
    isUpdatingValues: false,
  },
};

export const getters = {
  getAllFields(_state) {
    return _state.fields;
  },
  getActiveFields(_state) {
    return _state.fields.filter(field => field.active);
  },
  getCurrentField(_state) {
    return _state.currentField;
  },
  getFieldValues: _state => contactId => {
    return _state.fieldValues[contactId] || [];
  },
  getUIFlags(_state) {
    return _state.uiFlags;
  },
};

export const actions = {
  async fetchFields({ commit }) {
    commit('SET_UI_FLAG', { isFetching: true });
    try {
      const response = await ContactCustomizationAPI.getFields();
      commit('SET_FIELDS', response.data);
      commit('SET_UI_FLAG', { isFetching: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetching: false });
      throw error;
    }
  },

  async fetchField({ commit }, fieldId) {
    commit('SET_UI_FLAG', { isFetching: true });
    try {
      const response = await ContactCustomizationAPI.getField(fieldId);
      commit('SET_CURRENT_FIELD', response.data);
      commit('SET_UI_FLAG', { isFetching: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetching: false });
      throw error;
    }
  },

  async createField({ commit }, fieldData) {
    commit('SET_UI_FLAG', { isCreating: true });
    try {
      const response = await ContactCustomizationAPI.createField(fieldData);
      commit('ADD_FIELD', response.data);
      commit('SET_UI_FLAG', { isCreating: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isCreating: false });
      throw error;
    }
  },

  async updateField({ commit }, { id, ...fieldData }) {
    commit('SET_UI_FLAG', { isUpdating: true });
    try {
      const response = await ContactCustomizationAPI.updateField(id, fieldData);
      commit('UPDATE_FIELD', response.data);
      commit('SET_UI_FLAG', { isUpdating: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUpdating: false });
      throw error;
    }
  },

  async deleteField({ commit }, fieldId) {
    commit('SET_UI_FLAG', { isDeleting: true });
    try {
      await ContactCustomizationAPI.deleteField(fieldId);
      commit('REMOVE_FIELD', fieldId);
      commit('SET_UI_FLAG', { isDeleting: false });
    } catch (error) {
      commit('SET_UI_FLAG', { isDeleting: false });
      throw error;
    }
  },

  async reorderFields({ commit }, fieldIds) {
    commit('SET_UI_FLAG', { isReordering: true });
    try {
      await ContactCustomizationAPI.reorderFields(fieldIds);
      commit('REORDER_FIELDS', fieldIds);
      commit('SET_UI_FLAG', { isReordering: false });
    } catch (error) {
      commit('SET_UI_FLAG', { isReordering: false });
      throw error;
    }
  },

  async fetchFieldValues({ commit }, contactId) {
    commit('SET_UI_FLAG', { isFetchingValues: true });
    try {
      const response = await ContactCustomizationAPI.getFieldValues(contactId);
      commit('SET_FIELD_VALUES', { contactId, values: response.data });
      commit('SET_UI_FLAG', { isFetchingValues: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingValues: false });
      throw error;
    }
  },

  async updateFieldValues({ commit }, { contactId, fieldValues }) {
    commit('SET_UI_FLAG', { isUpdatingValues: true });
    try {
      const response = await ContactCustomizationAPI.updateFieldValues(contactId, fieldValues);
      commit('SET_FIELD_VALUES', { contactId, values: response.data });
      commit('SET_UI_FLAG', { isUpdatingValues: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUpdatingValues: false });
      throw error;
    }
  },
};

export const mutations = {
  SET_UI_FLAG(_state, data) {
    _state.uiFlags = {
      ..._state.uiFlags,
      ...data,
    };
  },

  SET_FIELDS(_state, fields) {
    _state.fields = fields;
  },

  SET_CURRENT_FIELD(_state, field) {
    _state.currentField = field;
  },

  ADD_FIELD(_state, field) {
    _state.fields.push(field);
  },

  UPDATE_FIELD(_state, updatedField) {
    const fieldIndex = _state.fields.findIndex(field => field.id === updatedField.id);
    if (fieldIndex !== -1) {
      _state.fields.splice(fieldIndex, 1, updatedField);
    }
    if (_state.currentField.id === updatedField.id) {
      _state.currentField = updatedField;
    }
  },

  REMOVE_FIELD(_state, fieldId) {
    _state.fields = _state.fields.filter(field => field.id !== fieldId);
    if (_state.currentField.id === fieldId) {
      _state.currentField = {};
    }
  },

  REORDER_FIELDS(_state, fieldIds) {
    const reorderedFields = [];
    fieldIds.forEach((fieldId, index) => {
      const field = _state.fields.find(f => f.id === fieldId);
      if (field) {
        reorderedFields.push({ ...field, display_order: index + 1 });
      }
    });
    _state.fields = reorderedFields;
  },

  SET_FIELD_VALUES(_state, { contactId, values }) {
    _state.fieldValues = {
      ..._state.fieldValues,
      [contactId]: values,
    };
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
