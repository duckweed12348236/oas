from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
           CREATE TABLE IF NOT EXISTS `leaverecordtype`
           (
               `id`   INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
               `name` VARCHAR(100) NOT NULL
           ) CHARACTER SET utf8mb4;
           CREATE TABLE IF NOT EXISTS `leaverecord`
           (
               `id`              BIGINT      NOT NULL PRIMARY KEY AUTO_INCREMENT,
               `reason`          LONGTEXT    NOT NULL,
               `status`          SMALLINT    NOT NULL COMMENT 'BEING_APPROVED: 0\nAPPROVED: 1\nREJECTED: 2' DEFAULT 0,
               `begin`           DATE        NOT NULL,
               `end`             DATE        NOT NULL,
               `initiation_time` DATETIME(6) NOT NULL                                                       DEFAULT CURRENT_TIMESTAMP(6),
               `reply`           LONGTEXT,
               `approver_id`     BIGINT,
               `initiator_id`    BIGINT      NOT NULL,
               `type_id`         INT         NOT NULL,
               CONSTRAINT `fk_leaverec_user_3340eade` FOREIGN KEY (`approver_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
               CONSTRAINT `fk_leaverec_user_462c4d33` FOREIGN KEY (`initiator_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
               CONSTRAINT `fk_leaverec_leaverec_bf6289a7` FOREIGN KEY (`type_id`) REFERENCES `leaverecordtype` (`id`) ON DELETE CASCADE
           ) CHARACTER SET utf8mb4; \
           """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS `leaverecord`;
        DROP TABLE IF EXISTS `leaverecordtype`;"""
