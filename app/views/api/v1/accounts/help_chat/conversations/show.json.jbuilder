json.id @conversation.id
json.account_id @conversation.account_id
json.user_id @conversation.user_id
json.assignee_id @conversation.assignee_id
json.status @conversation.status
json.browser_info @conversation.browser_info
json.browser_language @conversation.browser_language
json.referer @conversation.referer
json.created_at @conversation.created_at
json.updated_at @conversation.updated_at

json.user @conversation.user if @conversation.user.present?
json.assignee @conversation.assignee if @conversation.assignee.present?

json.messages do
  json.array! @conversation.messages.chronological do |message|
    json.id message.id
    json.content message.content
    json.message_type message.message_type
    json.sender_type message.sender_type
    json.sender_id message.sender_id
    json.content_attributes message.content_attributes
    json.created_at message.created_at
    
    if message.sender.present?
      json.sender do
        json.id message.sender.id
        json.name message.sender.try(:name)
        json.type message.sender_type
      end
    end
  end
end
