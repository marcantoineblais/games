class ScoreController < ApplicationController
  def create
    respond_to do |format|
      format.json do
        if user_logged_in?
          game = Game.find(params(:game_id))
          user = current_user
          Score.create(user: user, game: game, points: params[:points])
          high_scores = render_to_string 'games/high_scores'.html.erb, scores: game.scores
          render json: { high_scores: high_scores }
        end
      end
    end
  end
end
