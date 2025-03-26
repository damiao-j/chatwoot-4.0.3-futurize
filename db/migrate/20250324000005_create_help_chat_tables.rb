class CreateHelpChatTables < ActiveRecord::Migration[6.1]
  def change
    create_table :help_chat_articles do |t|
      t.references :account, null: false, foreign_key: true
      t.string :title, null: false
      t.text :content, null: false
      t.boolean :active, default: true
      t.integer :views_count, default: 0
      t.integer :helpful_count, default: 0
      t.integer :not_helpful_count, default: 0
      t.jsonb :tags, default: []
      t.timestamps
    end

    create_table :help_chat_conversations do |t|
      t.references :account, null: false, foreign_key: true
      t.references :user, null: true, foreign_key: true
      t.references :assignee, null: true, foreign_key: { to_table: :users }
      t.integer :status, default: 0
      t.string :browser_info
      t.string :browser_language
      t.string :referer
      t.timestamps
    end

    create_table :help_chat_messages do |t|
      t.references :conversation, null: false, foreign_key: { to_table: :help_chat_conversations }
      t.references :sender, polymorphic: true, null: true
      t.text :content, null: false
      t.integer :message_type, default: 0
      t.jsonb :content_attributes, default: {}
      t.timestamps
    end

    create_table :help_chat_settings do |t|
      t.references :account, null: false, foreign_key: true, index: { unique: true }
      t.boolean :enabled, default: false
      t.jsonb :ui_settings, default: {
        button_color: '#1f93ff',
        button_position: 'bottom-right',
        chat_title: 'Ajuda',
        welcome_message: 'Olá! Como podemos ajudar você hoje?'
      }
      t.jsonb :knowledge_base_settings, default: {
        enabled_kb: true,
        suggest_articles: true
      }
      t.jsonb :ai_settings, default: {
        enabled_ai: false,
        ai_model: 'gpt-3.5-turbo',
        ai_prompt: 'Você é um assistente de suporte para o Chatwoot. Responda de forma útil e concisa.'
      }
      t.timestamps
    end
  end
end
