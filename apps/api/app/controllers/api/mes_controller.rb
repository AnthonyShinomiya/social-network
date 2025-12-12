class Api::MesController < Api::BaseController
  def show
    render json: {
      id: current_user.id,
      email: current_user.email,
      name: current_user.name,
      last_name: current_user.last_name
    }
  end
end
