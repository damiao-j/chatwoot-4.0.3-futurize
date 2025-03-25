# frozen_string_literal: true

class LayoutCustomization::Theme < ApplicationRecord
  self.table_name = 'layout_customization_themes'

  belongs_to :account
  has_one_attached :logo
  has_many_attached :custom_icons

  validates :account_id, presence: true
  validates :name, presence: true
  validates :is_active, inclusion: { in: [true, false] }

  scope :active, -> { where(is_active: true) }

  # Cores padrão caso não sejam especificadas
  DEFAULT_COLORS = {
    primary: '#1F93FF',
    secondary: '#3D4853',
    success: '#44CE4B',
    warning: '#FFD700',
    danger: '#FF382D',
    info: '#67AFFF',
    background: '#FFFFFF',
    text: '#3D4853'
  }.freeze

  def colors
    custom_colors = read_attribute(:colors) || {}
    DEFAULT_COLORS.merge(custom_colors.symbolize_keys)
  end

  def layout_config
    read_attribute(:layout_config) || {}
  end

  def self.active_for_account(account_id)
    where(account_id: account_id, is_active: true).first
  end
end
