class Score < ApplicationRecord
  belongs_to :user
  belongs_to :game

  validates :points, :game, presence: true
end
