from typing import NoReturn

from fastapi import UploadFile
from io import BytesIO
from PIL.Image import open

from config import ImageValidationConfig


async def validate_image(file: UploadFile) -> NoReturn | None:
    if file.size > ImageValidationConfig.MAX_SIZE:
        raise ValueError(f"超出图片大小限制，最大{ImageValidationConfig.MAX_SIZE / 1024 / 1024}MB！")
    if "." in file.filename and file.filename.split(".")[
        -1].upper() not in ImageValidationConfig.ALLOWED_FORMATS:
        raise ValueError(f"图片格式错误，格式仅限{ImageValidationConfig.ALLOWED_FORMATS}！")

    content = await file.read()

    try:
        stream = BytesIO(content).read().decode("utf8")
        print(stream)
        with open(stream) as image:
            image.verify()
            image.load()

            if image.format not in ImageValidationConfig.ALLOWED_FORMATS:
                print(image.format)
                raise ValueError(f"图片格式错误，格式仅限{ImageValidationConfig.ALLOWED_FORMATS}！")
    except Exception as e:
        raise ValueError(str(e))
