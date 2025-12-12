class Api::UsersController < Api::BaseController
  def show
    user = User.find(params[:id])

    memberships = user.project_memberships.includes(:project)

    render json: {
      id: user.id,
      email: user.email,
      name: user.try(:name),
      last_name: user.try(:last_name),

      projects: memberships.map { |m|
        project = m.project
        {
          id: project.id,
          title: project.title,
          description: project.description,
          stage: project.stage,
          tags: project.tags,
          role: m.role # "owner" | "collaborator" | "follower"
        }
      }
    }
  end
end
