import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const ContactSearchDropdown = {
  name: 'ContactSearchDropdown',
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    placeholder: {
      type: String,
      default: 'Selecione um contato',
    },
  },
  data() {
    return {
      searchTerm: '',
      contacts: [],
      isLoading: false,
      selectedContact: null,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        if (newValue && !this.selectedContact) {
          this.fetchContact(newValue);
        }
      },
    },
  },
  methods: {
    async fetchContact(contactId) {
      try {
        this.isLoading = true;
        const response = await this.$store.dispatch('contacts/get', { id: contactId });
        this.selectedContact = response.data;
      } catch (error) {
        // Tratar erro
      } finally {
        this.isLoading = false;
      }
    },
    async searchContacts() {
      if (!this.searchTerm || this.searchTerm.length < 2) {
        this.contacts = [];
        return;
      }

      try {
        this.isLoading = true;
        const response = await this.$store.dispatch('contacts/search', {
          q: this.searchTerm,
        });
        this.contacts = response.data.payload;
      } catch (error) {
        // Tratar erro
      } finally {
        this.isLoading = false;
      }
    },
    selectContact(contact) {
      this.selectedContact = contact;
      this.$emit('input', contact.id);
      this.searchTerm = '';
      this.contacts = [];
    },
    clearSelection() {
      this.selectedContact = null;
      this.$emit('input', null);
    },
  },
  template: `
    <div class="contact-search-dropdown">
      <div v-if="selectedContact" class="selected-contact flex items-center justify-between p-2 border rounded-md">
        <div class="flex items-center">
          <span class="mr-2">👤</span>
          <span>{{ selectedContact.name || selectedContact.email || selectedContact.phone_number }}</span>
        </div>
        <button 
          type="button" 
          class="text-slate-500 hover:text-slate-700"
          @click="clearSelection"
        >
          &times;
        </button>
      </div>
      <div v-else>
        <input
          type="text"
          v-model="searchTerm"
          :placeholder="placeholder"
          class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
          @input="searchContacts"
        />
        <div v-if="isLoading" class="text-center p-2">
          <span>Carregando...</span>
        </div>
        <div v-else-if="contacts.length" class="border rounded-md mt-1 max-h-48 overflow-y-auto">
          <div
            v-for="contact in contacts"
            :key="contact.id"
            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            @click="selectContact(contact)"
          >
            <div class="flex items-center">
              <span class="mr-2">👤</span>
              <span>{{ contact.name || contact.email || contact.phone_number }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="searchTerm.length >= 2" class="text-center p-2 text-slate-500">
          <span>Nenhum contato encontrado</span>
        </div>
      </div>
    </div>
  `,
};

const ConversationSearchDropdown = {
  name: 'ConversationSearchDropdown',
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    placeholder: {
      type: String,
      default: 'Selecione uma conversa',
    },
  },
  data() {
    return {
      searchTerm: '',
      conversations: [],
      isLoading: false,
      selectedConversation: null,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        if (newValue && !this.selectedConversation) {
          this.fetchConversation(newValue);
        }
      },
    },
  },
  methods: {
    async fetchConversation(conversationId) {
      try {
        this.isLoading = true;
        const response = await this.$store.dispatch('conversations/fetchConversation', {
          conversationId,
        });
        this.selectedConversation = response.data;
      } catch (error) {
        // Tratar erro
      } finally {
        this.isLoading = false;
      }
    },
    async searchConversations() {
      if (!this.searchTerm || this.searchTerm.length < 2) {
        this.conversations = [];
        return;
      }

      try {
        this.isLoading = true;
        const response = await this.$store.dispatch('conversations/search', {
          q: this.searchTerm,
        });
        this.conversations = response.data.payload;
      } catch (error) {
        // Tratar erro
      } finally {
        this.isLoading = false;
      }
    },
    selectConversation(conversation) {
      this.selectedConversation = conversation;
      this.$emit('input', conversation.id);
      this.searchTerm = '';
      this.conversations = [];
    },
    clearSelection() {
      this.selectedConversation = null;
      this.$emit('input', null);
    },
  },
  template: `
    <div class="conversation-search-dropdown">
      <div v-if="selectedConversation" class="selected-conversation flex items-center justify-between p-2 border rounded-md">
        <div class="flex items-center">
          <span class="mr-2">💬</span>
          <span>Conversa #{{ selectedConversation.id }}</span>
        </div>
        <button 
          type="button" 
          class="text-slate-500 hover:text-slate-700"
          @click="clearSelection"
        >
          &times;
        </button>
      </div>
      <div v-else>
        <input
          type="text"
          v-model="searchTerm"
          :placeholder="placeholder"
          class="w-full rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-woot-500 focus:border-woot-500"
          @input="searchConversations"
        />
        <div v-if="isLoading" class="text-center p-2">
          <span>Carregando...</span>
        </div>
        <div v-else-if="conversations.length" class="border rounded-md mt-1 max-h-48 overflow-y-auto">
          <div
            v-for="conversation in conversations"
            :key="conversation.id"
            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            @click="selectConversation(conversation)"
          >
            <div class="flex items-center">
              <span class="mr-2">💬</span>
              <span>Conversa #{{ conversation.id }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="searchTerm.length >= 2" class="text-center p-2 text-slate-500">
          <span>Nenhuma conversa encontrada</span>
        </div>
      </div>
    </div>
  `,
};

Vue.component('contact-search-dropdown', ContactSearchDropdown);
Vue.component('conversation-search-dropdown', ConversationSearchDropdown);
