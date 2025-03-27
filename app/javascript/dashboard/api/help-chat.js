import apiClient from './ApiClient.js';

const HelpChatAPI = {
  // Artigos
  getArticles(params = {}) {
    return apiClient.get('/api/v1/accounts/help_chat/articles', { params });
  },

  getArticle(articleId) {
    return apiClient.get(`/api/v1/accounts/help_chat/articles/${articleId}`);
  },

  createArticle(articleData) {
    return apiClient.post('/api/v1/accounts/help_chat/articles', { article: articleData });
  },

  updateArticle(articleId, articleData) {
    return apiClient.patch(`/api/v1/accounts/help_chat/articles/${articleId}`, { article: articleData });
  },

  deleteArticle(articleId) {
    return apiClient.delete(`/api/v1/accounts/help_chat/articles/${articleId}`);
  },

  searchArticles(query) {
    return apiClient.get('/api/v1/accounts/help_chat/articles/search', { params: { query } });
  },

  // Conversas
  getConversations(params = {}) {
    return apiClient.get('/api/v1/accounts/help_chat/conversations', { params });
  },

  getConversation(conversationId) {
    return apiClient.get(`/api/v1/accounts/help_chat/conversations/${conversationId}`);
  },

  createConversation(conversationData) {
    return apiClient.post('/api/v1/accounts/help_chat/conversations', { conversation: conversationData });
  },

  updateConversation(conversationId, conversationData) {
    return apiClient.patch(`/api/v1/accounts/help_chat/conversations/${conversationId}`, { conversation: conversationData });
  },

  assignConversation(conversationId, assigneeId) {
    return apiClient.post(`/api/v1/accounts/help_chat/conversations/${conversationId}/assign`, { assignee_id: assigneeId });
  },

  resolveConversation(conversationId) {
    return apiClient.post(`/api/v1/accounts/help_chat/conversations/${conversationId}/resolve`);
  },

  reopenConversation(conversationId) {
    return apiClient.post(`/api/v1/accounts/help_chat/conversations/${conversationId}/reopen`);
  },

  // Mensagens
  getMessages(conversationId) {
    return apiClient.get(`/api/v1/accounts/help_chat/conversations/${conversationId}/messages`);
  },

  getMessage(conversationId, messageId) {
    return apiClient.get(`/api/v1/accounts/help_chat/conversations/${conversationId}/messages/${messageId}`);
  },

  createMessage(conversationId, messageData) {
    return apiClient.post(`/api/v1/accounts/help_chat/conversations/${conversationId}/messages`, { message: messageData });
  },

  // Configurações
  getSettings() {
    return apiClient.get('/api/v1/accounts/help_chat/settings');
  },

  updateSettings(settingsData) {
    return apiClient.patch('/api/v1/accounts/help_chat/settings', { settings: settingsData });
  },

  enableSettings() {
    return apiClient.post('/api/v1/accounts/help_chat/settings/enable');
  },

  disableSettings() {
    return apiClient.post('/api/v1/accounts/help_chat/settings/disable');
  },
};

export default HelpChatAPI;
