class DatabaseConfig:
    HOST = 'localhost'
    PORT = 3306
    USERNAME = 'root'
    PASSWORD = '123456'
    DATABASE_NAME = 'oas'
    URL = f'mysql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE_NAME}'


class LocalStorageConfig:
    PATH = "storage"
    IMAGE_PATH = f"{PATH}/images"


class CORSConfig:
    ALLOW_ORIGINS = ["*"]
    ALLOW_CREDENTIALS = True
    ALLOW_METHODS = ["*"]
    ALLOW_HEADERS = ["*"]
    EXPOSE_HEADERS = ["*"]
    MAX_AGE = 600


TORTOISE_ORM_CONFIG = {
    "connections": {
        "default": DatabaseConfig.URL
    },
    "apps": {
        "models": {
            "models": ["models.user", "models.notification", "models.attendance", "aerich.models"],
            "default_connection": "default"
        }
    },
    "use_tz": True,
    "timezone": "UTC"
}


class JWTConfig:
    SECRET_KEY = "123456"
    ALGORITHM = "HS256"


class ImageValidationConfig:
    ALLOWED_FORMATS = ["JPEG", "JPG", "PNG", "GIF"]
    MAX_SIZE = 5 * 1024 * 1024
