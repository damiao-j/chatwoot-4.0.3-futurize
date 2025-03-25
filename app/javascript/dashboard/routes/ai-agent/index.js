import AiAgentList from './pages/AiAgentList';
import AiAgentDetails from './pages/AiAgentDetails';
import AiAgentCreate from './pages/AiAgentCreate';

export default [
  {
    path: 'ai-agents',
    name: 'ai_agents',
    roles: ['administrator'],
    component: AiAgentList,
  },
  {
    path: 'ai-agents/new',
    name: 'ai_agent_create',
    roles: ['administrator'],
    component: AiAgentCreate,
  },
  {
    path: 'ai-agents/:agentId',
    name: 'ai_agent_details',
    roles: ['administrator'],
    component: AiAgentDetails,
  },
];
