class Api::V1::Accounts::CustomizationsController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_customization, only: [:show, :update]

  def show
    render json: CustomizationService.apply_customizations(Current.account)
  end

  def update
    # Atualizar customizações de layout
    if params[:layout].present?
      layout_customization = Current.account.layout_customizations.first_or_initialize
      layout_customization.update!(layout_params)
    end
    
    # Atualizar customizações de contatos
    if params[:contacts].present? && params[:contacts][:custom_fields].present?
      update_contact_customizations(params[:contacts][:custom_fields])
    end
    
    # Atualizar customizações do Kanban
    if params[:kanban].present? && params[:kanban][:columns].present?
      update_kanban_customizations(params[:kanban][:columns])
    end
    
    # Retornar as customizações atualizadas
    render json: CustomizationService.apply_customizations(Current.account)
  end

  private

  def layout_params
    params.require(:layout).permit(
      :logo_url,
      :site_name,
      :primary_color,
      :secondary_color,
      :background_color,
      :text_color
    )
  end
  
  def update_contact_customizations(custom_fields)
    # Remover campos customizados que não estão mais presentes
    existing_field_names = custom_fields.map { |field| field[:name] }
    Current.account.contact_customizations.where.not(name: existing_field_names).destroy_all
    
    # Atualizar ou criar campos customizados
    custom_fields.each_with_index do |field, index|
      custom_field = Current.account.contact_customizations.find_or_initialize_by(name: field[:name])
      custom_field.update!(
        field_type: field[:field_type],
        required: field[:required],
        placeholder: field[:placeholder],
        display_order: field[:order] || index
      )
    end
  end
  
  def update_kanban_customizations(columns)
    # Remover colunas que não estão mais presentes
    existing_column_names = columns.map { |column| column[:name] }
    Current.account.kanban_customizations.where.not(name: existing_column_names).destroy_all
    
    # Atualizar ou criar colunas
    columns.each_with_index do |column, index|
      kanban_column = Current.account.kanban_customizations.find_or_initialize_by(name: column[:name])
      kanban_column.update!(
        color: column[:color],
        display_order: column[:order] || index
      )
    end
  end
  
  def fetch_customization
    # Não é necessário buscar uma customização específica, pois estamos trabalhando com todas as customizações da conta
  end
end
