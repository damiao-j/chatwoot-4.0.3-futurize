json.id @agent.id
json.name @agent.name
json.description @agent.description
json.active @agent.active
json.settings @agent.settings
json.created_at @agent.created_at
json.updated_at @agent.updated_at

json.parameters @agent.parameters.ordered do |parameter|
  json.id parameter.id
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

json.webhooks @agent.webhooks do |webhook|
  json.id webhook.id
  json.url webhook.url
  json.event_name webhook.event_name
  json.active webhook.active
  json.headers webhook.headers_hash
  json.description webhook.description
  json.created_at webhook.created_at
  json.updated_at webhook.updated_at
end
