class ScoresController < ApplicationController
  skip_before_action :authenticate_user!, only: :create

  def create
    respond_to do |format|
      format.json do
        @score = Score.new(score_params)
        @game = Game.find(params[:game_id])
        @score.game = @game
        if user_signed_in?
          @score.user = current_user
        else
          @score.user_id = 0
        end
        @score.save
        game_over = render_to_string(
          partial: 'games/game_over',
          formats: :html,
          locals: { score: @score, game: @game }
        )

        high_scores = render_to_string(
          partial: 'games/high_scores',
          formats: :html,
          locals: { scores: @game.scores }
        )
        render json: { highscores: high_scores, gameOver: game_over }
      end
    end
  end

  def update
    @score = Score.find(params[:id])

    if @score.user_id == 0
      @score.update(user: current_user)
    end
    @game = @score.game
    redirect_to game_path(@game)
  end

  private

  def score_params
    params.require(:score).permit(:points)
  end
end
