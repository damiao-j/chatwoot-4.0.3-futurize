json.array! @boards do |board|
  json.id board.id
  json.name board.name
  json.description board.description
  json.active board.active
  json.settings board.settings
  json.created_at board.created_at
  json.updated_at board.updated_at
  
  json.columns_count board.columns.count
  json.cards_count board.cards.count
end
