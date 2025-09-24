from fastapi import APIRouter

from models.user import User, Department
from schemas.reply import Reply

router = APIRouter(prefix="/home")


@router.get("")
async def home():
    return Reply.succeed({
        "user": await User.all().count(),
        "department": await Department.all().count(),
    })
