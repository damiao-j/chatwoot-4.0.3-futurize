# frozen_string_literal: true

class AiAgent::Agent < ApplicationRecord
  self.table_name = 'ai_agent_agents'

  belongs_to :account
  has_many :parameters, class_name: 'AiAgent::Parameter', foreign_key: 'agent_id', dependent: :destroy
  has_many :webhooks, class_name: 'AiAgent::Webhook', foreign_key: 'agent_id', dependent: :destroy

  validates :account_id, presence: true
  validates :name, presence: true
  validates :description, presence: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(created_at: :desc) }

  def create_default_webhook
    webhooks.create(
      url: '',
      event_name: 'agent_created',
      active: false,
      headers: {}
    )
  end
end
