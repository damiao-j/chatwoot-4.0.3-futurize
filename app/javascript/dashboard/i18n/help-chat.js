import { addLocaleMessages } from '../i18n';

// Adicionar mensagens de tradução para o Chat Nativo de Ajuda
const messages = {
  pt_BR: {
    HELP_CHAT: {
      ARTICLES: {
        HEADER: 'Base de Conhecimento',
        ADD: {
          BUTTON: 'Adicionar Artigo',
          TITLE: 'Adicionar Novo Artigo',
          SUCCESS: 'Artigo adicionado com sucesso'
        },
        EDIT: {
          TITLE: 'Editar Artigo',
          SUCCESS: 'Artigo atualizado com sucesso'
        },
        DELETE: {
          CONFIRM: {
            TITLE: 'Confirmar Exclusão',
            MESSAGE: 'Tem certeza que deseja excluir o artigo "{articleTitle}"?',
            YES: 'Sim, excluir',
            NO: 'Cancelar'
          },
          SUCCESS: 'Artigo excluído com sucesso',
          ERROR: 'Erro ao excluir artigo'
        },
        SEARCH: {
          PLACEHOLDER: 'Buscar artigos...'
        },
        FORM: {
          TITLE: {
            LABEL: 'Título',
            PLACEHOLDER: 'Digite o título do artigo',
            ERROR: 'Título é obrigatório'
          },
          CONTENT: {
            LABEL: 'Conteúdo',
            PLACEHOLDER: 'Digite o conteúdo do artigo...',
            ERROR: 'Conteúdo é obrigatório'
          },
          TAGS: {
            LABEL: 'Tags',
            PLACEHOLDER: 'Adicionar tag (pressione Enter)'
          },
          STATUS: {
            LABEL: 'Status',
            ACTIVE: 'Ativo'
          }
        },
        COLUMNS: {
          TITLE: 'Título',
          STATUS: 'Status',
          VIEWS: 'Visualizações',
          HELPFUL: 'Útil',
          CREATED_AT: 'Criado em',
          ACTIONS: 'Ações'
        },
        VIEWS: 'Visualizações',
        HELPFUL: 'Útil',
        NOT_HELPFUL: 'Não útil',
        TAGS: 'Tags',
        LOADING: 'Carregando artigos...',
        NO_ITEMS: 'Nenhum artigo encontrado',
        NO_SEARCH_RESULTS: 'Nenhum resultado encontrado para sua busca',
        FETCH_ERROR: 'Erro ao carregar artigos',
        VIEW_ERROR: 'Erro ao carregar artigo',
        ADD_ERROR: 'Erro ao adicionar artigo',
        EDIT_ERROR: 'Erro ao atualizar artigo'
      },
      CONVERSATIONS: {
        HEADER: 'Conversas de Ajuda',
        CONVERSATION: 'Conversa',
        USER: 'Usuário',
        ASSIGNEE: 'Atribuído para',
        STATUS: 'Status',
        UNASSIGNED: 'Não atribuído',
        ANONYMOUS_USER: 'Usuário anônimo',
        FILTER: {
          STATUS: 'Status',
          ASSIGNEE: 'Atribuído para',
          ALL: 'Todos',
          ACTIVE: 'Ativos',
          OPEN: 'Abertos',
          PENDING: 'Pendentes',
          RESOLVED: 'Resolvidos',
          ANY_AGENT: 'Qualquer agente',
          UNASSIGNED: 'Não atribuídos'
        },
        STATUS: {
          OPEN: 'Aberto',
          PENDING: 'Pendente',
          RESOLVED: 'Resolvido'
        },
        COLUMNS: {
          ID: 'ID',
          USER: 'Usuário',
          ASSIGNEE: 'Atribuído para',
          STATUS: 'Status',
          LAST_MESSAGE: 'Última mensagem',
          CREATED_AT: 'Criado em',
          ACTIONS: 'Ações'
        },
        ACTIONS: {
          ASSIGN: 'Atribuir',
          RESOLVE: 'Resolver',
          REOPEN: 'Reabrir'
        },
        ASSIGN: {
          TITLE: 'Atribuir Conversa',
          SELECT_AGENT: 'Selecione um agente',
          UNASSIGN: 'Remover atribuição',
          SUCCESS: 'Conversa atribuída com sucesso',
          ERROR: 'Erro ao atribuir conversa'
        },
        RESOLVE: {
          SUCCESS: 'Conversa resolvida com sucesso',
          ERROR: 'Erro ao resolver conversa'
        },
        REOPEN: {
          SUCCESS: 'Conversa reaberta com sucesso',
          ERROR: 'Erro ao reabrir conversa'
        },
        NO_MESSAGES: 'Sem mensagens',
        LOADING: 'Carregando conversas...',
        NO_ITEMS: 'Nenhuma conversa encontrada',
        FETCH_ERROR: 'Erro ao carregar conversas',
        VIEW_ERROR: 'Erro ao carregar conversa'
      },
      MESSAGES: {
        LOADING: 'Carregando mensagens...',
        NO_ITEMS: 'Nenhuma mensagem encontrada',
        REPLY_PLACEHOLDER: 'Digite sua resposta...',
        SEND: 'Enviar',
        SYSTEM: 'Sistema',
        SUGGESTED_ARTICLES: 'Artigos sugeridos',
        SEND_ERROR: 'Erro ao enviar mensagem'
      },
      SETTINGS: {
        HEADER: 'Configurações do Chat de Ajuda',
        LOADING: 'Carregando configurações...',
        GENERAL: {
          TITLE: 'Configurações Gerais',
          DESCRIPTION: 'Ative ou desative o Chat de Ajuda e configure suas preferências.'
        },
        UI: {
          TITLE: 'Aparência',
          CHAT_TITLE: {
            LABEL: 'Título do Chat',
            PLACEHOLDER: 'Ex: Ajuda',
            HELP_TEXT: 'Este título será exibido no cabeçalho da janela de chat.'
          },
          BUTTON_COLOR: {
            LABEL: 'Cor do Botão',
            HELP_TEXT: 'Escolha a cor do botão de chat.'
          },
          BUTTON_POSITION: {
            LABEL: 'Posição do Botão',
            HELP_TEXT: 'Escolha onde o botão de chat será exibido na tela.',
            BOTTOM_RIGHT: 'Inferior Direito',
            BOTTOM_LEFT: 'Inferior Esquerdo',
            TOP_RIGHT: 'Superior Direito',
            TOP_LEFT: 'Superior Esquerdo'
          },
          WELCOME_MESSAGE: {
            LABEL: 'Mensagem de Boas-vindas',
            PLACEHOLDER: 'Ex: Olá! Como podemos ajudar você hoje?',
            HELP_TEXT: 'Esta mensagem será exibida quando o usuário abrir o chat pela primeira vez.'
          }
        },
        KNOWLEDGE_BASE: {
          TITLE: 'Base de Conhecimento',
          SUGGEST_ARTICLES: {
            LABEL: 'Sugerir artigos automaticamente',
            HELP_TEXT: 'Quando ativado, o sistema sugerirá artigos relevantes com base nas mensagens do usuário.'
          }
        },
        AI: {
          TITLE: 'Integração com IA',
          MODEL: {
            LABEL: 'Modelo de IA',
            PLACEHOLDER: 'Ex: gpt-3.5-turbo',
            HELP_TEXT: 'Especifique o modelo de IA a ser usado para respostas automáticas.'
          },
          WEBHOOK_URL: {
            LABEL: 'URL do Webhook',
            PLACEHOLDER: 'https://api.exemplo.com/ai-chat',
            HELP_TEXT: 'URL para enviar solicitações de IA (opcional).'
          },
          PROMPT: {
            LABEL: 'Prompt da IA',
            PLACEHOLDER: 'Você é um assistente de suporte amigável...',
            HELP_TEXT: 'Instruções iniciais para o modelo de IA.'
          }
        },
        SAVE_SUCCESS: 'Configurações salvas com sucesso',
        SAVE_ERROR: 'Erro ao salvar configurações',
        FETCH_ERROR: 'Erro ao carregar configurações',
        ENABLE_SUCCESS: 'Chat de Ajuda ativado com sucesso',
        ENABLE_ERROR: 'Erro ao ativar Chat de Ajuda',
        DISABLE_SUCCESS: 'Chat de Ajuda desativado com sucesso',
        DISABLE_ERROR: 'Erro ao desativar Chat de Ajuda'
      }
    }
  },
  en: {
    HELP_CHAT: {
      ARTICLES: {
        HEADER: 'Knowledge Base',
        ADD: {
          BUTTON: 'Add Article',
          TITLE: 'Add New Article',
          SUCCESS: 'Article added successfully'
        },
        EDIT: {
          TITLE: 'Edit Article',
          SUCCESS: 'Article updated successfully'
        },
        DELETE: {
          CONFIRM: {
            TITLE: 'Confirm Deletion',
            MESSAGE: 'Are you sure you want to delete the article "{articleTitle}"?',
            YES: 'Yes, delete',
            NO: 'Cancel'
          },
          SUCCESS: 'Article deleted successfully',
          ERROR: 'Error deleting article'
        },
        SEARCH: {
          PLACEHOLDER: 'Search articles...'
        },
        FORM: {
          TITLE: {
            LABEL: 'Title',
            PLACEHOLDER: 'Enter article title',
            ERROR: 'Title is required'
          },
          CONTENT: {
            LABEL: 'Content',
            PLACEHOLDER: 'Enter article content...',
            ERROR: 'Content is required'
          },
          TAGS: {
            LABEL: 'Tags',
            PLACEHOLDER: 'Add tag (press Enter)'
          },
          STATUS: {
            LABEL: 'Status',
            ACTIVE: 'Active'
          }
        },
        COLUMNS: {
          TITLE: 'Title',
          STATUS: 'Status',
          VIEWS: 'Views',
          HELPFUL: 'Helpful',
          CREATED_AT: 'Created at',
          ACTIONS: 'Actions'
        },
        VIEWS: 'Views',
        HELPFUL: 'Helpful',
        NOT_HELPFUL: 'Not helpful',
        TAGS: 'Tags',
        LOADING: 'Loading articles...',
        NO_ITEMS: 'No articles found',
        NO_SEARCH_RESULTS: 'No results found for your search',
        FETCH_ERROR: 'Error loading articles',
        VIEW_ERROR: 'Error loading article',
        ADD_ERROR: 'Error adding article',
        EDIT_ERROR: 'Error updating article'
      },
      CONVERSATIONS: {
        HEADER: 'Help Conversations',
        CONVERSATION: 'Conversation',
        USER: 'User',
        ASSIGNEE: 'Assigned to',
        STATUS: 'Status',
        UNASSIGNED: 'Unassigned',
        ANONYMOUS_USER: 'Anonymous user',
        FILTER: {
          STATUS: 'Status',
          ASSIGNEE: 'Assigned to',
          ALL: 'All',
          ACTIVE: 'Active',
          OPEN: 'Open',
          PENDING: 'Pending',
          RESOLVED: 'Resolved',
          ANY_AGENT: 'Any agent',
          UNASSIGNED: 'Unassigned'
        },
        STATUS: {
          OPEN: 'Open',
          PENDING: 'Pending',
          RESOLVED: 'Resolved'
        },
        COLUMNS: {
          ID: 'ID',
          USER: 'User',
          ASSIGNEE: 'Assigned to',
          STATUS: 'Status',
          LAST_MESSAGE: 'Last message',
          CREATED_AT: 'Created at',
          ACTIONS: 'Actions'
        },
        ACTIONS: {
          ASSIGN: 'Assign',
          RESOLVE: 'Resolve',
          REOPEN: 'Reopen'
        },
        ASSIGN: {
          TITLE: 'Assign Conversation',
          SELECT_AGENT: 'Select an agent',
          UNASSIGN: 'Unassign',
          SUCCESS: 'Conversation assigned successfully',
          ERROR: 'Error assigning conversation'
        },
        RESOLVE: {
          SUCCESS: 'Conversation resolved successfully',
          ERROR: 'Error resolving conversation'
        },
        REOPEN: {
          SUCCESS: 'Conversation reopened successfully',
          ERROR: 'Error reopening conversation'
        },
        NO_MESSAGES: 'No messages',
        LOADING: 'Loading conversations...',
        NO_ITEMS: 'No conversations found',
        FETCH_ERROR: 'Error loading conversations',
        VIEW_ERROR: 'Error loading conversation'
      },
      MESSAGES: {
        LOADING: 'Loading messages...',
        NO_ITEMS: 'No messages found',
        REPLY_PLACEHOLDER: 'Type your reply...',
        SEND: 'Send',
        SYSTEM: 'System',
        SUGGESTED_ARTICLES: 'Suggested articles',
        SEND_ERROR: 'Error sending message'
      },
      SETTINGS: {
        HEADER: 'Help Chat Settings',
        LOADING: 'Loading settings...',
        GENERAL: {
          TITLE: 'General Settings',
          DESCRIPTION: 'Enable or disable Help Chat and configure your preferences.'
        },
        UI: {
          TITLE: 'Appearance',
          CHAT_TITLE: {
            LABEL: 'Chat Title',
            PLACEHOLDER: 'E.g., Help',
            HELP_TEXT: 'This title will be displayed in the chat window header.'
          },
          BUTTON_COLOR: {
            LABEL: 'Button Color',
            HELP_TEXT: 'Choose the color of the chat button.'
          },
          BUTTON_POSITION: {
            LABEL: 'Button Position',
            HELP_TEXT: 'Choose where the chat button will be displayed on the screen.',
            BOTTOM_RIGHT: 'Bottom Right',
            BOTTOM_LEFT: 'Bottom Left',
            TOP_RIGHT: 'Top Right',
            TOP_LEFT: 'Top Left'
          },
          WELCOME_MESSAGE: {
            LABEL: 'Welcome Message',
            PLACEHOLDER: 'E.g., Hello! How can we help you today?',
            HELP_TEXT: 'This message will be displayed when the user opens the chat for the first time.'
          }
        },
        KNOWLEDGE_BASE: {
          TITLE: 'Knowledge Base',
          SUGGEST_ARTICLES: {
            LABEL: 'Automatically suggest articles',
            HELP_TEXT: 'When enabled, the system will suggest relevant articles based on user messages.'
          }
        },
        AI: {
          TITLE: 'AI Integration',
          MODEL: {
            LABEL: 'AI Model',
            PLACEHOLDER: 'E.g., gpt-3.5-turbo',
            HELP_TEXT: 'Specify the AI model to be used for automatic responses.'
          },
          WEBHOOK_URL: {
            LABEL: 'Webhook URL',
            PLACEHOLDER: 'https://api.example.com/ai-chat',
            HELP_TEXT: 'URL to send AI requests (optional).'
          },
          PROMPT: {
            LABEL: 'AI Prompt',
            PLACEHOLDER: 'You are a friendly support assistant...',
            HELP_TEXT: 'Initial instructions for the AI model.'
          }
        },
        SAVE_SUCCESS: 'Settings saved successfully',
        SAVE_ERROR: 'Error saving settings',
        FETCH_ERROR: 'Error loading settings',
        ENABLE_SUCCESS: 'Help Chat enabled successfully',
        ENABLE_ERROR: 'Error enabling Help Chat',
        DISABLE_SUCCESS: 'Help Chat disabled successfully',
        DISABLE_ERROR: 'Error disabling Help Chat'
      }
    }
  }
};

// Adicionar as mensagens ao i18n
addLocaleMessages(messages);
