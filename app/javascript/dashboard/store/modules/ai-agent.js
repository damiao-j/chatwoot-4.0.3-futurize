import AiAgentAPI from '../../api/ai-agent';

const state = {
  agents: [],
  currentAgent: {},
  parameters: [],
  webhooks: [],
  uiFlags: {
    isFetchingAgents: false,
    isFetchingAgent: false,
    isCreatingAgent: false,
    isUpdatingAgent: false,
    isDeletingAgent: false,
    isFetchingParameters: false,
    isCreatingParameter: false,
    isUpdatingParameter: false,
    isDeletingParameter: false,
    isReorderingParameters: false,
    isFetchingWebhooks: false,
    isCreatingWebhook: false,
    isUpdatingWebhook: false,
    isDeletingWebhook: false,
    isTestingWebhook: false,
  },
};

export const getters = {
  getAgents(_state) {
    return _state.agents;
  },
  getCurrentAgent(_state) {
    return _state.currentAgent;
  },
  getParameters(_state) {
    return _state.parameters;
  },
  getWebhooks(_state) {
    return _state.webhooks;
  },
  getUIFlags(_state) {
    return _state.uiFlags;
  },
};

export const actions = {
  // Agentes
  async fetchAgents({ commit }) {
    commit('SET_UI_FLAG', { isFetchingAgents: true });
    try {
      const response = await AiAgentAPI.getAgents();
      commit('SET_AGENTS', response.data);
      commit('SET_UI_FLAG', { isFetchingAgents: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingAgents: false });
      throw error;
    }
  },

  async fetchAgent({ commit }, agentId) {
    commit('SET_UI_FLAG', { isFetchingAgent: true });
    try {
      const response = await AiAgentAPI.getAgent(agentId);
      commit('SET_CURRENT_AGENT', response.data);
      commit('SET_PARAMETERS', response.data.parameters || []);
      commit('SET_WEBHOOKS', response.data.webhooks || []);
      commit('SET_UI_FLAG', { isFetchingAgent: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingAgent: false });
      throw error;
    }
  },

  async createAgent({ commit }, agentData) {
    commit('SET_UI_FLAG', { isCreatingAgent: true });
    try {
      const response = await AiAgentAPI.createAgent(agentData);
      commit('ADD_AGENT', response.data);
      commit('SET_CURRENT_AGENT', response.data);
      commit('SET_UI_FLAG', { isCreatingAgent: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isCreatingAgent: false });
      throw error;
    }
  },

  async updateAgent({ commit }, { id, ...agentData }) {
    commit('SET_UI_FLAG', { isUpdatingAgent: true });
    try {
      const response = await AiAgentAPI.updateAgent(id, agentData);
      commit('UPDATE_AGENT', response.data);
      commit('SET_UI_FLAG', { isUpdatingAgent: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUpdatingAgent: false });
      throw error;
    }
  },

  async deleteAgent({ commit }, agentId) {
    commit('SET_UI_FLAG', { isDeletingAgent: true });
    try {
      await AiAgentAPI.deleteAgent(agentId);
      commit('REMOVE_AGENT', agentId);
      commit('SET_UI_FLAG', { isDeletingAgent: false });
    } catch (error) {
      commit('SET_UI_FLAG', { isDeletingAgent: false });
      throw error;
    }
  },

  // Parâmetros
  async fetchParameters({ commit }, agentId) {
    commit('SET_UI_FLAG', { isFetchingParameters: true });
    try {
      const response = await AiAgentAPI.getParameters(agentId);
      commit('SET_PARAMETERS', response.data);
      commit('SET_UI_FLAG', { isFetchingParameters: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingParameters: false });
      throw error;
    }
  },

  async createParameter({ commit }, { agentId, ...parameterData }) {
    commit('SET_UI_FLAG', { isCreatingParameter: true });
    try {
      const response = await AiAgentAPI.createParameter(agentId, parameterData);
      commit('ADD_PARAMETER', response.data);
      commit('SET_UI_FLAG', { isCreatingParameter: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isCreatingParameter: false });
      throw error;
    }
  },

  async updateParameter({ commit }, { agentId, id, ...parameterData }) {
    commit('SET_UI_FLAG', { isUpdatingParameter: true });
    try {
      const response = await AiAgentAPI.updateParameter(agentId, id, parameterData);
      commit('UPDATE_PARAMETER', response.data);
      commit('SET_UI_FLAG', { isUpdatingParameter: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUpdatingParameter: false });
      throw error;
    }
  },

  async deleteParameter({ commit }, { agentId, id }) {
    commit('SET_UI_FLAG', { isDeletingParameter: true });
    try {
      await AiAgentAPI.deleteParameter(agentId, id);
      commit('REMOVE_PARAMETER', id);
      commit('SET_UI_FLAG', { isDeletingParameter: false });
    } catch (error) {
      commit('SET_UI_FLAG', { isDeletingParameter: false });
      throw error;
    }
  },

  async reorderParameters({ commit }, { agentId, parameterIds }) {
    commit('SET_UI_FLAG', { isReorderingParameters: true });
    try {
      await AiAgentAPI.reorderParameters(agentId, parameterIds);
      commit('REORDER_PARAMETERS', parameterIds);
      commit('SET_UI_FLAG', { isReorderingParameters: false });
    } catch (error) {
      commit('SET_UI_FLAG', { isReorderingParameters: false });
      throw error;
    }
  },

  // Webhooks
  async fetchWebhooks({ commit }, agentId) {
    commit('SET_UI_FLAG', { isFetchingWebhooks: true });
    try {
      const response = await AiAgentAPI.getWebhooks(agentId);
      commit('SET_WEBHOOKS', response.data);
      commit('SET_UI_FLAG', { isFetchingWebhooks: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isFetchingWebhooks: false });
      throw error;
    }
  },

  async createWebhook({ commit }, { agentId, ...webhookData }) {
    commit('SET_UI_FLAG', { isCreatingWebhook: true });
    try {
      const response = await AiAgentAPI.createWebhook(agentId, webhookData);
      commit('ADD_WEBHOOK', response.data);
      commit('SET_UI_FLAG', { isCreatingWebhook: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isCreatingWebhook: false });
      throw error;
    }
  },

  async updateWebhook({ commit }, { agentId, id, ...webhookData }) {
    commit('SET_UI_FLAG', { isUpdatingWebhook: true });
    try {
      const response = await AiAgentAPI.updateWebhook(agentId, id, webhookData);
      commit('UPDATE_WEBHOOK', response.data);
      commit('SET_UI_FLAG', { isUpdatingWebhook: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isUpdatingWebhook: false });
      throw error;
    }
  },

  async deleteWebhook({ commit }, { agentId, id }) {
    commit('SET_UI_FLAG', { isDeletingWebhook: true });
    try {
      await AiAgentAPI.deleteWebhook(agentId, id);
      commit('REMOVE_WEBHOOK', id);
      commit('SET_UI_FLAG', { isDeletingWebhook: false });
    } catch (error) {
      commit('SET_UI_FLAG', { isDeletingWebhook: false });
      throw error;
    }
  },

  async testWebhook({ commit }, { agentId, id }) {
    commit('SET_UI_FLAG', { isTestingWebhook: true });
    try {
      const response = await AiAgentAPI.testWebhook(agentId, id);
      commit('SET_UI_FLAG', { isTestingWebhook: false });
      return response.data;
    } catch (error) {
      commit('SET_UI_FLAG', { isTestingWebhook: false });
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

  // Agentes
  SET_AGENTS(_state, agents) {
    _state.agents = agents;
  },

  SET_CURRENT_AGENT(_state, agent) {
    _state.currentAgent = agent;
  },

  ADD_AGENT(_state, agent) {
    _state.agents.unshift(agent);
  },

  UPDATE_AGENT(_state, updatedAgent) {
    const agentIndex = _state.agents.findIndex(agent => agent.id === updatedAgent.id);
    if (agentIndex !== -1) {
      _state.agents.splice(agentIndex, 1, updatedAgent);
    }
    if (_state.currentAgent.id === updatedAgent.id) {
      _state.currentAgent = updatedAgent;
    }
  },

  REMOVE_AGENT(_state, agentId) {
    _state.agents = _state.agents.filter(agent => agent.id !== agentId);
    if (_state.currentAgent.id === agentId) {
      _state.currentAgent = {};
    }
  },

  // Parâmetros
  SET_PARAMETERS(_state, parameters) {
    _state.parameters = parameters;
  },

  ADD_PARAMETER(_state, parameter) {
    _state.parameters.push(parameter);
  },

  UPDATE_PARAMETER(_state, updatedParameter) {
    const parameterIndex = _state.parameters.findIndex(parameter => parameter.id === updatedParameter.id);
    if (parameterIndex !== -1) {
      _state.parameters.splice(parameterIndex, 1, updatedParameter);
    }
  },

  REMOVE_PARAMETER(_state, parameterId) {
    _state.parameters = _state.parameters.filter(parameter => parameter.id !== parameterId);
  },

  REORDER_PARAMETERS(_state, parameterIds) {
    const reorderedParameters = [];
    parameterIds.forEach((parameterId, index) => {
      const parameter = _state.parameters.find(p => p.id === parameterId);
      if (parameter) {
        reorderedParameters.push({ ...parameter, display_order: index + 1 });
      }
    });
    _state.parameters = reorderedParameters;
  },

  // Webhooks
  SET_WEBHOOKS(_state, webhooks) {
    _state.webhooks = webhooks;
  },

  ADD_WEBHOOK(_state, webhook) {
    _state.webhooks.push(webhook);
  },

  UPDATE_WEBHOOK(_state, updatedWebhook) {
    const webhookIndex = _state.webhooks.findIndex(webhook => webhook.id === updatedWebhook.id);
    if (webhookIndex !== -1) {
      _state.webhooks.splice(webhookIndex, 1, updatedWebhook);
    }
  },

  REMOVE_WEBHOOK(_state, webhookId) {
    _state.webhooks = _state.webhooks.filter(webhook => webhook.id !== webhookId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
