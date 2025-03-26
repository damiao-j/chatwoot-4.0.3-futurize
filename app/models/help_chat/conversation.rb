class HelpChat::Conversation < ApplicationRecord
  belongs_to :account
  belongs_to :user, optional: true
  belongs_to :assignee, class_name: 'User', optional: true
  
  has_many :messages, class_name: 'HelpChat::Message', dependent: :destroy
  
  validates :status, presence: true
  
  enum status: { open: 0, resolved: 1, pending: 2 }
  
  scope :active, -> { where(status: [:open, :pending]) }
  scope :assigned_to, ->(user_id) { where(assignee_id: user_id) }
  
  def assign(user_id)
    update(assignee_id: user_id)
  end
  
  def resolve
    update(status: :resolved)
  end
  
  def reopen
    update(status: :open)
  end
end
