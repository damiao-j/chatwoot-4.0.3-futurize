# frozen_string_literal: true

class Api::V1::Accounts::LayoutCustomization::ThemesController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_theme, only: [:show, :update, :destroy, :activate]

  def index
    @themes = Current.account.layout_customization_themes
  end

  def show; end

  def create
    @theme = Current.account.layout_customization_themes.new(theme_params)
    @theme.save!
    render :show
  end

  def update
    @theme.update!(theme_params)
    render :show
  end

  def destroy
    @theme.destroy!
    head :ok
  end

  def activate
    ActiveRecord::Base.transaction do
      # Desativar todos os temas ativos
      Current.account.layout_customization_themes.active.update_all(is_active: false)
      
      # Ativar o tema selecionado
      @theme.update!(is_active: true)
    end
    
    render :show
  end

  private

  def theme_params
    params.require(:theme).permit(
      :name, 
      :site_name, 
      :custom_css,
      :logo, 
      colors: {},
      layout_config: {},
      custom_icons: []
    )
  end

  def fetch_theme
    @theme = Current.account.layout_customization_themes.find(params[:id])
  end
end
