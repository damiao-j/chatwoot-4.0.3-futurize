class HelpChat::Article < ApplicationRecord
  belongs_to :account
  
  validates :title, presence: true
  validates :content, presence: true
  
  scope :active, -> { where(active: true) }
  scope :search_by_title, ->(query) { where('title ILIKE ?', "%#{query}%") }
  
  def self.search(query)
    search_by_title(query).active
  end
end
