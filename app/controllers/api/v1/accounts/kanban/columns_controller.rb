# frozen_string_literal: true

class Api::V1::Accounts::Kanban::ColumnsController < Api::V1::Accounts::BaseController
  before_action :fetch_board
  before_action :fetch_column, only: [:show, :update, :destroy, :reorder]

  def index
    @columns = @board.columns.ordered
  end

  def show
    @cards = @column.cards.ordered
  end

  def create
    @column = @board.columns.new(column_params)
    @column.save!
    render :show
  end

  def update
    @column.update!(column_params)
    render :show
  end

  def destroy
    if params[:target_column_id].present?
      @column.move_cards_to_column(params[:target_column_id])
    end
    @column.destroy!
    head :ok
  end

  def reorder
    columns = params[:columns]
    return head :bad_request unless columns.is_a?(Array)

    ActiveRecord::Base.transaction do
      columns.each_with_index do |column_id, index|
        @board.columns.find(column_id).update!(position: index + 1)
      end
    end

    head :ok
  end

  private

  def column_params
    params.require(:column).permit(:name, :description, :position, :color, settings: {})
  end

  def fetch_board
    @board = Current.account.kanban_boards.find(params[:board_id])
  end

  def fetch_column
    @column = @board.columns.find(params[:id])
  end
end
