import apiClient from '../api_client';

const AiAgentAPI = {
  getAgents() {
    return apiClient.get('/api/v1/accounts/ai_agent/agents');
  },

  getAgent(agentId) {
    return apiClient.get(`/api/v1/accounts/ai_agent/agents/${agentId}`);
  },

  createAgent(agentData) {
    return apiClient.post('/api/v1/accounts/ai_agent/agents', { agent: agentData });
  },

  updateAgent(agentId, agentData) {
    return apiClient.patch(`/api/v1/accounts/ai_agent/agents/${agentId}`, { agent: agentData });
  },

  deleteAgent(agentId) {
    return apiClient.delete(`/api/v1/accounts/ai_agent/agents/${agentId}`);
  },

  // Parâmetros
  getParameters(agentId) {
    return apiClient.get(`/api/v1/accounts/ai_agent/agents/${agentId}/parameters`);
  },

  getParameter(agentId, parameterId) {
    return apiClient.get(`/api/v1/accounts/ai_agent/agents/${agentId}/parameters/${parameterId}`);
  },

  createParameter(agentId, parameterData) {
    return apiClient.post(`/api/v1/accounts/ai_agent/agents/${agentId}/parameters`, { parameter: parameterData });
  },

  updateParameter(agentId, parameterId, parameterData) {
    return apiClient.patch(`/api/v1/accounts/ai_agent/agents/${agentId}/parameters/${parameterId}`, { parameter: parameterData });
  },

  deleteParameter(agentId, parameterId) {
    return apiClient.delete(`/api/v1/accounts/ai_agent/agents/${agentId}/parameters/${parameterId}`);
  },

  reorderParameters(agentId, parameterIds) {
    return apiClient.post(`/api/v1/accounts/ai_agent/agents/${agentId}/parameters/reorder`, { parameters: parameterIds });
  },

  // Webhooks
  getWebhooks(agentId) {
    return apiClient.get(`/api/v1/accounts/ai_agent/agents/${agentId}/webhooks`);
  },

  getWebhook(agentId, webhookId) {
    return apiClient.get(`/api/v1/accounts/ai_agent/agents/${agentId}/webhooks/${webhookId}`);
  },

  createWebhook(agentId, webhookData) {
    return apiClient.post(`/api/v1/accounts/ai_agent/agents/${agentId}/webhooks`, { webhook: webhookData });
  },

  updateWebhook(agentId, webhookId, webhookData) {
    return apiClient.patch(`/api/v1/accounts/ai_agent/agents/${agentId}/webhooks/${webhookId}`, { webhook: webhookData });
  },

  deleteWebhook(agentId, webhookId) {
    return apiClient.delete(`/api/v1/accounts/ai_agent/agents/${agentId}/webhooks/${webhookId}`);
  },

  testWebhook(agentId, webhookId) {
    return apiClient.post(`/api/v1/accounts/ai_agent/agents/${agentId}/webhooks/${webhookId}/test`);
  },
};

export default AiAgentAPI;
