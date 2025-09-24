from fastapi import APIRouter, Request, Query, Path
from tortoise.transactions import in_transaction

from models.user import Department, User, UserPermissionChoice
from schemas.department import DepartmentOut, DepartmentIn
from schemas.attendance import UserOut
from schemas.reply import Reply

router = APIRouter(prefix="/department")


@router.get("")
async def list_departments():
    departments = await Department.all().select_related("manager")
    return Reply.succeed([DepartmentOut.model_validate(x) for x in departments])


@router.post("")
async def create_department(department_in: DepartmentIn):
    async with in_transaction():
        department = await Department.create(**department_in.model_dump(exclude={"manager_id"}))
        department = await Department.filter(id=department.id).first().select_related("manager")
    return Reply.succeed(DepartmentOut.model_validate(department))


@router.put("/{id}")
async def update_department(department_in: DepartmentIn, id: int = Path(gt=0)):
    attrs = department_in.model_dump()
    keys = attrs.keys()
    department = Department(**attrs, id=id)
    async with in_transaction():
        await department.save(update_fields=keys)
        department = await Department.filter(id=department.id).first().select_related("manager")
    return Reply.succeed(DepartmentOut.model_validate(department))


@router.get("/user")
async def list_users(department_id: int = Query(gt=0)):
    users = await User.filter(department_id=department_id).all()
    return Reply.succeed([UserOut.model_validate(x) for x in users])
