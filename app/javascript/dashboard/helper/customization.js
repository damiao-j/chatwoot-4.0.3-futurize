// Arquivo para aplicar customizações dinamicamente no frontend
import Vue from 'vue';

const CustomizationManager = {
  install(Vue) {
    Vue.prototype.$applyCustomizations = function() {
      // Verificar se existem customizações disponíveis
      if (!window.gon || !window.gon.customizations) {
        return;
      }

      const customizations = JSON.parse(window.gon.customizations);
      
      // Aplicar customizações de layout
      if (customizations.layout) {
        this.applyLayoutCustomizations(customizations.layout);
      }
      
      // Aplicar customizações de contatos
      if (customizations.contacts) {
        this.$store.dispatch('contacts/setCustomFields', customizations.contacts.custom_fields);
      }
      
      // Aplicar customizações do Kanban
      if (customizations.kanban) {
        this.$store.dispatch('kanban/setCustomColumns', customizations.kanban.columns);
      }
      
      // Aplicar customizações do Chat de Ajuda
      if (customizations.help_chat) {
        this.$store.dispatch('helpChat/setSettings', customizations.help_chat);
      }
      
      // Aplicar customizações de Agentes de IA
      if (customizations.ai_agents) {
        this.$store.dispatch('aiAgent/setAgents', customizations.ai_agents);
      }
    };
    
    Vue.prototype.applyLayoutCustomizations = function(layoutCustomizations) {
      // Aplicar logo
      if (layoutCustomizations.logo_url) {
        const logoElements = document.querySelectorAll('.logo');
        logoElements.forEach(element => {
          const img = element.querySelector('img');
          if (img) {
            img.src = layoutCustomizations.logo_url;
          }
        });
      }
      
      // Aplicar nome do site
      if (layoutCustomizations.site_name) {
        document.title = layoutCustomizations.site_name;
        const siteNameElements = document.querySelectorAll('.site-name');
        siteNameElements.forEach(element => {
          element.textContent = layoutCustomizations.site_name;
        });
      }
      
      // Aplicar cores
      const root = document.documentElement;
      
      if (layoutCustomizations.primary_color) {
        root.style.setProperty('--w-500', layoutCustomizations.primary_color);
        root.style.setProperty('--w-600', this.adjustColor(layoutCustomizations.primary_color, -20));
        root.style.setProperty('--w-700', this.adjustColor(layoutCustomizations.primary_color, -40));
      }
      
      if (layoutCustomizations.secondary_color) {
        root.style.setProperty('--s-500', layoutCustomizations.secondary_color);
        root.style.setProperty('--s-600', this.adjustColor(layoutCustomizations.secondary_color, -20));
        root.style.setProperty('--s-700', this.adjustColor(layoutCustomizations.secondary_color, -40));
      }
      
      if (layoutCustomizations.background_color) {
        root.style.setProperty('--white', layoutCustomizations.background_color);
      }
      
      if (layoutCustomizations.text_color) {
        root.style.setProperty('--s-900', layoutCustomizations.text_color);
      }
    };
    
    Vue.prototype.adjustColor = function(color, amount) {
      // Função para ajustar a cor (escurecer ou clarear)
      let usePound = false;
      
      if (color[0] === '#') {
        color = color.slice(1);
        usePound = true;
      }
      
      const num = parseInt(color, 16);
      
      let r = (num >> 16) + amount;
      r = Math.max(Math.min(255, r), 0);
      
      let g = ((num >> 8) & 0x00FF) + amount;
      g = Math.max(Math.min(255, g), 0);
      
      let b = (num & 0x0000FF) + amount;
      b = Math.max(Math.min(255, b), 0);
      
      return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    };
  }
};

export default CustomizationManager;
