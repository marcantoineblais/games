class ScoreController < ApplicationController
  def create
    respond_to do |format|
      format.json do
        if user_signed_in?
          @game = Game.find(params[:game_id])
          @score = Score.create(user: current_user, game: @game, points: params[:points])
          print `clear`
          puts @game.scores
          game_over = render_to_string(partial: 'games/game_over', formats: :html, locals: { score: @score, game: @game })
          high_scores = render_to_string(partial: 'games/high_scores', formats: :html, locals: { scores: @game.scores })
          render json: { highscores: high_scores, gameOver: game_over }
        end
      end
    end
  end
end
