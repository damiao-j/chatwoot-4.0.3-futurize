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

// Importações corrigidas
import agentBotRoutes from './ai-agent/routes'; 
import authRoutes from './auth/routes'; 
import cannedResponseRoutes from './cannedResponse/routes'; 
import csatRoutes from './csat/routes'; 
import customViewRoutes from './customviews/routes'; 
import dashboardApps from './dashboardApps/routes'; 
import integrationRoutes from './integrations/routes'; 
import profileRoutes from './profile/routes'; 
import reportRoutes from './reports/routes'; 
import teamRoutes from './team/routes'; 
import whatsappRoutes from './whatsapp/routes'; 
import kanbanRoutes from './kanban/routes'; 
import helpChatRoutes from './help-chat/routes'; 


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
