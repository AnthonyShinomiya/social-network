class Api::HomeController < Api::BaseController
  def show
    memberships = current_user.project_memberships.includes(project: :owner)

    owned_or_collaborating = memberships
      .where(role: [ :owner, :collaborator ])
      .map { |m| serialize_home_project(m.project, m.role) }

    following = memberships
      .where(role: :follower)
      .map { |m| serialize_home_project(m.project, m.role) }

    render json: {
      owned_or_collaborating: owned_or_collaborating,
      following: following
    }
  end

  private

  def serialize_home_project(project, role)
    {
      id: project.id,
      title: project.title,
      description: project.description,
      stage: project.stage,
      tags: project.tags,
      role: role, # "owner" | "collaborator" | "follower"
      owner: {
        id: project.owner.id,
        email: project.owner.email
      }
    }
  end
end
