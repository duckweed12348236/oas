from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `department` ADD `manager_id` BIGINT;
        ALTER TABLE `department` ADD CONSTRAINT `fk_departme_user_7ca764e2` FOREIGN KEY (`manager_id`) REFERENCES `user` (`id`) ON DELETE SET NULL;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `department` DROP FOREIGN KEY `fk_departme_user_7ca764e2`;
        ALTER TABLE `department` DROP COLUMN `manager_id`;"""
