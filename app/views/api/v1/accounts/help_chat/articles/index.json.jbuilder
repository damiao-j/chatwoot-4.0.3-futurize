json.array! @articles do |article|
  json.id article.id
  json.title article.title
  json.content article.content
  json.active article.active
  json.views_count article.views_count
  json.helpful_count article.helpful_count
  json.not_helpful_count article.not_helpful_count
  json.tags article.tags
  json.created_at article.created_at
  json.updated_at article.updated_at
end
