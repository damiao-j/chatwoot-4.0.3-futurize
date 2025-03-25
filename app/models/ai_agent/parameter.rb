# frozen_string_literal: true

class AiAgent::Parameter < ApplicationRecord
  self.table_name = 'ai_agent_parameters'

  belongs_to :agent, class_name: 'AiAgent::Agent', foreign_key: 'agent_id'

  validates :agent_id, presence: true
  validates :name, presence: true
  validates :param_type, presence: true
  validates :display_order, presence: true, numericality: { only_integer: true }

  enum param_type: {
    text: 0,
    number: 1,
    boolean: 2,
    select: 3,
    textarea: 4,
    json: 5
  }

  scope :ordered, -> { order(display_order: :asc) }

  def options
    return [] unless select?
    
    read_attribute(:options) || []
  end

  def self.create_with_display_order(attributes)
    last_order = where(agent_id: attributes[:agent_id]).maximum(:display_order) || 0
    create(attributes.merge(display_order: last_order + 1))
  end
end
