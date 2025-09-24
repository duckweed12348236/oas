from uuid import uuid4
from fastapi import APIRouter, Request, UploadFile
from fastapi.params import File, Path
from tortoise.transactions import in_transaction
from aiofiles import open

from models.notification import Notice
from models.user import Department, User, UserPermissionChoice
from schemas.notification import NoticeIn, NoticeOut
from schemas.reply import Reply
from extensions.file import validate_image
from config import LocalStorageConfig

router = APIRouter(prefix="/notification")


@router.post("/notice")
async def create_notice(request: Request, notice_in: NoticeIn) -> Reply[None | NoticeOut]:
    user: User = request.state.user
    async with in_transaction():
        notice = await Notice.create(title=notice_in.title, content=notice_in.content, author_id=user.id)
        if user.permission == UserPermissionChoice.MANAGER:
            department = await Department.filter(id__in=user.id).first()
            await notice.departments.add(department)
        else:
            departments = await Department.filter(id__in=notice_in.department_ids).all()
            if len(departments) == 0:
                return Reply.fail("请为该则通知选择可见部门！")
            await notice.departments.add(*departments)
        notice = await Notice.filter(id=notice.id).first().select_related("author").prefetch_related("departments")
    return Reply.succeed(NoticeOut.model_validate(notice))


@router.put("/notice/{id}")
async def update_notice(request: Request, notice_in: NoticeIn, id: int = Path(gt=0)) -> Reply[None | NoticeOut]:
    user: User = request.state.user
    async with in_transaction():
        if user.permission == UserPermissionChoice.MANAGER:
            notice = await Notice.filter(id=id, departments__id__in=user.department_id).first()
        else:
            notice = await Notice.filter(id=id).first()
        if notice is None:
            return Reply.fail("该通知不存在！")
        notice.title = notice_in.title
        notice.content = notice_in.content
        await notice.save()
        if user.permission == UserPermissionChoice.ADMINISTRATOR:
            departments = await Department.filter(id__in=notice_in.department_ids).all()
            if len(departments) == 0:
                return Reply.fail("请为该则通知选择可见部门！")
            await notice.departments.clear()
            await notice.departments.add(*departments)
        notice = await Notice.filter(id=notice.id).first().select_related("author").prefetch_related("departments")
    return Reply.succeed(NoticeOut.model_validate(notice))


@router.delete("/notice/{id}")
async def delete_notice(request: Request, id: int = Path(gt=0)) -> Reply[None]:
    user: User = request.state.user
    async with in_transaction():
        if user.permission == UserPermissionChoice.MANAGER:
            notice = await Notice.filter(id=id, departments__id__in=user.department_id).first()
        else:
            notice = await Notice.filter(id=id).first()
        if notice is None:
            return Reply.fail("该则通知不存在！")
        await notice.departments.clear()
        await notice.delete()
    return Reply.succeed()


@router.post("/image")
async def upload_image(image: UploadFile = File()):
    try:
        # await validate_image(image)
        name = f"{uuid4()}.{image.filename.split('.')[-1]}"
        path = f"{LocalStorageConfig.IMAGE_PATH}/{name}"
        async with open(path, "wb") as destination:
            await destination.write(await image.read())
        return Reply.succeed(path)
    except Exception as e:
        return Reply.fail(str(e))


@router.get("/notice")
async def list_notices(request: Request) -> Reply[list[NoticeOut]]:
    user: User = request.state.user
    if user.permission == UserPermissionChoice.MANAGER:
        notices = await Notice.filter(departments__id=user.department_id).all().select_related(
            "author").prefetch_related("departments")
    else:
        notices = await Notice.all().select_related("author").prefetch_related("departments")
    return Reply.succeed([NoticeOut.model_validate(x) for x in notices])
