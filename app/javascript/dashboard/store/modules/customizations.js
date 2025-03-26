import CustomizationsAPI from '../../api/customizations';

const state = {
  customizations: {},
  uiFlags: {
    isFetchingCustomizations: false,
    isUpdatingCustomizations: false,
  },
};

export const getters = {
  getCustomizations(_state) {
    return _state.customizations;
  },
  getLayoutCustomizations(_state) {
    return _state.customizations.layout || {};
  },
  getContactsCustomizations(_state) {
    return _state.customizations.contacts || { custom_fields: [] };
  },
  getKanbanCustomizations(_state) {
    return _state.customizations.kanban || { columns: [] };
  },
  getUIFlags(_state) {
    return _state.uiFlags;
  },
};

export const actions = {
  async fetchCustomizations({ commit }) {
    commit('SET_UI_FLAG', { isFetchingCustomizations: true });
    try {
      const response = await CustomizationsAPI.getCustomizations();
      commit('SET_CUSTOMIZATIONS', response.data);
      commit('SET_UI_FLAG', { isFetchingCustomizations: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingCustomizations: false });
      throw error;
    }
  },

  async updateCustomizations({ commit }, customizationData) {
    commit('SET_UI_FLAG', { isUpdatingCustomizations: true });
    try {
      const response = await CustomizationsAPI.updateCustomizations(customizationData);
      commit('SET_CUSTOMIZATIONS', response.data);
      commit('SET_UI_FLAG', { isUpdatingCustomizations: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUpdatingCustomizations: false });
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

  SET_CUSTOMIZATIONS(_state, customizations) {
    _state.customizations = customizations;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
