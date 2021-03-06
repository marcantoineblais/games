class ApplicationController < ActionController::Base
  before_action :find_device_type
  before_action :store_user_location!, if: :storable_location?
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
  end

  private

  def find_device_type
    user_agent = request.user_agent
    client = DeviceDetector.new(user_agent)
    @device = client.device_type

    # @device = 'smartphone'
  end

  def store_user_location!
    store_location_for(:user, request.fullpath)
  end

  def storable_location?
    is_navigational_format? && !devise_controller? && !request.xhr?
  end

  def after_sign_in_path_for(resource_or_scope)
    stored_location_for(resource_or_scope) || super
  end

  def after_sign_out_path_for(resource_or_scope)
    stored_location_for(resource_or_scope) || super
  end
end
