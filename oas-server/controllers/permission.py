from fastapi import APIRouter, Request, Query
from tortoise.transactions import in_transaction

from schemas.permission import UserOut, UserPermissionAssignment
from models.user import User
from schemas.reply import Reply

router = APIRouter(prefix="/permission")


@router.get("/user")
async def list_users(request: Request,
                     page: int = Query(1, gt=0),
                     size: int = Query(25, gt=0)):
    async with in_transaction():
        users = await User.filter(permission__lt=request.state.user.permission).all().limit(size).offset(
            (page - 1) * size).select_related("department")
        total = await User.filter(permission__lt=request.state.user.permission).all().count()
    return Reply.paginate([UserOut.model_validate(x) for x in users], total, page, size)


@router.post("")
async def set_role(request: Request, user_permission_assignment: UserPermissionAssignment):
    if user_permission_assignment.permission >= request.state.user.permission:
        return Reply.fail("没有修改的权限！")
    async with in_transaction():
        user = await User.filter(id=user_permission_assignment.uid).first()
        if not user:
            return Reply.fail("该用户不存在！")
        user.permission = user_permission_assignment.permission
        await user.save()
    return Reply.succeed()
