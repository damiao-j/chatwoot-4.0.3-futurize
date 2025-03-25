json.array! @parameters do |parameter|
  json.id parameter.id
  json.agent_id parameter.agent_id
  json.name parameter.name
  json.param_type parameter.param_type
  json.required parameter.required
  json.display_order parameter.display_order
  json.options parameter.options
  json.description parameter.description
  json.default_value parameter.default_value
  json.validation_rules parameter.validation_rules
  json.created_at parameter.created_at
  json.updated_at parameter.updated_at
end
