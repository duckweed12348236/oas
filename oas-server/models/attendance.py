from enum import IntEnum

from tortoise import Model
from tortoise.fields import BigIntField, ForeignKeyField, IntEnumField, DatetimeField, TextField, IntField, CharField, \
    DateField


# class ClockInRecordType(IntEnum):
#     NORMAL = 1
#     LATENESS = 2
#     ABSENTEEISM = 3
#     LEAVE = 4
#
#
# class ClockInRecord(Model):
#     id = BigIntField(primary_key=True, auto_increment=True)
#     type = IntEnumField(ClockInRecordType, default=ClockInRecordType.NORMAL)
#     time = DatetimeField(auto_now_add=True)
#     user_id: int
#     user = ForeignKeyField("models.User", "clock_in_records")


class LeaveRecordType(Model):
    id = IntField(primary_key=True, auto_increment=True)
    name = CharField(max_length=100)

    class Meta:
        table = "leave_record_type"


class LeaveRecordStatus(IntEnum):
    BEING_APPROVED = 0
    APPROVED = 1
    REJECTED = 2


class LeaveRecord(Model):
    id = BigIntField(primary_key=True, auto_increment=True)
    reason = TextField()
    type_id: int
    type = ForeignKeyField("models.LeaveRecordType", "leave_records")
    status = IntEnumField(LeaveRecordStatus, default=LeaveRecordStatus.BEING_APPROVED)
    initiator_id: int
    initiator = ForeignKeyField("models.User", "initiated_leave_records")
    approver_id: int
    approver = ForeignKeyField("models.User", "approved_leave_records", null=True)
    begin = DateField()
    end = DateField()
    initiation_time = DatetimeField(auto_now_add=True)
    reply = TextField(null=True)

    class Meta:
        table = "leave_record"
