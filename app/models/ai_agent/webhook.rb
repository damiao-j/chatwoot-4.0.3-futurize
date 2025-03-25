# frozen_string_literal: true

class AiAgent::Webhook < ApplicationRecord
  self.table_name = 'ai_agent_webhooks'

  belongs_to :agent, class_name: 'AiAgent::Agent', foreign_key: 'agent_id'

  validates :agent_id, presence: true
  validates :url, presence: true, format: URI::regexp(%w(http https))
  validates :event_name, presence: true

  scope :active, -> { where(active: true) }

  def headers_hash
    read_attribute(:headers) || {}
  end

  def trigger(payload)
    return false unless active && url.present?

    begin
      HTTParty.post(
        url,
        body: payload.to_json,
        headers: {
          'Content-Type' => 'application/json'
        }.merge(headers_hash)
      )
      true
    rescue StandardError => e
      Rails.logger.error "Error triggering webhook: #{e.message}"
      false
    end
  end
end
