from datetime import datetime

from pydantic import Field

from schemas import Schema
from schemas.attendance import UserOut
from schemas.employee import DepartmentOut


class NoticeIn(Schema):
    title: str = Field(min_length=1, max_length=100)
    content: str = Field(min_length=1)
    department_ids: set[int] = Field(min_length=1)


class NoticeOut(Schema):
    id: int
    title: str
    content: str
    release_time: datetime
    author: UserOut
    departments: list[DepartmentOut]
