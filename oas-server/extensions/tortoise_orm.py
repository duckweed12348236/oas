from tortoise.contrib.fastapi import register_tortoise

from app import app
from config import TORTOISE_ORM_CONFIG

register_tortoise(
    app,
    config=TORTOISE_ORM_CONFIG,
    add_exception_handlers=True
)
