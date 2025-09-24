from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `leaverecord` RENAME TO `leave_record`;
        ALTER TABLE `leaverecordtype` RENAME TO `leave_record_type`;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `leave_record` RENAME TO `leaverecord`;
        ALTER TABLE `leave_record_type` RENAME TO `leaverecordtype`;"""
