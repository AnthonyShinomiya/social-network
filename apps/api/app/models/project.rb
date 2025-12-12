class Project < ApplicationRecord
  belongs_to :owner,
             class_name: "User",
             inverse_of: :owned_projects

  has_many :project_memberships, dependent: :destroy
  has_many :users, through: :project_memberships

  enum :stage, {
    idea: 0,
    fundraising: 1,
    in_progress: 2,
    completed: 3
  }
end
