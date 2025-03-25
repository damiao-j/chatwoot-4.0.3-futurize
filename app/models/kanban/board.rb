# frozen_string_literal: true

class Kanban::Board < ApplicationRecord
  self.table_name = 'kanban_boards'

  belongs_to :account
  has_many :columns, class_name: 'Kanban::Column', foreign_key: 'board_id', dependent: :destroy
  has_many :cards, class_name: 'Kanban::Card', foreign_key: 'board_id', dependent: :destroy

  validates :name, presence: true
  validates :account_id, presence: true

  scope :active, -> { where(active: true) }

  def available_columns
    columns.order(position: :asc)
  end
end
