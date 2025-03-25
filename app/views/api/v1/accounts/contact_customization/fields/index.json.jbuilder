json.array! @fields do |field|
  json.id field.id
  json.name field.name
  json.field_type field.field_type
  json.required field.required
  json.active field.active
  json.display_order field.display_order
  json.options field.options
  json.description field.description
  json.placeholder field.placeholder
  json.validation_rules field.validation_rules
  json.created_at field.created_at
  json.updated_at field.updated_at
end
