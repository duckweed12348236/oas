from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `department` MODIFY COLUMN `intro` LONGTEXT;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `department` MODIFY COLUMN `intro` LONGTEXT NOT NULL;"""
