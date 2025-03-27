<template>
  <div class="kanban-board-view">
    <div class="flex flex-col h-full w-full">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <woot-button
            variant="clear"
            color-scheme="secondary"
            icon="arrow-left"
            class="mr-2"
            @click="goBack"
          />
          <h1 class="page-title text-xl font-medium">
            {{ board.name }}
          </h1>
        </div>
        <div class="flex">
          <woot-button
            variant="clear"
            color-scheme="secondary"
            icon="filter"
            class="mr-2"
            @click="toggleFilterPanel"
          >
            {{ $t('KANBAN.BOARD.FILTER') }}
          </woot-button>
          <woot-button
            color-scheme="primary"
            icon="plus"
            @click="openAddCardModal"
          >
            {{ $t('KANBAN.BOARD.ADD_CARD') }}
          </woot-button>
        </div>
      </div>

      <div v-if="uiFlags.isFetching" class="h-full flex items-center justify-center">
        <spinner size="medium" />
      </div>
      <div v-else-if="!board.id" class="h-full flex items-center justify-center">
        <div class="text-center">
          <h3 class="text-lg font-medium mb-2">
            {{ $t('KANBAN.BOARD.NOT_FOUND.TITLE') }}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {{ $t('KANBAN.BOARD.NOT_FOUND.DESCRIPTION') }}
          </p>
          <woot-button
            color-scheme="primary"
            icon="arrow-left"
            @click="goBack"
          >
            {{ $t('KANBAN.BOARD.GO_BACK') }}
          </woot-button>
        </div>
      </div>
      <div v-else class="flex-1 overflow-x-auto">
        <div class="kanban-container flex h-full">
          <div
            v-for="column in columns"
            :key="column.id"
            class="kanban-column bg-slate-50 dark:bg-slate-900 rounded-lg p-2 mr-4 min-w-[300px] max-w-[300px] h-full flex flex-col"
            :style="{ borderTop: `3px solid ${column.color || '#3498DB'}` }"
          >
            <div class="flex justify-between items-center mb-2 px-2">
              <h3 class="font-medium">
                {{ column.name }}
                <span class="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  ({{ column.cards ? column.cards.length : 0 }})
                </span>
              </h3>
              <div class="flex">
                <woot-button
                  variant="clear"
                  color-scheme="secondary"
                  icon="edit"
                  size="small"
                  @click="openEditColumnModal(column)"
                />
                <woot-button
                  variant="clear"
                  color-scheme="alert"
                  icon="delete"
                  size="small"
                  @click="confirmDeleteColumn(column)"
                />
              </div>
            </div>
            
            <div class="flex-1 overflow-y-auto">
              <draggable
                :list="column.cards || []"
                group="cards"
                ghost-class="ghost-card"
                class="min-h-[200px]"
                @change="handleCardDragChange($event, column.id)"
              >
                <div
                  v-for="card in column.cards"
                  :key="card.id"
                  class="kanban-card bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 p-3 mb-2 cursor-pointer"
                  @click="openCardDetails(card)"
                >
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="font-medium">{{ card.title }}</h4>
                    <div class="flex">
                      <woot-button
                        variant="clear"
                        color-scheme="secondary"
                        icon="edit"
                        size="small"
                        @click.stop="openEditCardModal(card)"
                      />
                    </div>
                  </div>
                  <p v-if="card.description" class="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                    {{ card.description }}
                  </p>
                  
                  <div v-if="card.contact || card.conversation" class="mb-2">
                    <div v-if="card.contact" class="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span class="mr-1">👤</span>
                      <span>{{ card.contact.name || card.contact.email || card.contact.phone_number }}</span>
                    </div>
                    <div v-if="card.conversation" class="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <span class="mr-1">💬</span>
                      <span>{{ $t('KANBAN.CARD.CONVERSATION', { id: card.conversation.id }) }}</span>
                    </div>
                  </div>
                  
                  <div v-if="card.due_date || card.value" class="flex justify-between text-xs">
                    <span v-if="card.due_date" class="text-slate-500 dark:text-slate-400">
                      📅 {{ formatDate(card.due_date) }}
                    </span>
                    <span v-if="card.value" class="font-medium" :class="getValueColorClass(card.value)">
                      {{ formatCurrency(card.value) }}
                    </span>
                  </div>
                </div>
              </draggable>
            </div>
            
            <div class="mt-2 px-2">
              <woot-button
                variant="clear"
                color-scheme="secondary"
                icon="plus"
                size="small"
                class="w-full justify-center"
                @click="openAddCardModal(column.id)"
              >
                {{ $t('KANBAN.BOARD.ADD_CARD_TO_COLUMN') }}
              </woot-button>
            </div>
          </div>
          
          <div class="kanban-add-column min-w-[300px] max-w-[300px] flex items-start">
            <woot-button
              variant="clear"
              color-scheme="secondary"
              icon="plus"
              class="w-full justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg"
              @click="openAddColumnModal"
            >
              {{ $t('KANBAN.BOARD.ADD_COLUMN') }}
            </woot-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para adicionar/editar coluna -->
    <woot-modal :show.sync="showColumnModal" :title="columnModalTitle">
      <div class="p-4">
        <form @submit.prevent="submitColumnForm">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="column-name">
              {{ $t('KANBAN.COLUMN.FORM.NAME.LABEL') }}
            </label>
            <input
              id="column-name"
              v-model="columnForm.name"
              type="text"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('KANBAN.COLUMN.FORM.NAME.PLACEHOLDER')"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="column-description">
              {{ $t('KANBAN.COLUMN.FORM.DESCRIPTION.LABEL') }}
            </label>
            <textarea
              id="column-description"
              v-model="columnForm.description"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('KANBAN.COLUMN.FORM.DESCRIPTION.PLACEHOLDER')"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="column-color">
              {{ $t('KANBAN.COLUMN.FORM.COLOR.LABEL') }}
            </label>
            <input
              id="column-color"
              v-model="columnForm.color"
              type="color"
              class="w-full h-10 rounded-md border border-slate-300 dark:border-slate-700 px-1 py-1 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
            />
          </div>
          <div class="flex justify-end">
            <woot-button
              variant="clear"
              color-scheme="secondary"
              class="mr-2"
              @click="showColumnModal = false"
            >
              {{ $t('CANCEL') }}
            </woot-button>
            <woot-button
              color-scheme="primary"
              type="submit"
              :loading="uiFlags.isCreatingColumn || uiFlags.isUpdatingColumn"
            >
              {{ columnSubmitButtonLabel }}
            </woot-button>
          </div>
        </form>
      </div>
    </woot-modal>

    <!-- Modal para adicionar/editar card -->
    <woot-modal :show.sync="showCardModal" :title="cardModalTitle">
      <div class="p-4">
        <form @submit.prevent="submitCardForm">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="card-title">
              {{ $t('KANBAN.CARD.FORM.TITLE.LABEL') }}
            </label>
            <input
              id="card-title"
              v-model="cardForm.title"
              type="text"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('KANBAN.CARD.FORM.TITLE.PLACEHOLDER')"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="card-description">
              {{ $t('KANBAN.CARD.FORM.DESCRIPTION.LABEL') }}
            </label>
            <textarea
              id="card-description"
              v-model="cardForm.description"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('KANBAN.CARD.FORM.DESCRIPTION.PLACEHOLDER')"
              rows="3"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="card-column">
              {{ $t('KANBAN.CARD.FORM.COLUMN.LABEL') }}
            </label>
            <select
              id="card-column"
              v-model="cardForm.column_id"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              required
            >
              <option v-for="column in columns" :key="column.id" :value="column.id">
                {{ column.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="card-contact">
              {{ $t('KANBAN.CARD.FORM.CONTACT.LABEL') }}
            </label>
            <contact-search-dropdown
              v-model="cardForm.contact_id"
              :placeholder="$t('KANBAN.CARD.FORM.CONTACT.PLACEHOLDER')"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="card-conversation">
              {{ $t('KANBAN.CARD.FORM.CONVERSATION.LABEL') }}
            </label>
            <conversation-search-dropdown
              v-model="cardForm.conversation_id"
              :placeholder="$t('KANBAN.CARD.FORM.CONVERSATION.PLACEHOLDER')"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="card-value">
              {{ $t('KANBAN.CARD.FORM.VALUE.LABEL') }}
            </label>
            <input
              id="card-value"
              v-model="cardForm.value"
              type="number"
              step="0.01"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
              :placeholder="$t('KANBAN.CARD.FORM.VALUE.PLACEHOLDER')"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="card-due-date">
              {{ $t('KANBAN.CARD.FORM.DUE_DATE.LABEL') }}
            </label>
            <input
              id="card-due-date"
              v-model="cardForm.due_date"
              type="date"
              class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
            />
          </div>
          <div class="flex justify-end">
            <woot-button
              variant="clear"
              color-scheme="secondary"
              class="mr-2"
              @click="showCardModal = false"
            >
              {{ $t('CANCEL') }}
            </woot-button>
            <woot-button
              color-scheme="primary"
              type="submit"
              :loading="uiFlags.isCreatingCard || uiFlags.isUpdatingCard"
            >
              {{ cardSubmitButtonLabel }}
            </woot-button>
          </div>
        </form>
      </div>
    </woot-modal>

    <!-- Confirmação de exclusão de coluna -->
    <woot-confirm-dialog
      :show.sync="showDeleteColumnConfirmation"
      :title="$t('KANBAN.COLUMN.DELETE.TITLE')"
      :message="$t('KANBAN.COLUMN.DELETE.MESSAGE', { columnName: selectedColumn?.name })"
      :confirm-text="$t('DELETE')"
      :reject-text="$t('CANCEL')"
      @confirm="deleteColumn"
    />

    <!-- Confirmação de exclusão de card -->
    <woot-confirm-dialog
      :show.sync="showDeleteCardConfirmation"
      :title="$t('KANBAN.CARD.DELETE.TITLE')"
      :message="$t('KANBAN.CARD.DELETE.MESSAGE', { cardTitle: selectedCard?.title })"
      :confirm-text="$t('DELETE')"
      :reject-text="$t('CANCEL')"
      @confirm="deleteCard"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';

export default {
  name: 'KanbanBoard',
  components: {
    draggable,
  },
  data() {
    return {
      showColumnModal: false,
      showCardModal: false,
      showDeleteColumnConfirmation: false,
      showDeleteCardConfirmation: false,
      selectedColumn: null,
      selectedCard: null,
      columnForm: {
        name: '',
        description: '',
        color: '#3498DB',
      },
      cardForm: {
        title: '',
        description: '',
        column_id: null,
        contact_id: null,
        conversation_id: null,
        value: null,
        due_date: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      board: 'kanban/getCurrentBoard',
      columns: 'kanban/getBoardColumns',
      uiFlags: 'kanban/getUIFlags',
    }),
    boardId() {
      return this.$route.params.boardId;
    },
    isEditColumnMode() {
      return !!this.selectedColumn;
    },
    columnModalTitle() {
      return this.isEditColumnMode
        ? this.$t('KANBAN.COLUMN.EDIT.TITLE')
        : this.$t('KANBAN.COLUMN.ADD.TITLE');
    },
    columnSubmitButtonLabel() {
      return this.isEditColumnMode
        ? this.$t('SAVE')
        : this.$t('CREATE');
    },
    isEditCardMode() {
      return !!this.selectedCard;
    },
    cardModalTitle() {
      return this.isEditCardMode
        ? this.$t('KANBAN.CARD.EDIT.TITLE')
        : this.$t('KANBAN.CARD.ADD.TITLE');
    },
    cardSubmitButtonLabel() {
      return this.isEditCardMode
        ? this.$t('SAVE')
        : this.$t('CREATE');
    }
},
    methods: {
       formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
    },
    formatCurrency(value) {
      if (!value) return '';
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(value);
    },
    getValueColorClass(value) {
      if (!value) return '';
      if (value > 0) return 'text-green-600';
      if (value < 0) return 'text-red-600';
      return 'text-slate-500';
    },
    goBack() {
      this.$router.push('/boards');
    },
    toggleFilterPanel() {
      // Implement filter panel toggle logic
      this.$emit('toggle-filter');
    },
    openAddColumnModal() {
      this.selectedColumn = null;
      this.columnForm = {
        name: '',
        description: '',
        color: '#3498DB',
      };
      this.showColumnModal = true;
    },
    openEditColumnModal(column) {
      this.selectedColumn = column;
      this.columnForm = { ...column };
      this.showColumnModal = true;
    },
    submitColumnForm() {
      if (this.isEditColumnMode) {
        this.$store.dispatch('kanban/updateColumn', {
          boardId: this.boardId,
          columnId: this.selectedColumn.id,
          columnData: this.columnForm
        });
      } else {
        this.$store.dispatch('kanban/createColumn', {
          boardId: this.boardId,
          columnData: this.columnForm
        });
      }
      this.showColumnModal = false;
    },
    confirmDeleteColumn(column) {
      this.selectedColumn = column;
      this.showDeleteColumnConfirmation = true;
    },
    deleteColumn() {
      this.$store.dispatch('kanban/deleteColumn', {
        boardId: this.boardId,
        columnId: this.selectedColumn.id
      });
      this.showDeleteColumnConfirmation = false;
    },
    openAddCardModal(columnId = null) {
      this.selectedCard = null;
      this.cardForm = {
        title: '',
        description: '',
        column_id: columnId,
        contact_id: null,
        conversation_id: null,
        value: null,
        due_date: null,
      };
      this.showCardModal = true;
    },
    openEditCardModal(card) {
      this.selectedCard = card;
      this.cardForm = { ...card };
      this.showCardModal = true;
    },
    submitCardForm() {
      if (this.isEditCardMode) {
        this.$store.dispatch('kanban/updateCard', {
          boardId: this.boardId,
          cardId: this.selectedCard.id,
          cardData: this.cardForm
        });
      } else {
        this.$store.dispatch('kanban/createCard', {
          boardId: this.boardId,
          cardData: this.cardForm
        });
      }
      this.showCardModal = false;
    },
    openCardDetails(card) {
      this.$emit('open-card-details', card);
    },
    handleCardDragChange(event, columnId) {
      if (event.added) {
        // Card moved to a new column
        this.$store.dispatch('kanban/moveCard', {
          boardId: this.boardId,
          cardId: event.added.element.id,
          newColumnId: columnId
        });
      }
    },
    confirmDeleteCard(card) {
      this.selectedCard = card;
      this.showDeleteCardConfirmation = true;
    },
    deleteCard() {
      this.$store.dispatch('kanban/deleteCard', {
        boardId: this.boardId,
        cardId: this.selectedCard.id
      });
      this.showDeleteCardConfirmation = false;
    }
  },
  created() {
    // Fetch board and columns when component is created
    this.$store.dispatch('kanban/fetchBoard', this.boardId);
  }
}
</script>