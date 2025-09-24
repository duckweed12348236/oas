from datetime import date, datetime
from typing import Self

from pydantic import Field, model_validator

from models.attendance import LeaveRecordStatus
from schemas import Schema
from schemas.attendance import LeaveRecordTypeOut
from schemas.attendance import UserOut


class PasswordGroup(Schema):
    old_password: str = Field(min_length=6, max_length=20)
    new_password: str = Field(min_length=6, max_length=20)
    confirm_password: str = Field(min_length=6, max_length=20)

    @model_validator(mode="after")
    def validate_password(self) -> Self:
        if self.old_password == self.new_password:
            raise ValueError("新密码与原密码不得一致！")
        if self.new_password != self.confirm_password:
            raise ValueError("新密码与确认密码不一致！")
        return self


class LeaveRecordIn(Schema):
    reason: str
    type_id: int
    begin: date
    end: date


class LeaveRecordOut(Schema):
    id: int
    reason: str
    type_id: int
    type: LeaveRecordTypeOut
    status: LeaveRecordStatus
    approver_id: int | None
    approver: UserOut | None
    begin: date
    end: date
    initiation_time: datetime
    reply: str | None


class NoticeOut(Schema):
    id: int
    title: str
    content: str
    release_time: datetime
    author: UserOut
