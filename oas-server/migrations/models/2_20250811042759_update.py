from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS `notice` (
    `id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `release_time` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `author_id` BIGINT NOT NULL,
    CONSTRAINT `fk_notice_user_0835b164` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;
        ALTER TABLE `user` ADD `permission` SMALLINT NOT NULL COMMENT 'USER: 1\nADMINISTRATOR: 2\nSUPER_ADMINISTRATOR: 3' DEFAULT 1;
        CREATE TABLE `notice_department` (
    `department_id` INT NOT NULL REFERENCES `department` (`id`) ON DELETE CASCADE,
    `notice_id` BIGINT NOT NULL REFERENCES `notice` (`id`) ON DELETE CASCADE
) CHARACTER SET utf8mb4;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS `notice_department`;
        ALTER TABLE `user` DROP COLUMN `permission`;
        DROP TABLE IF EXISTS `notice`;"""
