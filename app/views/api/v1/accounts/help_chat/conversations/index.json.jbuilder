json.array! @conversations do |conversation|
  json.id conversation.id
  json.account_id conversation.account_id
  json.user_id conversation.user_id
  json.assignee_id conversation.assignee_id
  json.status conversation.status
  json.browser_info conversation.browser_info
  json.browser_language conversation.browser_language
  json.referer conversation.referer
  json.created_at conversation.created_at
  json.updated_at conversation.updated_at
  
  json.user conversation.user if conversation.user.present?
  json.assignee conversation.assignee if conversation.assignee.present?
  
  json.messages_count conversation.messages.count
  json.last_message conversation.messages.order(created_at: :desc).first if conversation.messages.any?
end
