# frozen_string_literal: true

class Api::V1::Accounts::HelpChat::SettingsController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_settings

  def show; end

  def update
    @settings.update!(settings_params)
    render :show
  end

  def enable
    @settings.enable!
    render :show
  end

  def disable
    @settings.disable!
    render :show
  end

  private

  def settings_params
    params.require(:settings).permit(
      :enabled,
      ui_settings: [:button_color, :button_position, :chat_title, :welcome_message],
      knowledge_base_settings: [:enabled_kb, :suggest_articles],
      ai_settings: [:enabled_ai, :ai_model, :ai_prompt, :ai_webhook_url]
    )
  end

  def fetch_settings
    @settings = HelpChat::Setting.for_account(Current.account.id)
  end
end
