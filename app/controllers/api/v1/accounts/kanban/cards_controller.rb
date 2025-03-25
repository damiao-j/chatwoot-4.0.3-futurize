# frozen_string_literal: true

class Api::V1::Accounts::Kanban::CardsController < Api::V1::Accounts::BaseController
  before_action :fetch_board
  before_action :fetch_column, only: [:create]
  before_action :fetch_card, only: [:show, :update, :destroy, :move]

  def index
    @cards = @board.cards.includes(:column, :contact, :conversation, :user).ordered
  end

  def show; end

  def create
    @card = @column.cards.new(card_params)
    @card.board = @board
    @card.save!
    render :show
  end

  def update
    @card.update!(card_params)
    render :show
  end

  def destroy
    @card.destroy!
    head :ok
  end

  def move
    target_column_id = params[:target_column_id]
    position = params[:position]

    return head :bad_request unless target_column_id.present?

    ActiveRecord::Base.transaction do
      @card.move_to_column(target_column_id)
      
      if position.present?
        # Reordenar os cards na coluna de destino
        cards = Kanban::Card.where(column_id: target_column_id).ordered
        cards_array = cards.to_a
        
        # Remover o card atual da lista se já estiver na coluna
        cards_array.delete(@card) if @card.column_id == target_column_id.to_i
        
        # Inserir o card na posição desejada
        cards_array.insert(position.to_i, @card)
        
        # Atualizar as posições
        cards_array.each_with_index do |card, index|
          card.update_columns(position: index + 1)
        end
      end
    end

    render :show
  end

  def reorder
    column_id = params[:column_id]
    cards = params[:cards]
    
    return head :bad_request unless column_id.present? && cards.is_a?(Array)

    ActiveRecord::Base.transaction do
      cards.each_with_index do |card_id, index|
        Kanban::Card.where(id: card_id, column_id: column_id).update_all(position: index + 1)
      end
    end

    head :ok
  end

  private

  def card_params
    params.require(:card).permit(
      :title, 
      :description, 
      :contact_id, 
      :conversation_id, 
      :user_id, 
      :value, 
      :due_date, 
      custom_fields: {}, 
      settings: {}
    )
  end

  def fetch_board
    @board = Current.account.kanban_boards.find(params[:board_id])
  end

  def fetch_column
    @column = @board.columns.find(params[:column_id])
  end

  def fetch_card
    @card = @board.cards.find(params[:id])
  end
end
