class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :project_memberships, dependent: :destroy
  has_many :projects, through: :project_memberships

  has_many :owned_projects,
           class_name: "Project",
           foreign_key: :owner_id,
           inverse_of: :owner,
           dependent: :nullify
end
