from fastapi import APIRouter, Request
from tortoise.transactions import in_transaction

from extensions.jwt import generate_token
from models.attendance import LeaveRecord, LeaveRecordType
from models.notification import Notice
from models.user import User, UserStatus
from schemas.attendance import LeaveRecordTypeOut
from schemas.reply import Reply
from schemas.user import LeaveRecordOut, LeaveRecordIn, PasswordGroup, NoticeOut
from schemas.employee import UserOut, Account
from config import JWTConfig

router = APIRouter(prefix="/user")


@router.post("/login")
async def login(account: Account) -> Reply[dict[str, UserOut | str]]:
    user = await User.filter(email=account.email).first().select_related("department")
    if not user or user.password != account.password:
        return Reply.fail("账号或密码错误！")
    if user.status != UserStatus.ACTIVE:
        return Reply.fail("该用户未激活！")
    token = generate_token(JWTConfig.SECRET_KEY, user.id, 60 * 60 * 24 * 7)
    return Reply.succeed({
        "user": UserOut.model_validate(user),
        "token": token
    })


@router.post("/password")
async def reset_password(request: Request, password_group: PasswordGroup) -> Reply[None]:
    user: User = request.state.user
    if user.password != password_group.old_password:
        return Reply.fail("原密码错误！")
    user.password = password_group.new_password
    await user.save()
    return Reply.succeed()


@router.get("/leave-record-type")
async def list_leave_record_types() -> Reply[list[LeaveRecordTypeOut]]:
    leave_record_types = await LeaveRecordType.all()
    return Reply.succeed([LeaveRecordTypeOut.model_validate(x) for x in leave_record_types])


@router.get("/leave-record")
async def list_leave_records() -> Reply[list[LeaveRecordOut]]:
    leave_records = await LeaveRecord.all().select_related("type", "approver")
    return Reply.succeed([LeaveRecordOut.model_validate(x) for x in leave_records])


@router.post("/leave-record")
async def create_leave_record(request: Request, leave_record_in: LeaveRecordIn) -> Reply[None]:
    async with in_transaction():
        leave_record = await LeaveRecord.create(**leave_record_in.model_dump(), initiator_id=request.state.user.id)
        leave_record = await LeaveRecord.filter(id=leave_record.id).first().select_related("type", "approver")
    return Reply.succeed(LeaveRecordOut.model_validate(leave_record))


@router.get("/notice")
async def list_notices(request: Request) -> Reply[list]:
    notices = await Notice.filter(departments__id__in=[request.state.user.department_id]).all().select_related("author")
    return Reply.succeed([NoticeOut.model_validate(x) for x in notices])
