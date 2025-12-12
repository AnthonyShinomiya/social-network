# class Api::BaseController < ActionController::API
class Api::BaseController < ApplicationController
  before_action :authenticate_user!
end
