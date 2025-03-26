# frozen_string_literal: true

class AiAgent::Webhook < ApplicationRecord
  self.table_name = 'ai_agent_webhooks'

  belongs_to :agent, class_name: 'AiAgent::Agent', foreign_key: 'agent_id'

  validates :agent_id, presence: true
  validates :url, presence: true
  validates :event_name, presence: true

  scope :active, -> { where(active: true) }

  def trigger(payload)
    return false if !active || url.blank?

    begin
      response = HTTParty.post(
        url,
        body: payload.to_json,
        headers: {
          'Content-Type' => 'application/json'
        }.merge(headers || {})
      )
      
      response.success?
    rescue StandardError => e
      Rails.logger.error "Error triggering webhook: #{e.message}"
      false
    end
  end
end
