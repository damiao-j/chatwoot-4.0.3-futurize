class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  include RequestExceptionHandler
  include Pundit::Authorization
  include SwitchLocale

  skip_before_action :verify_authenticity_token

  before_action :set_current_user, unless: :devise_controller?
  before_action :apply_customizations, unless: :devise_controller? # Nova linha adicionada
  around_action :switch_locale
  around_action :handle_with_exception, unless: :devise_controller?

  private

  def set_current_user
    @user ||= current_user
    Current.user = @user
  end
  
  # Novo método adicionado para aplicar customizações
  def apply_customizations
    return unless Current.account
    
    # Aplicar customizações ao frontend
    @customizations = CustomizationService.apply_to_frontend(Current.account)
    
    # Adicionar as customizações como variável gon para acesso no frontend
    gon.customizations = @customizations if defined?(gon)
  end

  def pundit_user
    {
      user: Current.user,
      account: Current.account,
      account_user: Current.account_user
    }
  end
end
ApplicationController.include_mod_with('Concerns::ApplicationControllerConcern')
