<template>
  <div class="help-chat-container">
    <!-- Componente principal que integra o botão e a janela de chat -->
    <help-chat-button 
      :chat-open="chatOpen" 
      @toggle-chat="toggleChat" 
    />
    
    <help-chat-window 
      :is-open="chatOpen" 
      @close-chat="closeChat" 
    />
  </div>
</template>

<script>
import HelpChatButton from '../components/HelpChatButton.vue';
import HelpChatWindow from '../components/HelpChatWindow.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'HelpChatWidget',
  components: {
    HelpChatButton,
    HelpChatWindow,
  },
  data() {
    return {
      chatOpen: false,
    };
  },
  computed: {
    ...mapGetters({
      settings: 'helpChat/getSettings',
      uiFlags: 'helpChat/getUIFlags',
    }),
  },
  mounted() {
    this.fetchSettings();
  },
  methods: {
    async fetchSettings() {
      try {
        await this.$store.dispatch('helpChat/fetchSettings');
      } catch (error) {
        console.error('Erro ao carregar configurações do chat de ajuda:', error);
      }
    },
    toggleChat() {
      this.chatOpen = !this.chatOpen;
    },
    closeChat() {
      this.chatOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.help-chat-container {
  /* Estilos globais para o widget de chat */
}
</style>
