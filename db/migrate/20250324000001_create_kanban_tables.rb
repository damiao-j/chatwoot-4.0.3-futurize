class CreateKanbanTables < ActiveRecord::Migration[6.1]
  def change
    create_table :kanban_boards do |t|
      t.references :account, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.boolean :active, default: true
      t.jsonb :settings, default: {}

      t.timestamps
    end

    create_table :kanban_columns do |t|
      t.references :board, null: false, index: true
      t.string :name, null: false
      t.text :description
      t.integer :position, null: false
      t.string :color
      t.jsonb :settings, default: {}

      t.timestamps
    end

    add_foreign_key :kanban_columns, :kanban_boards, column: :board_id

    create_table :kanban_cards do |t|
      t.references :board, null: false, index: true
      t.references :column, null: false, index: true
      t.references :contact, null: true, index: true
      t.references :conversation, null: true, index: true
      t.references :user, null: true, index: true
      t.string :title, null: false
      t.text :description
      t.integer :position, null: false
      t.decimal :value, precision: 10, scale: 2
      t.datetime :due_date
      t.jsonb :custom_fields, default: {}
      t.jsonb :settings, default: {}

      t.timestamps
    end

    add_foreign_key :kanban_cards, :kanban_boards, column: :board_id
    add_foreign_key :kanban_cards, :kanban_columns, column: :column_id
    add_foreign_key :kanban_cards, :contacts, column: :contact_id
    add_foreign_key :kanban_cards, :conversations, column: :conversation_id
    add_foreign_key :kanban_cards, :users, column: :user_id
  end
end
