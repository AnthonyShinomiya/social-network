Rails.application.routes.draw do
  devise_for :users,
    defaults: { format: :json },
    controllers: { sessions: "users/sessions" }

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  #
  namespace :api, defaults: { format: :json } do
    resource :me, only: :show  # Usa Api::MeController

    resource :home, only: [ :show ], controller: "home"
    resources :users, only: [ :show ]

    resources :projects, only: [ :index, :show, :create, :update ] do
      member do
        post :follow
        post :unfollow
        post :promote_to_collaborator
      end
    end
  end
end
