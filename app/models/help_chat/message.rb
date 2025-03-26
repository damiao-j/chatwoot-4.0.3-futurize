class HelpChat::Message < ApplicationRecord
  belongs_to :conversation, class_name: 'HelpChat::Conversation'
  belongs_to :sender, polymorphic: true, optional: true
  
  validates :content, presence: true
  validates :message_type, presence: true
  
  enum message_type: { incoming: 0, outgoing: 1, activity: 2, template: 3, ai: 4 }
  
  scope :chronological, -> { order(created_at: :asc) }
  
  def from_user?
    sender_type == 'User'
  end
  
  def from_bot?
    message_type == 'ai'
  end
  
  def system_message?
    message_type == 'activity'
  end
end
