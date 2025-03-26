# frozen_string_literal: true

class Api::V1::Accounts::HelpChat::MessagesController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_conversation
  before_action :fetch_message, only: [:show, :update, :destroy]

  def index
    @messages = @conversation.messages.chronological
  end

  def show; end

  def create
    @message = @conversation.messages.new(message_params)
    
    # Se for uma mensagem de usuário, verificar se precisa sugerir artigos
    if @message.incoming? && suggest_articles?
      suggest_knowledge_base_articles
    end
    
    # Se for uma mensagem de usuário e IA estiver habilitada, gerar resposta de IA
    if @message.incoming? && ai_enabled?
      generate_ai_response
    end
    
    @message.save!
    render :show
  end

  def update
    @message.update!(message_params)
    render :show
  end

  def destroy
    @message.destroy!
    head :ok
  end

  private

  def message_params
    params.require(:message).permit(
      :content,
      :message_type,
      :sender_type,
      :sender_id,
      content_attributes: {}
    )
  end

  def fetch_conversation
    @conversation = Current.account.help_chat_conversations.find(params[:conversation_id])
  end

  def fetch_message
    @message = @conversation.messages.find(params[:id])
  end
  
  def suggest_knowledge_base_articles
    settings = Current.account.help_chat_settings.first
    return unless settings && settings.enabled_kb && settings.suggest_articles
    
    # Buscar artigos relevantes baseados no conteúdo da mensagem
    query = @message.content.split.first(5).join(' ') # Usar as primeiras 5 palavras como query
    articles = Current.account.help_chat_articles.search(query).limit(3)
    
    # Adicionar artigos sugeridos aos atributos de conteúdo da mensagem
    if articles.any?
      @message.content_attributes ||= {}
      @message.content_attributes[:suggested_articles] = articles.map do |article|
        {
          id: article.id,
          title: article.title,
          snippet: article.content.truncate(100)
        }
      end
    end
  end
  
  def generate_ai_response
    settings = Current.account.help_chat_settings.first
    return unless settings && settings.enabled_ai
    
    # Aqui seria implementada a integração com o modelo de IA
    # Por enquanto, vamos apenas criar uma mensagem simulada
    
    # Verificar se há artigos sugeridos para usar na resposta
    suggested_articles = @message.content_attributes&.dig(:suggested_articles)
    
    ai_content = if suggested_articles.present?
      "Encontrei alguns artigos que podem ajudar com sua pergunta:\n\n" +
      suggested_articles.map { |a| "- #{a[:title]}" }.join("\n")
    else
      "Como posso ajudar você com sua pergunta sobre '#{@message.content}'?"
    end
    
    # Criar mensagem de resposta da IA
    @conversation.messages.create!(
      content: ai_content,
      message_type: :ai,
      sender_type: 'System',
      sender_id: nil,
      content_attributes: {
        ai_model: settings.ai_model,
        suggested_articles: suggested_articles
      }
    )
  end
  
  def suggest_articles?
    settings = Current.account.help_chat_settings.first
    settings && settings.enabled_kb && settings.suggest_articles
  end
  
  def ai_enabled?
    settings = Current.account.help_chat_settings.first
    settings && settings.enabled_ai
  end
end
