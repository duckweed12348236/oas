from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `user` MODIFY COLUMN `permission` SMALLINT NOT NULL COMMENT 'USER: 1\nMANAGER: 2\nADMINISTRATOR: 3' DEFAULT 1;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `user` MODIFY COLUMN `permission` SMALLINT NOT NULL COMMENT 'USER: 1\nADMINISTRATOR: 2\nSUPER_ADMINISTRATOR: 3' DEFAULT 1;"""
