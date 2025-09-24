from enum import IntEnum

from tortoise import Model
from tortoise.fields import CharField, IntEnumField, DateField, BigIntField, IntField, TextField, ForeignKeyField, \
    SET_NULL, RESTRICT


class UserStatus(IntEnum):
    ACTIVE = 1
    LOCKED = 2


class UserPermissionChoice(IntEnum):
    USER = 1
    MANAGER = 2
    ADMINISTRATOR = 3


class User(Model):
    id = BigIntField(primary_key=True, auto_increment=True)
    name = CharField(max_length=150)
    email = CharField(max_length=150, unique=True)
    password = CharField(max_length=20, default="123456")
    telephone = CharField(max_length=20)
    status = IntEnumField(UserStatus, default=UserStatus.ACTIVE)
    date_joined = DateField()
    department_id: int
    department = ForeignKeyField("models.Department", related_name="users", on_delete=RESTRICT)
    permission = IntEnumField(UserPermissionChoice, default=UserPermissionChoice.USER)


class Department(Model):
    id = IntField(primary_key=True, auto_increment=True)
    name = CharField(max_length=100, unique=True)
    intro = TextField(max_length=200, null=True)
    manager_id: int
    manager = ForeignKeyField("models.User", related_name="leading_departments", null=True, on_delete=SET_NULL)
