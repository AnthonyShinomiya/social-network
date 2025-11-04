Rails.application.config.session_store :cookie_store,
  key: "_app_session",
  same_site: :lax,
  secure: Rails.env.production?,
  # ⚠️ En dev, NO pongas :all para evitar problemas en localhost/::1
  domain: (Rails.env.production? ? :all : nil)
