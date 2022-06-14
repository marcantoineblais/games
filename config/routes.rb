Rails.application.routes.draw do
  devise_for :users
  get '/', to: 'games#index'
  resources :games, only: %i[index show] do
    resources :score, only: :create
  end
end
