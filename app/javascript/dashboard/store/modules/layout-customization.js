import LayoutCustomizationAPI from '../../api/layout-customization';

const state = {
  themes: [],
  currentTheme: {},
  uiFlags: {
    isFetching: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isActivating: false,
    isUploading: false,
  },
};

export const getters = {
  getAllThemes(_state) {
    return _state.themes;
  },
  getCurrentTheme(_state) {
    return _state.currentTheme;
  },
  getUIFlags(_state) {
    return _state.uiFlags;
  },
  getActiveTheme(_state) {
    return _state.themes.find(theme => theme.is_active) || {};
  },
};

export const actions = {
  async fetchThemes({ commit }) {
    commit('SET_UI_FLAG', { isFetching: true });
    try {
      const response = await LayoutCustomizationAPI.getThemes();
      commit('SET_THEMES', response.data);
      commit('SET_UI_FLAG', { isFetching: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetching: false });
      throw error;
    }
  },

  async fetchTheme({ commit }, themeId) {
    commit('SET_UI_FLAG', { isFetching: true });
    try {
      const response = await LayoutCustomizationAPI.getTheme(themeId);
      commit('SET_CURRENT_THEME', response.data);
      commit('SET_UI_FLAG', { isFetching: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetching: false });
      throw error;
    }
  },

  async createTheme({ commit }, themeData) {
    commit('SET_UI_FLAG', { isCreating: true });
    try {
      const response = await LayoutCustomizationAPI.createTheme(themeData);
      commit('ADD_THEME', response.data);
      commit('SET_UI_FLAG', { isCreating: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isCreating: false });
      throw error;
    }
  },

  async updateTheme({ commit }, { id, ...themeData }) {
    commit('SET_UI_FLAG', { isUpdating: true });
    try {
      const response = await LayoutCustomizationAPI.updateTheme(id, themeData);
      commit('UPDATE_THEME', response.data);
      commit('SET_UI_FLAG', { isUpdating: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUpdating: false });
      throw error;
    }
  },

  async deleteTheme({ commit }, themeId) {
    commit('SET_UI_FLAG', { isDeleting: true });
    try {
      await LayoutCustomizationAPI.deleteTheme(themeId);
      commit('REMOVE_THEME', themeId);
      commit('SET_UI_FLAG', { isDeleting: false });
    } catch (error) {
      commit('SET_UI_FLAG', { isDeleting: false });
      throw error;
    }
  },

  async activateTheme({ commit }, themeId) {
    commit('SET_UI_FLAG', { isActivating: true });
    try {
      const response = await LayoutCustomizationAPI.activateTheme(themeId);
      commit('SET_ACTIVE_THEME', themeId);
      commit('SET_UI_FLAG', { isActivating: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isActivating: false });
      throw error;
    }
  },

  async uploadLogo({ commit }, { themeId, file }) {
    commit('SET_UI_FLAG', { isUploading: true });
    try {
      const response = await LayoutCustomizationAPI.uploadLogo(themeId, file);
      commit('UPDATE_THEME', response.data);
      commit('SET_UI_FLAG', { isUploading: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUploading: false });
      throw error;
    }
  },

  async uploadIcons({ commit }, { themeId, files }) {
    commit('SET_UI_FLAG', { isUploading: true });
    try {
      const response = await LayoutCustomizationAPI.uploadIcons(themeId, files);
      commit('UPDATE_THEME', response.data);
      commit('SET_UI_FLAG', { isUploading: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUploading: false });
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

  SET_THEMES(_state, themes) {
    _state.themes = themes;
  },

  SET_CURRENT_THEME(_state, theme) {
    _state.currentTheme = theme;
  },

  ADD_THEME(_state, theme) {
    _state.themes.push(theme);
  },

  UPDATE_THEME(_state, updatedTheme) {
    const themeIndex = _state.themes.findIndex(theme => theme.id === updatedTheme.id);
    if (themeIndex !== -1) {
      _state.themes.splice(themeIndex, 1, updatedTheme);
    }
    if (_state.currentTheme.id === updatedTheme.id) {
      _state.currentTheme = updatedTheme;
    }
  },

  REMOVE_THEME(_state, themeId) {
    _state.themes = _state.themes.filter(theme => theme.id !== themeId);
    if (_state.currentTheme.id === themeId) {
      _state.currentTheme = {};
    }
  },

  SET_ACTIVE_THEME(_state, themeId) {
    _state.themes.forEach(theme => {
      theme.is_active = theme.id === themeId;
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
