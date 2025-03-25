class CreateLayoutCustomizationTables < ActiveRecord::Migration[6.1]
  def change
    create_table :layout_customization_themes do |t|
      t.references :account, null: false, foreign_key: true
      t.string :name, null: false
      t.boolean :is_active, default: false
      t.jsonb :colors, default: {}
      t.jsonb :layout_config, default: {}
      t.string :site_name
      t.text :custom_css

      t.timestamps
    end

    add_index :layout_customization_themes, [:account_id, :is_active], name: 'index_layout_themes_on_account_id_and_is_active'
  end
end
