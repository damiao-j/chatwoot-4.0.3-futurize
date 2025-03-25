json.array! @cards do |card|
  json.id card.id
  json.title card.title
  json.description card.description
  json.position card.position
  json.value card.value
  json.due_date card.due_date
  json.custom_fields card.custom_fields
  json.settings card.settings
  json.created_at card.created_at
  json.updated_at card.updated_at
  json.board_id card.board_id
  json.column_id card.column_id
  
  if card.contact
    json.contact do
      json.id card.contact.id
      json.name card.contact.name
      json.email card.contact.email
      json.phone_number card.contact.phone_number
    end
  end
  
  if card.conversation
    json.conversation do
      json.id card.conversation.id
      json.inbox_id card.conversation.inbox_id
      json.status card.conversation.status
    end
  end
  
  if card.user
    json.user do
      json.id card.user.id
      json.name card.user.name
      json.email card.user.email
      json.avatar_url card.user.avatar_url
    end
  end
end
