json.array! @messages do |message|
  json.id message.id
  json.conversation_id message.conversation_id
  json.content message.content
  json.message_type message.message_type
  json.sender_type message.sender_type
  json.sender_id message.sender_id
  json.content_attributes message.content_attributes
  json.created_at message.created_at
  json.updated_at message.updated_at
  
  if message.sender.present?
    json.sender do
      json.id message.sender.id
      json.name message.sender.try(:name)
      json.type message.sender_type
    end
  end
end
