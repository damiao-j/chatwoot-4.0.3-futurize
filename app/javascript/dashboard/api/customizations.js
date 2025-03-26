import apiClient from '../api_client';

const CustomizationsAPI = {
  // Obter todas as customizações da conta atual
  getCustomizations() {
    return apiClient.get('/api/v1/accounts/customizations');
  },

  // Atualizar customizações
  updateCustomizations(customizationData) {
    return apiClient.patch('/api/v1/accounts/customizations', customizationData);
  },
};

export default CustomizationsAPI;
