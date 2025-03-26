# frozen_string_literal: true

class Api::V1::Accounts::HelpChat::ConversationsController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_conversation, only: [:show, :update, :assign, :resolve, :reopen]

  def index
    @conversations = Current.account.help_chat_conversations.order(created_at: :desc)
    @conversations = @conversations.active if params[:status] == 'active'
    @conversations = @conversations.where(status: params[:status]) if params[:status].present? && params[:status] != 'active'
    @conversations = @conversations.assigned_to(params[:assignee_id]) if params[:assignee_id].present?
  end

  def show; end

  def create
    @conversation = Current.account.help_chat_conversations.new(conversation_params)
    @conversation.save!
    
    # Criar mensagem de boas-vindas se houver configuração
    if params[:create_welcome_message] && Current.account.help_chat_settings.present?
      settings = Current.account.help_chat_settings.first
      if settings.welcome_message.present?
        @conversation.messages.create!(
          content: settings.welcome_message,
          message_type: :template,
          sender_type: 'System',
          sender_id: nil
        )
      end
    end
    
    render :show
  end

  def update
    @conversation.update!(conversation_params)
    render :show
  end

  def assign
    user_id = params[:assignee_id]
    @conversation.assign(user_id)
    
    # Registrar atividade de atribuição
    @conversation.messages.create!(
      content: "Conversa atribuída para #{User.find(user_id).name}",
      message_type: :activity,
      sender_type: 'System',
      sender_id: nil
    )
    
    render :show
  end

  def resolve
    @conversation.resolve
    
    # Registrar atividade de resolução
    @conversation.messages.create!(
      content: "Conversa marcada como resolvida",
      message_type: :activity,
      sender_type: 'System',
      sender_id: nil
    )
    
    render :show
  end

  def reopen
    @conversation.reopen
    
    # Registrar atividade de reabertura
    @conversation.messages.create!(
      content: "Conversa reaberta",
      message_type: :activity,
      sender_type: 'System',
      sender_id: nil
    )
    
    render :show
  end

  private

  def conversation_params
    params.require(:conversation).permit(
      :user_id,
      :assignee_id,
      :status,
      :browser_info,
      :browser_language,
      :referer
    )
  end

  def fetch_conversation
    @conversation = Current.account.help_chat_conversations.find(params[:id])
  end
end
