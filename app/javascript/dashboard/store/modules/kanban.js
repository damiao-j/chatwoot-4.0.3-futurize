import * as types from '../mutation-types';
import KanbanAPI from '../../api/kanban';

const state = {
  boards: [],
  currentBoard: {},
  boardColumns: [],
  uiFlags: {
    isFetching: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isCreatingColumn: false,
    isUpdatingColumn: false,
    isDeletingColumn: false,
    isCreatingCard: false,
    isUpdatingCard: false,
    isDeletingCard: false,
    isMovingCard: false,
  },
};

export const getters = {
  getAllBoards(_state) {
    return _state.boards;
  },
  getCurrentBoard(_state) {
    return _state.currentBoard;
  },
  getBoardColumns(_state) {
    return _state.boardColumns;
  },
  getUIFlags(_state) {
    return _state.uiFlags;
  },
};

export const actions = {
  async fetchBoards({ commit }) {
    commit(types.SET_KANBAN_UI_FLAG, { isFetching: true });
    try {
      const response = await KanbanAPI.getBoards();
      commit(types.SET_KANBAN_BOARDS, response.data);
      commit(types.SET_KANBAN_UI_FLAG, { isFetching: false });
      return response.data;
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isFetching: false });
      throw error;
    }
  },

  async fetchBoard({ commit }, boardId) {
    commit(types.SET_KANBAN_UI_FLAG, { isFetching: true });
    try {
      const response = await KanbanAPI.getBoard(boardId);
      commit(types.SET_KANBAN_CURRENT_BOARD, response.data);
      commit(types.SET_KANBAN_BOARD_COLUMNS, response.data.columns);
      commit(types.SET_KANBAN_UI_FLAG, { isFetching: false });
      return response.data;
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isFetching: false });
      throw error;
    }
  },

  async createBoard({ commit }, boardData) {
    commit(types.SET_KANBAN_UI_FLAG, { isCreating: true });
    try {
      const response = await KanbanAPI.createBoard(boardData);
      commit(types.ADD_KANBAN_BOARD, response.data);
      commit(types.SET_KANBAN_UI_FLAG, { isCreating: false });
      return response.data;
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isCreating: false });
      throw error;
    }
  },

  async updateBoard({ commit }, { id, ...boardData }) {
    commit(types.SET_KANBAN_UI_FLAG, { isUpdating: true });
    try {
      const response = await KanbanAPI.updateBoard(id, boardData);
      commit(types.UPDATE_KANBAN_BOARD, response.data);
      commit(types.SET_KANBAN_UI_FLAG, { isUpdating: false });
      return response.data;
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isUpdating: false });
      throw error;
    }
  },

  async deleteBoard({ commit }, boardId) {
    commit(types.SET_KANBAN_UI_FLAG, { isDeleting: true });
    try {
      await KanbanAPI.deleteBoard(boardId);
      commit(types.REMOVE_KANBAN_BOARD, boardId);
      commit(types.SET_KANBAN_UI_FLAG, { isDeleting: false });
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isDeleting: false });
      throw error;
    }
  },

  async createColumn({ commit }, { boardId, ...columnData }) {
    commit(types.SET_KANBAN_UI_FLAG, { isCreatingColumn: true });
    try {
      const response = await KanbanAPI.createColumn(boardId, columnData);
      commit(types.ADD_KANBAN_COLUMN, response.data);
      commit(types.SET_KANBAN_UI_FLAG, { isCreatingColumn: false });
      return response.data;
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isCreatingColumn: false });
      throw error;
    }
  },

  async updateColumn({ commit }, { boardId, columnId, ...columnData }) {
    commit(types.SET_KANBAN_UI_FLAG, { isUpdatingColumn: true });
    try {
      const response = await KanbanAPI.updateColumn(boardId, columnId, columnData);
      commit(types.UPDATE_KANBAN_COLUMN, response.data);
      commit(types.SET_KANBAN_UI_FLAG, { isUpdatingColumn: false });
      return response.data;
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isUpdatingColumn: false });
      throw error;
    }
  },

  async deleteColumn({ commit }, { boardId, columnId }) {
    commit(types.SET_KANBAN_UI_FLAG, { isDeletingColumn: true });
    try {
      await KanbanAPI.deleteColumn(boardId, columnId);
      commit(types.REMOVE_KANBAN_COLUMN, columnId);
      commit(types.SET_KANBAN_UI_FLAG, { isDeletingColumn: false });
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isDeletingColumn: false });
      throw error;
    }
  },

  async createCard({ commit }, { boardId, ...cardData }) {
    commit(types.SET_KANBAN_UI_FLAG, { isCreatingCard: true });
    try {
      const response = await KanbanAPI.createCard(boardId, cardData);
      commit(types.ADD_KANBAN_CARD, response.data);
      commit(types.SET_KANBAN_UI_FLAG, { isCreatingCard: false });
      return response.data;
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isCreatingCard: false });
      throw error;
    }
  },

  async updateCard({ commit }, { boardId, cardId, ...cardData }) {
    commit(types.SET_KANBAN_UI_FLAG, { isUpdatingCard: true });
    try {
      const response = await KanbanAPI.updateCard(boardId, cardId, cardData);
      commit(types.UPDATE_KANBAN_CARD, response.data);
      commit(types.SET_KANBAN_UI_FLAG, { isUpdatingCard: false });
      return response.data;
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isUpdatingCard: false });
      throw error;
    }
  },

  async deleteCard({ commit }, { boardId, cardId }) {
    commit(types.SET_KANBAN_UI_FLAG, { isDeletingCard: true });
    try {
      await KanbanAPI.deleteCard(boardId, cardId);
      commit(types.REMOVE_KANBAN_CARD, cardId);
      commit(types.SET_KANBAN_UI_FLAG, { isDeletingCard: false });
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isDeletingCard: false });
      throw error;
    }
  },

  async moveCard({ commit }, { boardId, cardId, targetColumnId, position }) {
    commit(types.SET_KANBAN_UI_FLAG, { isMovingCard: true });
    try {
      const response = await KanbanAPI.moveCard(boardId, cardId, targetColumnId, position);
      commit(types.UPDATE_KANBAN_CARD, response.data);
      commit(types.SET_KANBAN_UI_FLAG, { isMovingCard: false });
      return response.data;
    } catch (error) {
      commit(types.SET_KANBAN_UI_FLAG, { isMovingCard: false });
      throw error;
    }
  },

  async reorderColumns({ commit }, { boardId, columns }) {
    try {
      await KanbanAPI.reorderColumns(boardId, columns);
      // Atualizar a ordem localmente
      commit(types.REORDER_KANBAN_COLUMNS, columns);
    } catch (error) {
      throw error;
    }
  },

  async reorderCards({ commit }, { boardId, columnId, cards }) {
    try {
      await KanbanAPI.reorderCards(boardId, columnId, cards);
      // Atualizar a ordem localmente
      commit(types.REORDER_KANBAN_CARDS, { columnId, cards });
    } catch (error) {
      throw error;
    }
  },
};

export const mutations = {
  [types.SET_KANBAN_UI_FLAG](_state, data) {
    _state.uiFlags = {
      ..._state.uiFlags,
      ...data,
    };
  },

  [types.SET_KANBAN_BOARDS](_state, boards) {
    _state.boards = boards;
  },

  [types.SET_KANBAN_CURRENT_BOARD](_state, board) {
    _state.currentBoard = board;
  },

  [types.SET_KANBAN_BOARD_COLUMNS](_state, columns) {
    _state.boardColumns = columns;
  },

  [types.ADD_KANBAN_BOARD](_state, board) {
    _state.boards.push(board);
  },

  [types.UPDATE_KANBAN_BOARD](_state, updatedBoard) {
    const boardIndex = _state.boards.findIndex(board => board.id === updatedBoard.id);
    if (boardIndex !== -1) {
      _state.boards.splice(boardIndex, 1, updatedBoard);
    }
    if (_state.currentBoard.id === updatedBoard.id) {
      _state.currentBoard = updatedBoard;
    }
  },

  [types.REMOVE_KANBAN_BOARD](_state, boardId) {
    _state.boards = _state.boards.filter(board => board.id !== boardId);
    if (_state.currentBoard.id === boardId) {
      _state.currentBoard = {};
      _state.boardColumns = [];
    }
  },

  [types.ADD_KANBAN_COLUMN](_state, column) {
    _state.boardColumns.push(column);
  },

  [types.UPDATE_KANBAN_COLUMN](_state, updatedColumn) {
    const columnIndex = _state.boardColumns.findIndex(column => column.id === updatedColumn.id);
    if (columnIndex !== -1) {
      _state.boardColumns.splice(columnIndex, 1, updatedColumn);
    }
  },

  [types.REMOVE_KANBAN_COLUMN](_state, columnId) {
    _state.boardColumns = _state.boardColumns.filter(column => column.id !== columnId);
  },

  [types.ADD_KANBAN_CARD](_state, card) {
    const columnIndex = _state.boardColumns.findIndex(column => column.id === card.column_id);
    if (columnIndex !== -1) {
      if (!_state.boardColumns[columnIndex].cards) {
        _state.boardColumns[columnIndex].cards = [];
      }
      _state.boardColumns[columnIndex].cards.push(card);
    }
  },

  [types.UPDATE_KANBAN_CARD](_state, updatedCard) {
    // Encontrar o card em todas as colunas
    _state.boardColumns.forEach(column => {
      if (!column.cards) return;
      
      const cardIndex = column.cards.findIndex(card => card.id === updatedCard.id);
      if (cardIndex !== -1) {
        // Se o card mudou de coluna, remova-o da coluna atual
        if (column.id !== updatedCard.column_id) {
          column.cards.splice(cardIndex, 1);
        } else {
          // Caso contrário, atualize-o na coluna atual
          column.cards.splice(cardIndex, 1, updatedCard);
        }
      }
    });

    // Se o card mudou de coluna, adicione-o à nova coluna
    if (updatedCard.column_id) {
      const targetColumnIndex = _state.boardColumns.findIndex(
        column => column.id === updatedCard.column_id
      );
      if (targetColumnIndex !== -1) {
        if (!_state.boardColumns[targetColumnIndex].cards) {
          _state.boardColumns[targetColumnIndex].cards = [];
        }
        
        // Verificar se o card já existe na coluna de destino
        const existingCardIndex = _state.boardColumns[targetColumnIndex].cards.findIndex(
          card => card.id === updatedCard.id
        );
        
        if (existingCardIndex === -1) {
          _state.boardColumns[targetColumnIndex].cards.push(updatedCard);
        }
      }
    }
  },

  [types.REMOVE_KANBAN_CARD](_state, cardId) {
    _state.boardColumns.forEach(column => {
      if (!column.cards) return;
      column.cards = column.cards.filter(card => card.id !== cardId);
    });
  },

  [types.REORDER_KANBAN_COLUMNS](_state, columnIds) {
    // Reordenar as colunas com base na nova ordem de IDs
    const reorderedColumns = [];
    columnIds.forEach(columnId => {
      const column = _state.boardColumns.find(col => col.id === columnId);
      if (column) {
        reorderedColumns.push(column);
      }
    });
    _state.boardColumns = reorderedColumns;
  },

  [types.REORDER_KANBAN_CARDS](_state, { columnId, cardIds }) {
    const columnIndex = _state.boardColumns.findIndex(column => column.id === columnId);
    if (columnIndex !== -1 && _state.boardColumns[columnIndex].cards) {
      const reorderedCards = [];
      cardIds.forEach(cardId => {
        const card = _state.boardColumns[columnIndex].cards.find(c => c.id === cardId);
        if (card) {
          reorderedCards.push(card);
        }
      });
      _state.boardColumns[columnIndex].cards = reorderedCards;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
