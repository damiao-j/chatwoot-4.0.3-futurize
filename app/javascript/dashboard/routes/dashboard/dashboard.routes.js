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
import accountRoutes from './dashboard/account';
import agentBotRoutes from './dashboard/agentBots';
import authRoutes from './auth';
import cannedResponseRoutes from './dashboard/cannedResponse';
import csatRoutes from './dashboard/csat';
import customViewRoutes from './dashboard/customView';
import dashboardApps from './dashboard/dashboardApps';
import integrationRoutes from './dashboard/integrations';
import profileRoutes from './dashboard/profile';
import reportRoutes from './dashboard/reports';
import teamRoutes from './dashboard/team';
import whatsappRoutes from './dashboard/whatsapp';
import kanbanRoutes from './dashboard/kanban';

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