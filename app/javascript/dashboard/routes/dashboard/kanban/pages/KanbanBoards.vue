<template>
  <div class="kanban-boards-view">
    <div class="flex flex-col h-full w-full">
      <div class="flex justify-between items-center mb-4">
        <h1 class="page-title text-xl font-medium">
          {{ $t('KANBAN.BOARDS.HEADER') }}
        </h1>
        <div class="flex">
          <woot-button
            color-scheme="primary"
            icon="plus"
            @click="openAddBoardModal"
          >
            {{ $t('KANBAN.BOARDS.ADD') }}
          </woot-button>
        </div>
      </div>

      <div v-if="uiFlags.isFetching" class="h-full flex items-center justify-center">
        <spinner size="medium" />
      </div>
      <div v-else-if="!boards.length" class="h-full flex items-center justify-center">
        <div class="text-center">
          <h3 class="text-lg font-medium mb-2">
            {{ $t('KANBAN.BOARDS.EMPTY.TITLE') }}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {{ $t('KANBAN.BOARDS.EMPTY.DESCRIPTION') }}
          </p>
          <woot-button
            color-scheme="primary"
            icon="plus"
            @click="openAddBoardModal"
          >
            {{ $t('KANBAN.BOARDS.ADD') }}
          </woot-button>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="board in boards"
          :key="board.id"
          class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:border-slate-200 dark:hover:border-slate-600 transition-all cursor-pointer"
          @click="goToBoard(board.id)"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-medium">{{ board.name }}</h3>
            <div class="flex">
              <woot-button
                variant="clear"
                color-scheme="secondary"
                icon="edit"
                size="small"
                @click.stop="openEditBoardModal(board)"
              />
              <woot-button
                variant="clear"
                color-scheme="alert"
                icon="delete"
                size="small"
                @click.stop="confirmDeleteBoard(board)"
              />
            </div>
          </div>
          <p v-if="board.description" class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {{ board.description }}
          </p>
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{{ $t('KANBAN.BOARDS.COLUMNS', { count: board.columns_count }) }}</span>
            <span>{{ $t('KANBAN.BOARDS.CARDS', { count: board.cards_count }) }}</span>
          </div>
        </div>
      </div>
    </div>

    <woot-modal :show.sync="showAddEditModal" :title="modalTitle">
      <div class="p-4">
        <form @submit.prevent="submitBoardForm">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="name">
              {{ $t('KANBAN.BOARDS.FORM.NAME.LABEL') }}
            </label>
            <input
              id="name"
              v-model="boardForm.name"
              type="text"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('KANBAN.BOARDS.FORM.NAME.PLACEHOLDER')"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="description">
              {{ $t('KANBAN.BOARDS.FORM.DESCRIPTION.LABEL') }}
            </label>
            <textarea
              id="description"
              v-model="boardForm.description"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('KANBAN.BOARDS.FORM.DESCRIPTION.PLACEHOLDER')"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-4">
            <div class="flex items-center">
              <input
                id="default_columns"
                v-model="boardForm.default_columns"
                type="checkbox"
                class="h-4 w-4 text-woot-500 focus:ring-woot-500 border-slate-300 rounded"
              />
              <label for="default_columns" class="ml-2 block text-sm">
                {{ $t('KANBAN.BOARDS.FORM.DEFAULT_COLUMNS.LABEL') }}
              </label>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {{ $t('KANBAN.BOARDS.FORM.DEFAULT_COLUMNS.HELP') }}
            </p>
          </div>
          <div class="flex justify-end">
            <woot-button
              variant="clear"
              color-scheme="secondary"
              class="mr-2"
              @click="showAddEditModal = false"
            >
              {{ $t('CANCEL') }}
            </woot-button>
            <woot-button
              color-scheme="primary"
              type="submit"
              :loading="uiFlags.isCreating || uiFlags.isUpdating"
            >
              {{ submitButtonLabel }}
            </woot-button>
          </div>
        </form>
      </div>
    </woot-modal>

    <woot-confirm-dialog
      :show.sync="showDeleteConfirmation"
      :title="$t('KANBAN.BOARDS.DELETE.TITLE')"
      :message="$t('KANBAN.BOARDS.DELETE.MESSAGE', { boardName: selectedBoard?.name })"
      :confirm-text="$t('DELETE')"
      :reject-text="$t('CANCEL')"
      @confirm="deleteBoard"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'KanbanBoards',
  data() {
    return {
      showAddEditModal: false,
      showDeleteConfirmation: false,
      selectedBoard: null,
      boardForm: {
        name: '',
        description: '',
        default_columns: true,
      },
    };
  },
  computed: {
    ...mapGetters({
      boards: 'kanban/getAllBoards',
      uiFlags: 'kanban/getUIFlags',
    }),
    isEditMode() {
      return !!this.selectedBoard;
    },
    modalTitle() {
      return this.isEditMode
        ? this.$t('KANBAN.BOARDS.EDIT.TITLE')
        : this.$t('KANBAN.BOARDS.ADD.TITLE');
    },
    submitButtonLabel() {
      return this.isEditMode
        ? this.$t('SAVE')
        : this.$t('CREATE');
    },
  },
  mounted() {
    this.fetchBoards();
  },
  methods: {
    async fetchBoards() {
      try {
        await this.$store.dispatch('kanban/fetchBoards');
      } catch (error) {
        this.showAlert(this.$t('KANBAN.BOARDS.FETCH_ERROR'));
      }
    },
    openAddBoardModal() {
      this.selectedBoard = null;
      this.boardForm = {
        name: '',
        description: '',
        default_columns: true,
      };
      this.showAddEditModal = true;
    },
    openEditBoardModal(board) {
      this.selectedBoard = board;
      this.boardForm = {
        name: board.name,
        description: board.description,
        default_columns: false,
      };
      this.showAddEditModal = true;
    },
    async submitBoardForm() {
      try {
        if (this.isEditMode) {
          await this.$store.dispatch('kanban/updateBoard', {
            id: this.selectedBoard.id,
            ...this.boardForm,
          });
          this.showAlert(this.$t('KANBAN.BOARDS.UPDATE_SUCCESS'));
        } else {
          const response = await this.$store.dispatch('kanban/createBoard', this.boardForm);
          this.showAlert(this.$t('KANBAN.BOARDS.CREATE_SUCCESS'));
          
          // Navegar para o novo quadro se criado com sucesso
          if (response && response.id) {
            this.goToBoard(response.id);
          }
        }
        this.showAddEditModal = false;
      } catch (error) {
        this.showAlert(
          this.isEditMode
            ? this.$t('KANBAN.BOARDS.UPDATE_ERROR')
            : this.$t('KANBAN.BOARDS.CREATE_ERROR')
        );
      }
    },
    confirmDeleteBoard(board) {
      this.selectedBoard = board;
      this.showDeleteConfirmation = true;
    },
    async deleteBoard() {
      try {
        await this.$store.dispatch('kanban/deleteBoard', this.selectedBoard.id);
        this.showAlert(this.$t('KANBAN.BOARDS.DELETE_SUCCESS'));
        this.showDeleteConfirmation = false;
      } catch (error) {
        this.showAlert(this.$t('KANBAN.BOARDS.DELETE_ERROR'));
      }
    },
    goToBoard(boardId) {
      this.$router.push({ name: 'kanban_board', params: { boardId } });
    },
    showAlert(message) {
      this.$store.dispatch('notifications/create', {
        type: 'success',
        message,
      });
    },
  },
};
</script>
