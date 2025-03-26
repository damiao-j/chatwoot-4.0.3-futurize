<template>
  <div>
    <help-chat-widget v-if="showHelpChat" />
  </div>
</template>

<script>
import HelpChatWidget from './components/HelpChatWidget.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'HelpChatContainer',
  components: {
    HelpChatWidget,
  },
  computed: {
    ...mapGetters({
      settings: 'helpChat/getSettings',
    }),
    showHelpChat() {
      return this.settings && this.settings.enabled;
    },
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
  },
};
</script>
