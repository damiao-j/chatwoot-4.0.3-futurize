import apiClient from './api_client';

const KanbanAPI = {
  getBoards() {
    return apiClient.get('/api/v1/accounts/kanban/boards');
  },

  getBoard(boardId) {
    return apiClient.get(`/api/v1/accounts/kanban/boards/${boardId}`);
  },

  createBoard(boardData) {
    return apiClient.post('/api/v1/accounts/kanban/boards', { board: boardData });
  },

  updateBoard(boardId, boardData) {
    return apiClient.patch(`/api/v1/accounts/kanban/boards/${boardId}`, { board: boardData });
  },

  deleteBoard(boardId) {
    return apiClient.delete(`/api/v1/accounts/kanban/boards/${boardId}`);
  },

  getColumns(boardId) {
    return apiClient.get(`/api/v1/accounts/kanban/boards/${boardId}/columns`);
  },

  getColumn(boardId, columnId) {
    return apiClient.get(`/api/v1/accounts/kanban/boards/${boardId}/columns/${columnId}`);
  },

  createColumn(boardId, columnData) {
    return apiClient.post(`/api/v1/accounts/kanban/boards/${boardId}/columns`, { column: columnData });
  },

  updateColumn(boardId, columnId, columnData) {
    return apiClient.patch(`/api/v1/accounts/kanban/boards/${boardId}/columns/${columnId}`, { column: columnData });
  },

  deleteColumn(boardId, columnId) {
    return apiClient.delete(`/api/v1/accounts/kanban/boards/${boardId}/columns/${columnId}`);
  },

  reorderColumns(boardId, columnIds) {
    return apiClient.post(`/api/v1/accounts/kanban/boards/${boardId}/columns/reorder`, { columns: columnIds });
  },

  getCards(boardId) {
    return apiClient.get(`/api/v1/accounts/kanban/boards/${boardId}/cards`);
  },

  getCard(boardId, cardId) {
    return apiClient.get(`/api/v1/accounts/kanban/boards/${boardId}/cards/${cardId}`);
  },

  createCard(boardId, cardData) {
    return apiClient.post(`/api/v1/accounts/kanban/boards/${boardId}/columns/${cardData.column_id}/cards`, { card: cardData });
  },

  updateCard(boardId, cardId, cardData) {
    return apiClient.patch(`/api/v1/accounts/kanban/boards/${boardId}/cards/${cardId}`, { card: cardData });
  },

  deleteCard(boardId, cardId) {
    return apiClient.delete(`/api/v1/accounts/kanban/boards/${boardId}/cards/${cardId}`);
  },

  moveCard(boardId, cardId, targetColumnId, position) {
    return apiClient.post(`/api/v1/accounts/kanban/boards/${boardId}/cards/${cardId}/move`, {
      target_column_id: targetColumnId,
      position,
    });
  },

  reorderCards(boardId, columnId, cardIds) {
    return apiClient.post(`/api/v1/accounts/kanban/boards/${boardId}/columns/${columnId}/cards/reorder`, { cards: cardIds });
  },
};

export default KanbanAPI;
