import HelpChatAPI from '../../api/help-chat';

const state = {
  articles: [],
  currentArticle: {},
  conversations: [],
  currentConversation: {},
  messages: [],
  settings: {},
  uiFlags: {
    isFetchingArticles: false,
    isFetchingArticle: false,
    isCreatingArticle: false,
    isUpdatingArticle: false,
    isDeletingArticle: false,
    isFetchingConversations: false,
    isFetchingConversation: false,
    isCreatingConversation: false,
    isUpdatingConversation: false,
    isAssigningConversation: false,
    isResolvingConversation: false,
    isReopeningConversation: false,
    isFetchingMessages: false,
    isCreatingMessage: false,
    isFetchingSettings: false,
    isUpdatingSettings: false,
    isEnablingSettings: false,
    isDisablingSettings: false,
  },
};

export const getters = {
  getArticles(_state) {
    return _state.articles;
  },
  getCurrentArticle(_state) {
    return _state.currentArticle;
  },
  getConversations(_state) {
    return _state.conversations;
  },
  getCurrentConversation(_state) {
    return _state.currentConversation;
  },
  getMessages(_state) {
    return _state.messages;
  },
  getSettings(_state) {
    return _state.settings;
  },
  getUIFlags(_state) {
    return _state.uiFlags;
  },
};

export const actions = {
  // Artigos
  async fetchArticles({ commit }, { query = '', active = '' } = {}) {
    commit('SET_UI_FLAG', { isFetchingArticles: true });
    try {
      const response = await HelpChatAPI.getArticles({ query, active });
      commit('SET_ARTICLES', response.data);
      commit('SET_UI_FLAG', { isFetchingArticles: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingArticles: false });
      throw error;
    }
  },

  async fetchArticle({ commit }, articleId) {
    commit('SET_UI_FLAG', { isFetchingArticle: true });
    try {
      const response = await HelpChatAPI.getArticle(articleId);
      commit('SET_CURRENT_ARTICLE', response.data);
      commit('SET_UI_FLAG', { isFetchingArticle: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingArticle: false });
      throw error;
    }
  },

  async createArticle({ commit }, articleData) {
    commit('SET_UI_FLAG', { isCreatingArticle: true });
    try {
      const response = await HelpChatAPI.createArticle(articleData);
      commit('ADD_ARTICLE', response.data);
      commit('SET_CURRENT_ARTICLE', response.data);
      commit('SET_UI_FLAG', { isCreatingArticle: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isCreatingArticle: false });
      throw error;
    }
  },

  async updateArticle({ commit }, { id, ...articleData }) {
    commit('SET_UI_FLAG', { isUpdatingArticle: true });
    try {
      const response = await HelpChatAPI.updateArticle(id, articleData);
      commit('UPDATE_ARTICLE', response.data);
      commit('SET_UI_FLAG', { isUpdatingArticle: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUpdatingArticle: false });
      throw error;
    }
  },

  async deleteArticle({ commit }, articleId) {
    commit('SET_UI_FLAG', { isDeletingArticle: true });
    try {
      await HelpChatAPI.deleteArticle(articleId);
      commit('REMOVE_ARTICLE', articleId);
      commit('SET_UI_FLAG', { isDeletingArticle: false });
    } catch (error) {
      commit('SET_UI_FLAG', { isDeletingArticle: false });
      throw error;
    }
  },

  async searchArticles({ commit }, query) {
    commit('SET_UI_FLAG', { isFetchingArticles: true });
    try {
      const response = await HelpChatAPI.searchArticles(query);
      commit('SET_ARTICLES', response.data);
      commit('SET_UI_FLAG', { isFetchingArticles: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingArticles: false });
      throw error;
    }
  },

  // Conversas
  async fetchConversations({ commit }, { status = '', assigneeId = '' } = {}) {
    commit('SET_UI_FLAG', { isFetchingConversations: true });
    try {
      const response = await HelpChatAPI.getConversations({ status, assignee_id: assigneeId });
      commit('SET_CONVERSATIONS', response.data);
      commit('SET_UI_FLAG', { isFetchingConversations: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingConversations: false });
      throw error;
    }
  },

  async fetchConversation({ commit }, conversationId) {
    commit('SET_UI_FLAG', { isFetchingConversation: true });
    try {
      const response = await HelpChatAPI.getConversation(conversationId);
      commit('SET_CURRENT_CONVERSATION', response.data);
      commit('SET_MESSAGES', response.data.messages || []);
      commit('SET_UI_FLAG', { isFetchingConversation: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingConversation: false });
      throw error;
    }
  },

  async createConversation({ commit }, conversationData) {
    commit('SET_UI_FLAG', { isCreatingConversation: true });
    try {
      const response = await HelpChatAPI.createConversation(conversationData);
      commit('ADD_CONVERSATION', response.data);
      commit('SET_CURRENT_CONVERSATION', response.data);
      commit('SET_UI_FLAG', { isCreatingConversation: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isCreatingConversation: false });
      throw error;
    }
  },

  async updateConversation({ commit }, { id, ...conversationData }) {
    commit('SET_UI_FLAG', { isUpdatingConversation: true });
    try {
      const response = await HelpChatAPI.updateConversation(id, conversationData);
      commit('UPDATE_CONVERSATION', response.data);
      commit('SET_UI_FLAG', { isUpdatingConversation: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUpdatingConversation: false });
      throw error;
    }
  },

  async assignConversation({ commit }, { id, assigneeId }) {
    commit('SET_UI_FLAG', { isAssigningConversation: true });
    try {
      const response = await HelpChatAPI.assignConversation(id, assigneeId);
      commit('UPDATE_CONVERSATION', response.data);
      commit('SET_UI_FLAG', { isAssigningConversation: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isAssigningConversation: false });
      throw error;
    }
  },

  async resolveConversation({ commit }, id) {
    commit('SET_UI_FLAG', { isResolvingConversation: true });
    try {
      const response = await HelpChatAPI.resolveConversation(id);
      commit('UPDATE_CONVERSATION', response.data);
      commit('SET_UI_FLAG', { isResolvingConversation: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isResolvingConversation: false });
      throw error;
    }
  },

  async reopenConversation({ commit }, id) {
    commit('SET_UI_FLAG', { isReopeningConversation: true });
    try {
      const response = await HelpChatAPI.reopenConversation(id);
      commit('UPDATE_CONVERSATION', response.data);
      commit('SET_UI_FLAG', { isReopeningConversation: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isReopeningConversation: false });
      throw error;
    }
  },

  // Mensagens
  async fetchMessages({ commit }, conversationId) {
    commit('SET_UI_FLAG', { isFetchingMessages: true });
    try {
      const response = await HelpChatAPI.getMessages(conversationId);
      commit('SET_MESSAGES', response.data);
      commit('SET_UI_FLAG', { isFetchingMessages: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingMessages: false });
      throw error;
    }
  },

  async createMessage({ commit }, { conversationId, ...messageData }) {
    commit('SET_UI_FLAG', { isCreatingMessage: true });
    try {
      const response = await HelpChatAPI.createMessage(conversationId, messageData);
      commit('ADD_MESSAGE', response.data);
      commit('SET_UI_FLAG', { isCreatingMessage: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isCreatingMessage: false });
      throw error;
    }
  },

  // Configurações
  async fetchSettings({ commit }) {
    commit('SET_UI_FLAG', { isFetchingSettings: true });
    try {
      const response = await HelpChatAPI.getSettings();
      commit('SET_SETTINGS', response.data);
      commit('SET_UI_FLAG', { isFetchingSettings: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingSettings: false });
      throw error;
    }
  },

  async updateSettings({ commit }, settingsData) {
    commit('SET_UI_FLAG', { isUpdatingSettings: true });
    try {
      const response = await HelpChatAPI.updateSettings(settingsData);
      commit('SET_SETTINGS', response.data);
      commit('SET_UI_FLAG', { isUpdatingSettings: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUpdatingSettings: false });
      throw error;
    }
  },

  async enableSettings({ commit }) {
    commit('SET_UI_FLAG', { isEnablingSettings: true });
    try {
      const response = await HelpChatAPI.enableSettings();
      commit('SET_SETTINGS', response.data);
      commit('SET_UI_FLAG', { isEnablingSettings: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isEnablingSettings: false });
      throw error;
    }
  },

  async disableSettings({ commit }) {
    commit('SET_UI_FLAG', { isDisablingSettings: true });
    try {
      const response = await HelpChatAPI.disableSettings();
      commit('SET_SETTINGS', response.data);
      commit('SET_UI_FLAG', { isDisablingSettings: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isDisablingSettings: false });
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

  // Artigos
  SET_ARTICLES(_state, articles) {
    _state.articles = articles;
  },

  SET_CURRENT_ARTICLE(_state, article) {
    _state.currentArticle = article;
  },

  ADD_ARTICLE(_state, article) {
    _state.articles.unshift(article);
  },

  UPDATE_ARTICLE(_state, updatedArticle) {
    const articleIndex = _state.articles.findIndex(article => article.id === updatedArticle.id);
    if (articleIndex !== -1) {
      _state.articles.splice(articleIndex, 1, updatedArticle);
    }
    if (_state.currentArticle.id === updatedArticle.id) {
      _state.currentArticle = updatedArticle;
    }
  },

  REMOVE_ARTICLE(_state, articleId) {
    _state.articles = _state.articles.filter(article => article.id !== articleId);
    if (_state.currentArticle.id === articleId) {
      _state.currentArticle = {};
    }
  },

  // Conversas
  SET_CONVERSATIONS(_state, conversations) {
    _state.conversations = conversations;
  },

  SET_CURRENT_CONVERSATION(_state, conversation) {
    _state.currentConversation = conversation;
  },

  ADD_CONVERSATION(_state, conversation) {
    _state.conversations.unshift(conversation);
  },

  UPDATE_CONVERSATION(_state, updatedConversation) {
    const conversationIndex = _state.conversations.findIndex(conversation => conversation.id === updatedConversation.id);
    if (conversationIndex !== -1) {
      _state.conversations.splice(conversationIndex, 1, updatedConversation);
    }
    if (_state.currentConversation.id === updatedConversation.id) {
      _state.currentConversation = updatedConversation;
    }
  },

  // Mensagens
  SET_MESSAGES(_state, messages) {
    _state.messages = messages;
  },

  ADD_MESSAGE(_state, message) {
    _state.messages.push(message);
  },

  // Configurações
  SET_SETTINGS(_state, settings) {
    _state.settings = settings;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
