export default {
  KANBAN: {
    BOARDS: {
      HEADER: 'Quadros Kanban',
      ADD: 'Adicionar Quadro',
      EMPTY: {
        TITLE: 'Nenhum quadro encontrado',
        DESCRIPTION: 'Crie seu primeiro quadro Kanban para gerenciar seus negócios'
      },
      COLUMNS: '{count} colunas',
      CARDS: '{count} cartões',
      FORM: {
        NAME: {
          LABEL: 'Nome do Quadro',
          PLACEHOLDER: 'Ex: Pipeline de Vendas'
        },
        DESCRIPTION: {
          LABEL: 'Descrição',
          PLACEHOLDER: 'Descreva o propósito deste quadro'
        },
        DEFAULT_COLUMNS: {
          LABEL: 'Criar colunas padrão',
          HELP: 'Cria automaticamente colunas para um pipeline de vendas básico'
        }
      },
      ADD: {
        TITLE: 'Adicionar Novo Quadro'
      },
      EDIT: {
        TITLE: 'Editar Quadro'
      },
      DELETE: {
        TITLE: 'Excluir Quadro',
        MESSAGE: 'Tem certeza que deseja excluir o quadro "{boardName}"? Esta ação não pode ser desfeita.'
      },
      CREATE_SUCCESS: 'Quadro criado com sucesso',
      UPDATE_SUCCESS: 'Quadro atualizado com sucesso',
      DELETE_SUCCESS: 'Quadro excluído com sucesso',
      FETCH_ERROR: 'Erro ao carregar quadros',
      CREATE_ERROR: 'Erro ao criar quadro',
      UPDATE_ERROR: 'Erro ao atualizar quadro',
      DELETE_ERROR: 'Erro ao excluir quadro'
    },
    BOARD: {
      FILTER: 'Filtrar',
      ADD_CARD: 'Adicionar Cartão',
      ADD_COLUMN: 'Adicionar Coluna',
      ADD_CARD_TO_COLUMN: 'Adicionar Cartão',
      GO_BACK: 'Voltar para Quadros',
      NOT_FOUND: {
        TITLE: 'Quadro não encontrado',
        DESCRIPTION: 'O quadro solicitado não existe ou foi removido'
      },
      FETCH_ERROR: 'Erro ao carregar quadro'
    },
    COLUMN: {
      FORM: {
        NAME: {
          LABEL: 'Nome da Coluna',
          PLACEHOLDER: 'Ex: Em Negociação'
        },
        DESCRIPTION: {
          LABEL: 'Descrição',
          PLACEHOLDER: 'Descreva o propósito desta coluna'
        },
        COLOR: {
          LABEL: 'Cor'
        }
      },
      ADD: {
        TITLE: 'Adicionar Nova Coluna'
      },
      EDIT: {
        TITLE: 'Editar Coluna'
      },
      DELETE: {
        TITLE: 'Excluir Coluna',
        MESSAGE: 'Tem certeza que deseja excluir a coluna "{columnName}"? Esta ação não pode ser desfeita.'
      },
      CREATE_SUCCESS: 'Coluna criada com sucesso',
      UPDATE_SUCCESS: 'Coluna atualizada com sucesso',
      DELETE_SUCCESS: 'Coluna excluída com sucesso',
      CREATE_ERROR: 'Erro ao criar coluna',
      UPDATE_ERROR: 'Erro ao atualizar coluna',
      DELETE_ERROR: 'Erro ao excluir coluna'
    },
    CARD: {
      CONVERSATION: 'Conversa #{id}',
      FORM: {
        TITLE: {
          LABEL: 'Título',
          PLACEHOLDER: 'Ex: Proposta para Cliente XYZ'
        },
        DESCRIPTION: {
          LABEL: 'Descrição',
          PLACEHOLDER: 'Descreva os detalhes deste negócio'
        },
        COLUMN: {
          LABEL: 'Coluna'
        },
        CONTACT: {
          LABEL: 'Contato',
          PLACEHOLDER: 'Selecione um contato'
        },
        CONVERSATION: {
          LABEL: 'Conversa',
          PLACEHOLDER: 'Selecione uma conversa'
        },
        VALUE: {
          LABEL: 'Valor',
          PLACEHOLDER: 'Ex: 1000.00'
        },
        DUE_DATE: {
          LABEL: 'Data de Vencimento'
        }
      },
      ADD: {
        TITLE: 'Adicionar Novo Cartão'
      },
      EDIT: {
        TITLE: 'Editar Cartão'
      },
      DELETE: {
        TITLE: 'Excluir Cartão',
        MESSAGE: 'Tem certeza que deseja excluir o cartão "{cardTitle}"? Esta ação não pode ser desfeita.'
      },
      CREATE_SUCCESS: 'Cartão criado com sucesso',
      UPDATE_SUCCESS: 'Cartão atualizado com sucesso',
      DELETE_SUCCESS: 'Cartão excluído com sucesso',
      CREATE_ERROR: 'Erro ao criar cartão',
      UPDATE_ERROR: 'Erro ao atualizar cartão',
      DELETE_ERROR: 'Erro ao excluir cartão'
    }
  }
}
