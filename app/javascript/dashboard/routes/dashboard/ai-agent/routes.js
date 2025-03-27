import AgentList from './pages/AgentList.vue';
import AgentCreate from './pages/AgentCreate.vue';
import AgentEdit from './pages/AgentEdit.vue';
import AgentSettings from './pages/AgentSettings.vue';
import { frontendURL } from '../../../helper/URLHelper';

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/ai-agents'),
      name: 'ai_agents',
      roles: ['administrator', 'agent'],
      component: AgentList,
    },
    {
      path: frontendURL('accounts/:accountId/ai-agents/new'),
      name: 'ai_agent_create',
      roles: ['administrator'],
      component: AgentCreate,
    },
    {
      path: frontendURL('accounts/:accountId/ai-agents/:agentId/edit'),
      name: 'ai_agent_edit',
      roles: ['administrator'],
      component: AgentEdit,
    },
    {
      path: frontendURL('accounts/:accountId/ai-agents/:agentId/settings'),
      name: 'ai_agent_settings',
      roles: ['administrator'],
      component: AgentSettings,
    },
  ],
};
