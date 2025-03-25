# frozen_string_literal: true

class Api::V1::Accounts::Kanban::BoardsController < Api::V1::Accounts::BaseController
  before_action :fetch_board, only: [:show, :update, :destroy]

  def index
    @boards = Current.account.kanban_boards.includes(:columns)
  end

  def show
    @columns = @board.columns.includes(:cards).ordered
  end

  def create
    @board = Current.account.kanban_boards.new(board_params)
    @board.save!
    
    # Criar colunas padrão se não foram especificadas
    if params[:default_columns] && @board.columns.empty?
      create_default_columns
    end
    
    render :show
  end

  def update
    @board.update!(board_params)
    render :show
  end

  def destroy
    @board.destroy!
    head :ok
  end

  private

  def board_params
    params.require(:board).permit(:name, :description, :active, settings: {})
  end

  def fetch_board
    @board = Current.account.kanban_boards.find(params[:id])
  end
  
  def create_default_columns
    default_columns = [
      { name: 'Novo', position: 1, color: '#3498DB' },
      { name: 'Qualificado', position: 2, color: '#2ECC71' },
      { name: 'Proposta', position: 3, color: '#F1C40F' },
      { name: 'Negociação', position: 4, color: '#E67E22' },
      { name: 'Fechado', position: 5, color: '#27AE60' },
      { name: 'Perdido', position: 6, color: '#E74C3C' }
    ]
    
    default_columns.each do |column_data|
      @board.columns.create!(column_data)
    end
  end
end
