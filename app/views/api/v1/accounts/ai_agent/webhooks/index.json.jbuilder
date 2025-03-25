json.array! @webhooks do |webhook|
  json.id webhook.id
  json.agent_id webhook.agent_id
  json.url webhook.url
  json.event_name webhook.event_name
  json.active webhook.active
  json.headers webhook.headers_hash
  json.description webhook.description
  json.created_at webhook.created_at
  json.updated_at webhook.updated_at
end
