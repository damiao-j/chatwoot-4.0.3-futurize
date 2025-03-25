import './components/SearchDropdowns';

// Importar os componentes do Kanban
import KanbanBoard from './pages/KanbanBoard.vue';
import KanbanBoards from './pages/KanbanBoards.vue';

export default [
  {
    path: 'kanban',
    name: 'kanban_boards',
    roles: ['administrator', 'agent'],
    component: KanbanBoards,
  },
  {
    path: 'kanban/:boardId',
    name: 'kanban_board',
    roles: ['administrator', 'agent'],
    component: KanbanBoard,
  },
];
