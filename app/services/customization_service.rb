class CustomizationService
  def self.apply_customizations(account)
    # Buscar customizações do banco de dados
    customizations = {}
    
    # Customizações de layout
    if layout_customization = account.layout_customizations.first
      customizations[:layout] = {
        logo_url: layout_customization.logo_url,
        site_name: layout_customization.site_name,
        primary_color: layout_customization.primary_color,
        secondary_color: layout_customization.secondary_color,
        background_color: layout_customization.background_color,
        text_color: layout_customization.text_color
      }
    end
    
    # Customizações de contatos
    if account.contact_customizations.any?
      customizations[:contacts] = {
        custom_fields: account.contact_customizations.map do |field|
          {
            name: field.name,
            field_type: field.field_type,
            required: field.required,
            placeholder: field.placeholder,
            order: field.display_order
          }
        end
      }
    end
    
    # Customizações do Kanban
    if account.kanban_customizations.any?
      customizations[:kanban] = {
        columns: account.kanban_customizations.map do |column|
          {
            name: column.name,
            color: column.color,
            order: column.display_order
          }
        end
      }
    end
    
    # Customizações do Chat de Ajuda
    if help_chat_settings = account.help_chat_settings.first
      customizations[:help_chat] = {
        enabled: help_chat_settings.enabled,
        ui_settings: help_chat_settings.ui_settings,
        knowledge_base_settings: help_chat_settings.knowledge_base_settings,
        ai_settings: help_chat_settings.ai_settings
      }
    end
    
    # Customizações de Agentes de IA
    if account.ai_agent_agents.any?
      customizations[:ai_agents] = account.ai_agent_agents.map do |agent|
        {
          name: agent.name,
          description: agent.description,
          parameters: agent.parameters,
          webhook_id: agent.webhook_id
        }
      end
    end
    
    # Retornar as customizações para serem aplicadas dinamicamente
    customizations
  end
  
  def self.apply_to_frontend(account)
    customizations = apply_customizations(account)
    
    # Converter para JSON para ser injetado no frontend
    customizations.to_json
  end
end
