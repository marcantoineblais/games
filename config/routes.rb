Rails.application.routes.draw do
  devise_for :users
  get '/', to: 'games#index'
  resources :games, only: %i[index show] do
    resources :scores, only: :create
  end
  get '/score/:id', to: 'scores#update', as: 'score'
end
