class CreateContactCustomizationTables < ActiveRecord::Migration[6.1]
  def change
    create_table :contact_customization_fields do |t|
      t.references :account, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :field_type, null: false, default: 0
      t.boolean :required, default: false
      t.boolean :active, default: true
      t.integer :display_order, null: false
      t.jsonb :options, default: []
      t.text :description
      t.string :placeholder
      t.jsonb :validation_rules, default: {}

      t.timestamps
    end

    create_table :contact_customization_field_values do |t|
      t.references :field, null: false, index: true
      t.references :contact, null: false, foreign_key: true
      t.text :value

      t.timestamps
    end

    add_foreign_key :contact_customization_field_values, :contact_customization_fields, column: :field_id
    add_index :contact_customization_fields, [:account_id, :display_order], name: 'index_contact_fields_on_account_id_and_display_order'
    add_index :contact_customization_field_values, [:field_id, :contact_id], unique: true, name: 'index_contact_field_values_on_field_id_and_contact_id'
  end
end
