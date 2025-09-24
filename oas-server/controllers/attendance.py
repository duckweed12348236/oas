from fastapi import APIRouter, Query, Request
from tortoise.transactions import in_transaction

from models.attendance import LeaveRecordType, LeaveRecord
from schemas.attendance import LeaveRecordTypeOut, LeaveRecordApproval, LeaveRecordOut
from schemas.reply import Reply, Pagination

router = APIRouter(prefix="/attendance")


@router.get("/leave-record-type")
async def list_leave_record_types() -> Reply[list[LeaveRecordTypeOut]]:
    leave_record_types = await LeaveRecordType.all()
    return Reply.succeed([LeaveRecordTypeOut.model_validate(x) for x in leave_record_types])


@router.get("/leave-record")
async def list_leave_records(request: Request,
                             page: int = Query(1, gt=0),
                             size: int = Query(25, gt=0)) -> Reply[Pagination[list[LeaveRecordOut]]]:
    async with in_transaction():
        leave_records = await (LeaveRecord.filter().all().limit(size).offset(
            (page - 1) * size).select_related("initiator", "approver", "type"))
        if not leave_records:
            return Reply.fail("没有请假记录！")
        total = await LeaveRecord.all().count()
    return Reply.paginate([LeaveRecordOut.model_validate(x) for x in leave_records], total, page, size)


@router.post("/leave-record")
async def handle_leave_record(request: Request,
                              leave_record_approval: LeaveRecordApproval) -> Reply[None | LeaveRecordOut]:
    async with in_transaction():
        leave_record = await LeaveRecord.filter(id=leave_record_approval.id).first()
        if not leave_record:
            return Reply.fail("不存在该请假记录！")
        leave_record.status = leave_record_approval.status
        leave_record.approver_id = request.state.user.id
        leave_record.reply = leave_record_approval.reply
        await leave_record.save()
        leave_record = await LeaveRecord.filter(id=leave_record.id).first().select_related("initiator",
                                                                                           "approver",
                                                                                           "type")
    return Reply.succeed(LeaveRecordOut.model_validate(leave_record))
