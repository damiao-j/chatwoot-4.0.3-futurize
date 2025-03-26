# frozen_string_literal: true

class Api::V1::Accounts::AiAgent::WebhookTriggersController < Api::V1::Accounts::BaseController
  before_action :authenticate_access_token!
  before_action :fetch_agent
  before_action :fetch_webhook

  def create
    parameters = params[:parameters] || {}
    
    payload = {
      agent_id: @agent.id,
      agent_name: @agent.name,
      account_id: Current.account.id,
      parameters: parameters,
      timestamp: Time.now.to_i
    }
    
    success = @webhook.trigger(payload)
    
    if success
      render json: { success: true, message: 'Webhook triggered successfully' }
    else
      render json: { success: false, message: 'Failed to trigger webhook' }, status: :unprocessable_entity
    end
  end

  private

  def authenticate_access_token!
    token = request.headers['api_access_token']
    account = Account.find_by(api_access_token: token)
    
    if account.blank?
      render json: { error: 'Invalid access token' }, status: :unauthorized
      return
    end
    
    Current.account = account
  end

  def fetch_agent
    @agent = Current.account.ai_agent_agents.find(params[:agent_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Agent not found' }, status: :not_found
  end

  def fetch_webhook
    @webhook = @agent.webhooks.find(params[:webhook_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Webhook not found' }, status: :not_found
  end
end
