Rails.application.routes.draw do
  get '/', to: 'games#index'
  resources :games, only: %i[index show]
end
