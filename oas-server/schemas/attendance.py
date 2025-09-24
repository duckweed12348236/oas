from datetime import date, datetime
from typing import Literal

from pydantic import Field

from models.attendance import LeaveRecordStatus
from schemas import Schema


class LeaveRecordApproval(Schema):
    id: int = Field(gt=0)
    status: Literal[1, 2]
    reply: str | None = None


class LeaveRecordTypeOut(Schema):
    id: int
    name: str


class UserOut(Schema):
    id: int
    name: str


class LeaveRecordOut(Schema):
    id: int
    reason: str
    type_id: int
    type: LeaveRecordTypeOut
    status: LeaveRecordStatus
    initiator_id: int
    initiator: UserOut
    approver_id: int | None
    approver: UserOut | None
    begin: date
    end: date
    initiation_time: datetime
    reply: str | None
