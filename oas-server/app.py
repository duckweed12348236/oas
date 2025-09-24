import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Any

from fastapi import FastAPI
from starlette.staticfiles import StaticFiles
from tortoise import Tortoise

from config import LocalStorageConfig
import controllers.notification, controllers.employee, controllers.attendance, controllers.user, controllers.department, \
    controllers.home, controllers.permission


@asynccontextmanager
async def set_up_extensions(app: FastAPI) -> AsyncGenerator[None, Any]:
    from config import LocalStorageConfig
    os.makedirs(LocalStorageConfig.PATH, exist_ok=True)
    from config import TORTOISE_ORM_CONFIG
    await Tortoise.init(
        config=TORTOISE_ORM_CONFIG
    )
    yield
    await Tortoise.close_connections()


app = FastAPI(lifespan=set_up_extensions, debug=True)

app.include_router(controllers.notification.router)
app.include_router(controllers.employee.router)
app.include_router(controllers.attendance.router)
app.include_router(controllers.user.router)
app.include_router(controllers.department.router)
app.include_router(controllers.home.router)
app.include_router(controllers.permission.router)
app.mount(f"/{LocalStorageConfig.PATH}", StaticFiles(directory=LocalStorageConfig.PATH), name="storage")

import middlewares
