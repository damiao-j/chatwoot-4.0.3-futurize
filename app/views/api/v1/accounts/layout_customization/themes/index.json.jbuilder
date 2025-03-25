json.array! @themes do |theme|
  json.id theme.id
  json.name theme.name
  json.site_name theme.site_name
  json.is_active theme.is_active
  json.created_at theme.created_at
  json.updated_at theme.updated_at

  if theme.logo.attached?
    json.logo do
      json.url url_for(theme.logo)
      json.filename theme.logo.filename
    end
  end
end
