class CreateAiAgentTables < ActiveRecord::Migration[6.1]
  def change
    create_table :ai_agent_agents do |t|
      t.references :account, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.boolean :active, default: true
      t.jsonb :settings, default: {}

      t.timestamps
    end

    create_table :ai_agent_parameters do |t|
      t.references :agent, null: false, index: true
      t.string :name, null: false
      t.integer :param_type, null: false, default: 0
      t.boolean :required, default: false
      t.integer :display_order, null: false
      t.jsonb :options, default: []
      t.text :description
      t.string :default_value
      t.jsonb :validation_rules, default: {}

      t.timestamps
    end

    create_table :ai_agent_webhooks do |t|
      t.references :agent, null: false, index: true
      t.string :url, null: false
      t.string :event_name, null: false
      t.boolean :active, default: true
      t.jsonb :headers, default: {}
      t.text :description

      t.timestamps
    end

    add_foreign_key :ai_agent_parameters, :ai_agent_agents, column: :agent_id
    add_foreign_key :ai_agent_webhooks, :ai_agent_agents, column: :agent_id
    add_index :ai_agent_parameters, [:agent_id, :display_order], name: 'index_ai_agent_parameters_on_agent_id_and_display_order'
  end
end
