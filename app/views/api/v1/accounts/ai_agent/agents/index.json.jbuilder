json.array! @agents do |agent|
  json.id agent.id
  json.name agent.name
  json.description agent.description
  json.active agent.active
  json.settings agent.settings
  json.created_at agent.created_at
  json.updated_at agent.updated_at
  
  json.parameters_count agent.parameters.count
  json.webhooks_count agent.webhooks.count
end
