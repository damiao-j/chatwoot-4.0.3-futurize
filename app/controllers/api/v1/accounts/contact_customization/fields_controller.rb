# frozen_string_literal: true

class Api::V1::Accounts::ContactCustomization::FieldsController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_field, only: [:show, :update, :destroy]

  def index
    @fields = Current.account.contact_customization_fields.ordered
  end

  def show; end

  def create
    @field = ContactCustomization::Field.create_with_display_order(field_params.merge(account_id: Current.account.id))
    render :show
  end

  def update
    @field.update!(field_params)
    render :show
  end

  def destroy
    @field.destroy!
    head :ok
  end

  def reorder
    fields = params[:fields]
    return head :bad_request unless fields.is_a?(Array)

    ActiveRecord::Base.transaction do
      fields.each_with_index do |field_id, index|
        Current.account.contact_customization_fields.find(field_id).update!(display_order: index + 1)
      end
    end

    head :ok
  end

  private

  def field_params
    params.require(:field).permit(
      :name, 
      :field_type, 
      :required, 
      :active, 
      :description, 
      :placeholder,
      options: [], 
      validation_rules: {}
    )
  end

  def fetch_field
    @field = Current.account.contact_customization_fields.find(params[:id])
  end
end
