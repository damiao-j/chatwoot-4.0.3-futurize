# frozen_string_literal: true

class Api::V1::Accounts::AiAgent::AgentsController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_agent, only: [:show, :update, :destroy]

  def index
    @agents = Current.account.ai_agent_agents.ordered
  end

  def show; end

  def create
    @agent = Current.account.ai_agent_agents.new(agent_params)
    
    ActiveRecord::Base.transaction do
      @agent.save!
      @agent.create_default_webhook
    end
    
    render :show
  end

  def update
    @agent.update!(agent_params)
    render :show
  end

  def destroy
    @agent.destroy!
    head :ok
  end

  private

  def agent_params
    params.require(:agent).permit(
      :name, 
      :description, 
      :active,
      settings: {}
    )
  end

  def fetch_agent
    @agent = Current.account.ai_agent_agents.find(params[:id])
  end
end
