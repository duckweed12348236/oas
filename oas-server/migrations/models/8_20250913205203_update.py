from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `user` MODIFY COLUMN `status` SMALLINT NOT NULL COMMENT 'ACTIVE: 1\nLOCKED: 2' DEFAULT 1;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `user` MODIFY COLUMN `status` SMALLINT NOT NULL COMMENT 'ACTIVE: 1\nINACTIVE: 2\nLOCKED: 3' DEFAULT 1;"""
