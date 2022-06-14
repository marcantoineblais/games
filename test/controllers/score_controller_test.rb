require "test_helper"

class ScoreControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get score_create_url
    assert_response :success
  end
end
