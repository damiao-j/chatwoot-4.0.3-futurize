json.id @settings.id
json.account_id @settings.account_id
json.enabled @settings.enabled

json.ui_settings do
  json.button_color @settings.button_color
  json.button_position @settings.button_position
  json.chat_title @settings.chat_title
  json.welcome_message @settings.welcome_message
end

json.knowledge_base_settings do
  json.enabled_kb @settings.enabled_kb
  json.suggest_articles @settings.suggest_articles
end

json.ai_settings do
  json.enabled_ai @settings.enabled_ai
  json.ai_model @settings.ai_model
  json.ai_prompt @settings.ai_prompt
  json.ai_webhook_url @settings.ai_webhook_url
end

json.created_at @settings.created_at
json.updated_at @settings.updated_at
