import accountRoutes from './dashboard/account';
import agentBotRoutes from './dashboard/agentBots';
import authRoutes from './auth';
import campaignRoutes from './dashboard/campaigns';
import cannedResponseRoutes from './dashboard/cannedResponse';
import contactRoutes from './dashboard/contacts';
import conversationRoutes from './dashboard/conversation';
import csatRoutes from './dashboard/csat';
import customViewRoutes from './dashboard/customView';
import dashboardApps from './dashboard/dashboardApps';
import helpCenterRoutes from './dashboard/helpCenter';
import inboxRoutes from './dashboard/inbox';
import integrationRoutes from './dashboard/integrations';
import notificationRoutes from './dashboard/notifications';
import profileRoutes from './dashboard/profile';
import reportRoutes from './dashboard/reports';
import searchRoutes from './dashboard/search';
import settingsRoutes from './dashboard/settings';
import teamRoutes from './dashboard/team';
import whatsappRoutes from './dashboard/whatsapp';
import kanbanRoutes from './dashboard/routes/kanban';

export default [
  ...authRoutes,
  ...dashboardApps,
  ...accountRoutes,
  ...agentBotRoutes,
  ...campaignRoutes,
  ...cannedResponseRoutes,
  ...contactRoutes,
  ...conversationRoutes,
  ...csatRoutes,
  ...customViewRoutes,
  ...helpCenterRoutes,
  ...inboxRoutes,
  ...integrationRoutes,
  ...notificationRoutes,
  ...profileRoutes,
  ...reportRoutes,
  ...searchRoutes,
  ...settingsRoutes,
  ...teamRoutes,
  ...whatsappRoutes,
  ...kanbanRoutes,
];
