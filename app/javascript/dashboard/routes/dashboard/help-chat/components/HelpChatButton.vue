<template>
  <div class="help-chat-button" 
       :class="buttonPosition" 
       :style="{ backgroundColor: buttonColor }"
       @click="toggleChat">
    <i class="icon" :class="chatOpen ? 'ion-close-round' : 'ion-chatbubble'"></i>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HelpChatButton',
  props: {
    chatOpen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      settings: 'helpChat/getSettings',
    }),
    buttonColor() {
      return this.settings?.ui_settings?.button_color || '#1f93ff';
    },
    buttonPosition() {
      const position = this.settings?.ui_settings?.button_position || 'bottom-right';
      return `position-${position}`;
    },
  },
  methods: {
    toggleChat() {
      this.$emit('toggle-chat');
    },
  },
};
</script>

<style lang="scss" scoped>
.help-chat-button {
  position: fixed;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  .icon {
    color: white;
    font-size: 24px;
  }
  
  &.position-bottom-right {
    bottom: 20px;
    right: 20px;
  }
  
  &.position-bottom-left {
    bottom: 20px;
    left: 20px;
  }
  
  &.position-top-right {
    top: 20px;
    right: 20px;
  }
  
  &.position-top-left {
    top: 20px;
    left: 20px;
  }
}
</style>
