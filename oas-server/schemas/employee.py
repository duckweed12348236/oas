from datetime import date

from pydantic import Field, EmailStr

from schemas import Schema
from models.user import UserStatus, UserPermissionChoice


class Account(Schema):
    email: EmailStr = Field(min_length=1)
    password: str = Field(min_length=1, max_length=20)


class UserOut(Schema):
    id: int
    name: str
    email: str
    password: str
    telephone: str
    status: UserStatus
    date_joined: date
    department_id: int
    department: "DepartmentOut"
    permission: UserPermissionChoice


class DepartmentOut(Schema):
    id: int
    name: str


class UserIn(Schema):
    name: str = Field(min_length=1, max_length=150)
    email: str = Field(min_length=1, max_length=150)
    password: str = Field("123456", max_length=20)
    telephone: str = Field(min_length=1, max_length=20)
    status: UserStatus
    date_joined: date
    department_id: int | None = Field(None, gt=0)
