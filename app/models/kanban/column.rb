# frozen_string_literal: true

class Kanban::Column < ApplicationRecord
  self.table_name = 'kanban_columns'

  belongs_to :board, class_name: 'Kanban::Board', foreign_key: 'board_id'
  has_many :cards, class_name: 'Kanban::Card', foreign_key: 'column_id', dependent: :nullify

  validates :name, presence: true
  validates :board_id, presence: true
  validates :position, presence: true, numericality: { only_integer: true }

  before_validation :set_position, on: :create

  scope :ordered, -> { order(position: :asc) }

  def move_cards_to_column(target_column_id)
    cards.update_all(column_id: target_column_id)
  end

  private

  def set_position
    return if position.present?

    last_position = board.columns.maximum(:position) || 0
    self.position = last_position + 1
  end
end
