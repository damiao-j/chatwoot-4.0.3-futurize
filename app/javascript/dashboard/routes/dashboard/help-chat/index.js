import HelpChatArticles from './pages/HelpChatArticles';
import HelpChatConversations from './pages/HelpChatConversations';
import HelpChatSettings from './pages/HelpChatSettings';
import { frontendURL } from '../../helper/URLHelper';

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/help-chat/articles'),
      name: 'help_chat_articles',
      roles: ['administrator', 'agent'],
      component: HelpChatArticles,
    },
    {
      path: frontendURL('accounts/:accountId/help-chat/conversations'),
      name: 'help_chat_conversations',
      roles: ['administrator', 'agent'],
      component: HelpChatConversations,
    },
    {
      path: frontendURL('accounts/:accountId/help-chat/settings'),
      name: 'help_chat_settings',
      roles: ['administrator'],
      component: HelpChatSettings,
    },
  ],
};
