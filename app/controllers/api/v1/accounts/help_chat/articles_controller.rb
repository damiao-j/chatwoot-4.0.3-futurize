# frozen_string_literal: true

class Api::V1::Accounts::HelpChat::ArticlesController < Api::V1::Accounts::BaseController
  before_action :check_authorization
  before_action :fetch_article, only: [:show, :update, :destroy]

  def index
    @articles = Current.account.help_chat_articles.order(created_at: :desc)
    @articles = @articles.search_by_title(params[:query]) if params[:query].present?
    @articles = @articles.active if params[:active].present? && params[:active] == 'true'
  end

  def show; end

  def create
    @article = Current.account.help_chat_articles.new(article_params)
    @article.save!
    render :show
  end

  def update
    @article.update!(article_params)
    render :show
  end

  def destroy
    @article.destroy!
    head :ok
  end

  def search
    query = params[:query]
    return head :bad_request if query.blank?

    @articles = Current.account.help_chat_articles.search(query)
    render :index
  end

  private

  def article_params
    params.require(:article).permit(
      :title,
      :content,
      :active,
      tags: []
    )
  end

  def fetch_article
    @article = Current.account.help_chat_articles.find(params[:id])
  end
end
