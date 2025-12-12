class Api::ProjectsController < Api::BaseController
  before_action :set_project, only: [ :show, :update, :follow, :unfollow, :promote_to_collaborator ]

  # GET /api/projects
  def index
    projects = Project.includes(:owner).order(created_at: :desc)

    render json: projects.map { |p| serialize_project(p) }
  end

  # GET /api/projects/:id
  # <- Ahora devuelve membresías
  def show
    memberships = @project.project_memberships.includes(:user)

    render json: {
      project: serialize_project(@project),
      memberships: memberships.map { |m| serialize_membership(m) }
    }
  end

  # POST /api/projects
  def create
    project = current_user.owned_projects.build(project_params)

    if project.save
      ProjectMembership.create!(user: current_user, project: project, role: :owner)
      render json: serialize_project(project), status: :created
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT/PATCH /api/projects/:id
  def update
    return head :forbidden unless @project.owner == current_user

    if @project.update(project_params)
      render json: serialize_project(@project)
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /api/projects/:id/follow
  def follow
    membership = ProjectMembership.find_or_initialize_by(user: current_user, project: @project)

    # Si ya es owner o collaborator → NO lo bajamos a follower
    if membership.new_record? || membership.follower?
      membership.role = :follower
      membership.save!
    end

    render json: { status: "followed" }
  end

  # POST /api/projects/:id/unfollow
  def unfollow
    ProjectMembership.where(
      user: current_user,
      project: @project,
      role: :follower
    ).destroy_all

    render json: { status: "unfollowed" }
  end

  # POST /api/projects/:id/promote_to_collaborator
  def promote_to_collaborator
    return head :forbidden unless @project.owner == current_user

    membership = ProjectMembership.find_or_initialize_by(user_id: params[:user_id], project: @project)
    membership.role = :collaborator
    membership.save!

    render json: { status: "promoted_to_collaborator" }
  end

  private

  def set_project
    @project = Project.find(params[:id])
  end

  def project_params
    params.require(:project).permit(:title, :description, :stage, tags: [])
  end

  # Serializers internos
  def serialize_project(p)
    {
      id: p.id,
      title: p.title,
      description: p.description,
      stage: p.stage,
      tags: p.tags,
      owner: {
        id: p.owner.id,
        email: p.owner.email
      }
    }
  end

  def serialize_membership(m)
    {
      role: m.role,
      user: {
        id: m.user.id,
        email: m.user.email,
        name: m.user.try(:name),
        last_name: m.user.try(:last_name)
      }
    }
  end
end
