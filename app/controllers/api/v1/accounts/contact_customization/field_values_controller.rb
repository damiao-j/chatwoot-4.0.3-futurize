# frozen_string_literal: true

class Api::V1::Accounts::ContactCustomization::FieldValuesController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_contact
  before_action :fetch_field_value, only: [:update, :destroy]

  def index
    @field_values = @contact.contact_customization_field_values.includes(:field)
  end

  def create
    @field_value = @contact.contact_customization_field_values.new(field_value_params)
    @field_value.save!
    render :show
  end

  def update
    @field_value.update!(field_value_params)
    render :show
  end

  def destroy
    @field_value.destroy!
    head :ok
  end

  def bulk_update
    field_values = params[:field_values]
    return head :bad_request unless field_values.is_a?(Array)

    ActiveRecord::Base.transaction do
      field_values.each do |field_value_data|
        field_id = field_value_data[:field_id]
        value = field_value_data[:value]
        
        field_value = @contact.contact_customization_field_values.find_by(field_id: field_id)
        
        if field_value
          field_value.update!(value: value)
        else
          @contact.contact_customization_field_values.create!(field_id: field_id, value: value)
        end
      end
    end

    @field_values = @contact.contact_customization_field_values.includes(:field)
    render :index
  end

  private

  def field_value_params
    params.require(:field_value).permit(:field_id, :value)
  end

  def fetch_contact
    @contact = Current.account.contacts.find(params[:contact_id])
  end

  def fetch_field_value
    @field_value = @contact.contact_customization_field_values.find(params[:id])
  end
end
