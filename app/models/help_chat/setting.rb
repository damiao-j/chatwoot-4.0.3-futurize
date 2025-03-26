class HelpChat::Setting < ApplicationRecord
  belongs_to :account
  
  validates :enabled, inclusion: { in: [true, false] }
  
  # Configurações para o chat de ajuda
  store_accessor :ui_settings, :button_color, :button_position, :chat_title, :welcome_message
  
  # Configurações para a base de conhecimento
  store_accessor :knowledge_base_settings, :enabled_kb, :suggest_articles
  
  # Configurações para o chatbot de IA
  store_accessor :ai_settings, :enabled_ai, :ai_model, :ai_prompt, :ai_webhook_url
  
  def self.for_account(account_id)
    find_by(account_id: account_id) || create(account_id: account_id, enabled: false)
  end
  
  def enable!
    update(enabled: true)
  end
  
  def disable!
    update(enabled: false)
  end
end
