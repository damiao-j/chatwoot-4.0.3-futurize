# frozen_string_literal: true

class Api::V1::Accounts::AiAgent::WebhooksController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_agent
  before_action :fetch_webhook, only: [:show, :update, :destroy, :test]

  def index
    @webhooks = @agent.webhooks
  end

  def show; end

  def create
    @webhook = @agent.webhooks.new(webhook_params)
    @webhook.save!
    render :show
  end

  def update
    @webhook.update!(webhook_params)
    render :show
  end

  def destroy
    @webhook.destroy!
    head :ok
  end

  def test
    payload = {
      agent_id: @agent.id,
      agent_name: @agent.name,
      account_id: Current.account.id,
      test: true,
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

  def webhook_params
    params.require(:webhook).permit(
      :url, 
      :event_name, 
      :active, 
      :description,
      headers: {}
    )
  end

  def fetch_agent
    @agent = Current.account.ai_agent_agents.find(params[:agent_id])
  end

  def fetch_webhook
    @webhook = @agent.webhooks.find(params[:id])
  end
end
