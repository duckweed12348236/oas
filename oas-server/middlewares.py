from typing import Callable, Coroutine

from jwt import ExpiredSignatureError, InvalidTokenError
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from starlette.requests import Request
from starlette.responses import Response, JSONResponse

from app import app
from config import JWTConfig, CORSConfig
from extensions.jwt import decode_token
from models.user import User, UserStatus, UserPermissionChoice
from schemas.reply import Reply

app.add_middleware(CORSMiddleware,
                   allow_origins=CORSConfig.ALLOW_ORIGINS,
                   allow_credentials=CORSConfig.ALLOW_CREDENTIALS,
                   allow_methods=CORSConfig.ALLOW_METHODS,
                   allow_headers=CORSConfig.ALLOW_HEADERS,
                   expose_headers=CORSConfig.EXPOSE_HEADERS)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def authenticate(request: Request,
                       call_next: Callable[[Request], Coroutine[None, None, Response]]) -> Response:
    if request.method == "OPTIONS" or request.url.path.startswith(
            ("/docs", "/openapi.json", "/staff/login", "/user/login")):
        return await call_next(request)
    token = request.headers.get("Authorization", None)
    reply = dict(code=0, message="", data=None)
    if not token:
        reply["message"] = "请先登录！"
        return JSONResponse(content=reply)
    try:
        user_id = int(decode_token(JWTConfig.SECRET_KEY, token))
    except ExpiredSignatureError:
        reply["message"] = "令牌已过期！"
        return JSONResponse(content=reply)
    except InvalidTokenError:
        reply["message"] = "令牌无效！"
        return JSONResponse(content=reply)
    user = await User.filter(id=user_id).first()
    if user.status != UserStatus.ACTIVE:
        reply["message"] = "该用户未激活！"
        return JSONResponse(content=reply)
    if not request.url.path.startswith("/user") and user.permission == UserPermissionChoice.USER:
        reply["message"] = "该用户没有权限登录！"
        return JSONResponse(content=reply)
    elif request.url.path.startswith("/department") and user.permission != UserPermissionChoice.ADMINISTRATOR:
        reply["message"] = "该用户没有使用该功能的权限！"
        return JSONResponse(content=reply)
    request.state.user = user
    return await call_next(request)
