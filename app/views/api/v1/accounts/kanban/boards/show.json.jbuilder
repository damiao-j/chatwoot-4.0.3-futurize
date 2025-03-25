json.id @board.id
json.name @board.name
json.description @board.description
json.active @board.active
json.settings @board.settings
json.created_at @board.created_at
json.updated_at @board.updated_at

json.columns @board.available_columns do |column|
  json.id column.id
  json.name column.name
  json.description column.description
  json.position column.position
  json.color column.color
  json.settings column.settings
  json.created_at column.created_at
  json.updated_at column.updated_at
  
  json.cards_count column.cards.count
end
