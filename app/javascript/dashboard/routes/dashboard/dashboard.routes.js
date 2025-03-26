import settings from './settings/settings.routes';
import conversation from './conversation/conversation.routes';
import { routes as searchRoutes } from '../../modules/search/search.routes';
import { routes as contactRoutes } from './contacts/routes';
import { routes as notificationRoutes } from './notifications/routes';
import { routes as inboxRoutes } from './inbox/routes';
import { frontendURL } from '../../helper/URLHelper';
import helpcenterRoutes from './helpcenter/helpcenter.routes';
import campaignsRoutes from './campaigns/campaigns.routes';
import { routes as captainRoutes } from './captain/captain.routes';
import AppContainer from './Dashboard.vue';
import Suspended from './suspended/Index.vue';

// Rotas extras do Arquivo 2
import accountRoutes from './account';
import agentBotRoutes from './agentBots';
import authRoutes from './auth'; // Este já parece estar correto
import cannedResponseRoutes from './cannedResponse';
import csatRoutes from './csat';
import customViewRoutes from './customView';
import dashboardApps from './dashboardApps';
import integrationRoutes from './integrations';
import profileRoutes from './profile';
import reportRoutes from './reports';
import teamRoutes from './team';
import whatsappRoutes from './whatsapp';
import kanbanRoutes from './kanban';
import helpChatRoutes from '../help-chat';

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId'),
      component: AppContainer,
      children: [
        ...captainRoutes,
        ...inboxRoutes,
        ...conversation.routes,
        ...settings.routes,
        ...contactRoutes,
        ...searchRoutes,
        ...notificationRoutes,
        ...helpcenterRoutes.routes,
        ...campaignsRoutes.routes,
        ...accountRoutes,
        ...agentBotRoutes,
        ...cannedResponseRoutes,
        ...csatRoutes,
        ...customViewRoutes,
        ...dashboardApps,
        ...integrationRoutes,
        ...profileRoutes,
        ...reportRoutes,
        ...teamRoutes,
        ...whatsappRoutes,
        ...kanbanRoutes,
        ...helpChatRoutes.routes,
      ],
    },
    {
      path: frontendURL('accounts/:accountId/suspended'),
      name: 'account_suspended',
      meta: {
        permissions: ['administrator', 'agent', 'custom_role'],
      },
      component: Suspended,
    },
    ...authRoutes, // Rotas de autenticação fora do AppContainer
  ],
};