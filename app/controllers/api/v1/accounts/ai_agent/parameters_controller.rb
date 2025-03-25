# frozen_string_literal: true

class Api::V1::Accounts::AiAgent::ParametersController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_agent
  before_action :fetch_parameter, only: [:show, :update, :destroy]

  def index
    @parameters = @agent.parameters.ordered
  end

  def show; end

  def create
    @parameter = @agent.parameters.create_with_display_order(parameter_params)
    render :show
  end

  def update
    @parameter.update!(parameter_params)
    render :show
  end

  def destroy
    @parameter.destroy!
    head :ok
  end

  def reorder
    parameters = params[:parameters]
    return head :bad_request unless parameters.is_a?(Array)

    ActiveRecord::Base.transaction do
      parameters.each_with_index do |parameter_id, index|
        @agent.parameters.find(parameter_id).update!(display_order: index + 1)
      end
    end

    head :ok
  end

  private

  def parameter_params
    params.require(:parameter).permit(
      :name, 
      :param_type, 
      :required, 
      :description, 
      :default_value,
      options: [], 
      validation_rules: {}
    )
  end

  def fetch_agent
    @agent = Current.account.ai_agent_agents.find(params[:agent_id])
  end

  def fetch_parameter
    @parameter = @agent.parameters.find(params[:id])
  end
end
