class ProjectMembership < ApplicationRecord
  belongs_to :user
  belongs_to :project

  enum :role, {
    owner: 0,
    collaborator: 1,
    follower: 2
  }
end
