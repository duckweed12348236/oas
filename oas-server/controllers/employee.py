from fastapi import APIRouter, Query, Request
from fastapi.params import Path
from tortoise.exceptions import IntegrityError
from tortoise.transactions import in_transaction

from models.user import Department, User, UserPermissionChoice
from schemas.reply import Reply, Pagination
from schemas.employee import DepartmentOut, UserOut, UserIn, Account
from extensions.jwt import generate_token
from config import JWTConfig

router = APIRouter(prefix="/staff")


@router.post("/login")
async def login(account: Account) -> Reply[dict[str, UserOut | str] | None]:
    user = await User.filter(email=account.email).first().select_related("department")
    if not user or user.password != account.password:
        return Reply.fail("邮箱或密码错误！")
    if user.permission == UserPermissionChoice.USER:
        return Reply.fail("该用户没有登录权限！")
    token = generate_token(JWTConfig.SECRET_KEY, user.id, 60 * 60 * 24 * 7)
    return Reply.succeed({
        "token": token,
        "user": UserOut.model_validate(user)
    })


@router.get("/department")
async def list_departments() -> Reply[list[DepartmentOut]]:
    departments = await Department.all()
    return Reply.succeed([DepartmentOut.model_validate(x) for x in departments])


@router.get("/user")
async def list_users(request: Request,
                     page: int = Query(1, gt=0),
                     size: int = Query(25, gt=0)) -> Reply[Pagination[UserOut]]:
    user: User = request.state.user
    async with in_transaction():
        if user.permission == UserPermissionChoice.MANAGER:
            users = await User.filter(permission__lt=user.permission, department_id=user.id).all().limit(size).offset(
                (page - 1) * size).select_related("department")
            total = await User.filter(permission__lt=user.permission, department_id=user.id).all().count()
        else:
            users = await User.filter(permission__lt=user.permission).all().limit(size).offset(
                (page - 1) * size).select_related("department")
            total = await User.filter(permission__lt=user.permission).all().count()
    return Reply.paginate(
        [UserOut.model_validate(x) for x in users],
        total,
        page,
        size
    )


@router.post("/user")
async def create_user(request: Request, user_in: UserIn) -> Reply[UserOut | None]:
    try:
        async with in_transaction():
            if request.state.user.permission == UserPermissionChoice.MANAGER:
                user = await User.create(**user_in.model_dump(exclude={"department_id"}),
                                         department_id=request.state.user.department_id)
            else:
                user = await User.create(**user_in.model_dump())
            user = await User.filter(id=user.id).first().select_related("department")
        return Reply.succeed(UserOut.model_validate(user))
    except IntegrityError:
        return Reply.fail("邮箱已使用！")


@router.put("/user/{id}")
async def update_user(request: Request, user_in: UserIn, id: int = Path(gt=0)) -> Reply[UserOut | None]:
    try:
        async with in_transaction():
            user = await User.filter(id=id).first()
            if user is None:
                return Reply.fail("该员工不存在！")
            if request.state.user.permission == UserPermissionChoice.MANAGER:
                attrs = user_in.model_dump(exclude={"department_id"})
            else:
                attrs = user_in.model_dump()
            keys = attrs.keys()
            user = User(id=user.id, **attrs)
            await user.save(update_fields=keys)
            user = await User.filter(id=user.id).first().select_related("department")
        return Reply.succeed(UserOut.model_validate(user))
    except IntegrityError:
        return Reply.fail("邮箱不可重复！")
