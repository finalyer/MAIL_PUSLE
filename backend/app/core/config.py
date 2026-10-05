from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MailPulse"
    DATABASE_URL: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    ENCRYPTION_KEY: str
    SECRET_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
