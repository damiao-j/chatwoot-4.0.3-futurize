import apiClient from './ApiClient';

const LayoutCustomizationAPI = {
  getThemes() {
    return apiClient.get('/api/v1/accounts/layout_customization/themes');
  },

  getTheme(themeId) {
    return apiClient.get(`/api/v1/accounts/layout_customization/themes/${themeId}`);
  },

  createTheme(themeData) {
    const formData = new FormData();
    
    // Adicionar campos básicos
    formData.append('theme[name]', themeData.name);
    
    if (themeData.site_name) {
      formData.append('theme[site_name]', themeData.site_name);
    }
    
    if (themeData.custom_css) {
      formData.append('theme[custom_css]', themeData.custom_css);
    }
    
    // Adicionar cores se existirem
    if (themeData.colors) {
      Object.keys(themeData.colors).forEach(key => {
        formData.append(`theme[colors][${key}]`, themeData.colors[key]);
      });
    }
    
    // Adicionar configurações de layout se existirem
    if (themeData.layout_config) {
      Object.keys(themeData.layout_config).forEach(key => {
        formData.append(`theme[layout_config][${key}]`, themeData.layout_config[key]);
      });
    }
    
    // Adicionar logo se existir
    if (themeData.logo) {
      formData.append('theme[logo]', themeData.logo);
    }
    
    // Adicionar ícones personalizados se existirem
    if (themeData.custom_icons && themeData.custom_icons.length) {
      themeData.custom_icons.forEach(icon => {
        formData.append('theme[custom_icons][]', icon);
      });
    }
    
    return apiClient.post('/api/v1/accounts/layout_customization/themes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateTheme(themeId, themeData) {
    const formData = new FormData();
    
    // Adicionar campos básicos
    if (themeData.name) {
      formData.append('theme[name]', themeData.name);
    }
    
    if (themeData.site_name) {
      formData.append('theme[site_name]', themeData.site_name);
    }
    
    if (themeData.custom_css) {
      formData.append('theme[custom_css]', themeData.custom_css);
    }
    
    // Adicionar cores se existirem
    if (themeData.colors) {
      Object.keys(themeData.colors).forEach(key => {
        formData.append(`theme[colors][${key}]`, themeData.colors[key]);
      });
    }
    
    // Adicionar configurações de layout se existirem
    if (themeData.layout_config) {
      Object.keys(themeData.layout_config).forEach(key => {
        formData.append(`theme[layout_config][${key}]`, themeData.layout_config[key]);
      });
    }
    
    // Adicionar logo se existir
    if (themeData.logo) {
      formData.append('theme[logo]', themeData.logo);
    }
    
    // Adicionar ícones personalizados se existirem
    if (themeData.custom_icons && themeData.custom_icons.length) {
      themeData.custom_icons.forEach(icon => {
        formData.append('theme[custom_icons][]', icon);
      });
    }
    
    return apiClient.patch(`/api/v1/accounts/layout_customization/themes/${themeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteTheme(themeId) {
    return apiClient.delete(`/api/v1/accounts/layout_customization/themes/${themeId}`);
  },

  activateTheme(themeId) {
    return apiClient.post(`/api/v1/accounts/layout_customization/themes/${themeId}/activate`);
  },

  uploadLogo(themeId, file) {
    const formData = new FormData();
    formData.append('theme[logo]', file);
    
    return apiClient.patch(`/api/v1/accounts/layout_customization/themes/${themeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadIcons(themeId, files) {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('theme[custom_icons][]', file);
    });
    
    return apiClient.patch(`/api/v1/accounts/layout_customization/themes/${themeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default LayoutCustomizationAPI;
