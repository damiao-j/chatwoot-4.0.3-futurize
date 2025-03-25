# frozen_string_literal: true

class Kanban::Card < ApplicationRecord
  self.table_name = 'kanban_cards'

  belongs_to :board, class_name: 'Kanban::Board', foreign_key: 'board_id'
  belongs_to :column, class_name: 'Kanban::Column', foreign_key: 'column_id'
  belongs_to :contact, optional: true
  belongs_to :conversation, optional: true
  belongs_to :user, optional: true

  validates :title, presence: true
  validates :board_id, presence: true
  validates :column_id, presence: true
  validates :position, presence: true, numericality: { only_integer: true }

  before_validation :set_position, on: :create

  scope :ordered, -> { order(position: :asc) }
  scope :with_contact, -> { where.not(contact_id: nil) }
  scope :with_conversation, -> { where.not(conversation_id: nil) }

  def move_to_column(target_column_id)
    return if column_id == target_column_id

    target_column = Kanban::Column.find(target_column_id)
    return unless target_column && target_column.board_id == board_id

    last_position = Kanban::Card.where(column_id: target_column_id).maximum(:position) || 0
    update(column_id: target_column_id, position: last_position + 1)
  end

  private

  def set_position
    return if position.present?

    last_position = Kanban::Card.where(column_id: column_id).maximum(:position) || 0
    self.position = last_position + 1
  end
end
