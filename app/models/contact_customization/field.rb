# frozen_string_literal: true

class ContactCustomization::Field < ApplicationRecord
  self.table_name = 'contact_customization_fields'

  belongs_to :account
  has_many :values, class_name: 'ContactCustomization::FieldValue', foreign_key: 'field_id', dependent: :destroy

  validates :account_id, presence: true
  validates :name, presence: true
  validates :field_type, presence: true
  validates :display_order, presence: true, numericality: { only_integer: true }

  enum field_type: {
    text: 0,
    number: 1,
    link: 2,
    date: 3,
    dropdown: 4,
    checkbox: 5,
    radio: 6,
    textarea: 7,
    email: 8,
    phone: 9
  }

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(display_order: :asc) }

  def options
    return [] unless dropdown? || radio?
    
    read_attribute(:options) || []
  end

  def self.create_with_display_order(attributes)
    last_order = where(account_id: attributes[:account_id]).maximum(:display_order) || 0
    create(attributes.merge(display_order: last_order + 1))
  end
end
