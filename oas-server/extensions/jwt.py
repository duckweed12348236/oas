from typing import NoReturn
from datetime import datetime, timedelta

from jwt import encode, decode, InvalidTokenError, ExpiredSignatureError
from config import JWTConfig


def generate_token(secret_key: str, user_id: str, expires_in: int = 3600) -> str:
    expire = datetime.now() + timedelta(seconds=expires_in)
    payload = {
        "user_id": user_id,
        "exp": expire
    }
    token = encode(payload, secret_key, JWTConfig.ALGORITHM)
    return token


def decode_token(secret_key: str, token: str) -> str | NoReturn:
    try:
        payload = decode(token, secret_key, JWTConfig.ALGORITHM)
        return payload["user_id"]
    except ExpiredSignatureError:
        raise ValueError("令牌已过期！")
    except InvalidTokenError:
        raise ValueError("令牌无效！")
