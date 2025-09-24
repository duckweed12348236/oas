from pydantic import Field

from models.user import UserPermissionChoice
from schemas import Schema
from schemas.employee import DepartmentOut


class UserOut(Schema):
    id: int
    name: str
    email: str
    permission: int
    department_id: int
    department: DepartmentOut


class UserPermissionAssignment(Schema):
    uid: int = Field(gt=0)
    permission: UserPermissionChoice
