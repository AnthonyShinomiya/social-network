# app/controllers/users/sessions_controller.rb
class Users::SessionsController < Devise::SessionsController
  respond_to :json

  # En vez de skip_before_action :verify_authenticity_token (no existe en API),
  # usa la macro de RequestForgeryProtection:
  skip_forgery_protection only: %i[create destroy]

  private
  def respond_with(resource, _opts = {})
    render json: { user: { id: resource.id, email: resource.email, name: resource.name, last_name: resource.last_name } }, status: :ok
  end

  def respond_to_on_destroy
    render json: { message: "signed_out" }, status: :ok
  end
end
