json.array! @columns do |column|
  json.id column.id
  json.name column.name
  json.description column.description
  json.position column.position
  json.color column.color
  json.settings column.settings
  json.created_at column.created_at
  json.updated_at column.updated_at
  json.board_id column.board_id
  
  json.cards_count column.cards.count
end
