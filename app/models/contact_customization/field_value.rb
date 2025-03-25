# frozen_string_literal: true

class ContactCustomization::FieldValue < ApplicationRecord
  self.table_name = 'contact_customization_field_values'

  belongs_to :field, class_name: 'ContactCustomization::Field', foreign_key: 'field_id'
  belongs_to :contact

  validates :field_id, presence: true
  validates :contact_id, presence: true
  validates :value, presence: true, if: -> { field.required? }

  def formatted_value
    case field.field_type
    when 'date'
      Date.parse(value).strftime('%d/%m/%Y') rescue value
    when 'checkbox'
      value == 'true' ? 'Sim' : 'Não'
    else
      value
    end
  end
end
