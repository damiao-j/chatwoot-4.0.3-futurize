json.array! @field_values do |field_value|
  json.id field_value.id
  json.field_id field_value.field_id
  json.contact_id field_value.contact_id
  json.value field_value.value
  json.formatted_value field_value.formatted_value
  json.created_at field_value.created_at
  json.updated_at field_value.updated_at

  json.field do
    json.id field_value.field.id
    json.name field_value.field.name
    json.field_type field_value.field.field_type
    json.required field_value.field.required
    json.active field_value.field.active
    json.options field_value.field.options
  end
end
