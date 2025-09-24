from schemas import Schema
from schemas.attendance import UserOut


class DepartmentOut(Schema):
    id: int
    name: str
    intro: str
    manager_id: int | None = None
    manager: UserOut | None = None


class DepartmentIn(Schema):
    name: str
    intro: str
    manager_id: int | None = None
