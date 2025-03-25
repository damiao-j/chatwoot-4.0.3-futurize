json.id @theme.id
json.name @theme.name
json.site_name @theme.site_name
json.is_active @theme.is_active
json.colors @theme.colors
json.layout_config @theme.layout_config
json.custom_css @theme.custom_css
json.created_at @theme.created_at
json.updated_at @theme.updated_at

if @theme.logo.attached?
  json.logo do
    json.url url_for(@theme.logo)
    json.filename @theme.logo.filename
  end
end

if @theme.custom_icons.attached?
  json.custom_icons @theme.custom_icons.map do |icon|
    {
      id: icon.id,
      url: url_for(icon),
      filename: icon.filename
    }
  end
end
