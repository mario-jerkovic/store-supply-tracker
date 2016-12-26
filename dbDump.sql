/*
 Navicat Premium Data Transfer

 Source Server         : docker-localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : store_supply

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 12/26/2016 18:34:12 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `article`
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`quantity` int(11) NOT NULL,
	`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT NULL,
	PRIMARY KEY (`id`)
) ENGINE=`InnoDB` AUTO_INCREMENT=16 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ROW_FORMAT=DYNAMIC COMMENT='' CHECKSUM=0 DELAY_KEY_WRITE=0;

-- ----------------------------
--  Records of `article`
-- ----------------------------
BEGIN;
INSERT INTO `article` VALUES ('10', 'Banana', '1000', '2016-09-23 20:21:46', '2016-12-24 20:40:22'), ('11', 'Tomato', '3000', '2016-09-23 20:21:46', '2016-12-24 20:40:28'), ('12', 'Potato', '94000', '2016-09-23 20:21:46', '2016-12-24 20:40:32'), ('13', 'Onion', '6000', '2016-09-23 20:21:46', '2016-12-24 20:40:36'), ('14', 'Orange', '15000', '2016-09-23 20:22:21', '2016-12-24 20:40:43'), ('15', 'Lemon', '14000', '2016-09-23 20:25:26', '2016-12-24 20:40:51');
COMMIT;

-- ----------------------------
--  Table structure for `receipt`
-- ----------------------------
DROP TABLE IF EXISTS `receipt`;
CREATE TABLE `receipt` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`number` varchar(255) NOT NULL,
	`total` int(11) NOT NULL,
	`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT NULL,
	PRIMARY KEY (`id`)
) ENGINE=`InnoDB` AUTO_INCREMENT=7 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ROW_FORMAT=DYNAMIC COMMENT='' CHECKSUM=0 DELAY_KEY_WRITE=0;

-- ----------------------------
--  Records of `receipt`
-- ----------------------------
BEGIN;
INSERT INTO `receipt` VALUES ('3', '10804558', '266580', '2016-09-25 14:48:50', null), ('4', '10704536', '638950', '2016-09-25 14:49:38', null), ('5', '10604480', '545830', '2016-09-25 15:29:51', null), ('6', '10504428', '591910', '2016-09-25 15:30:36', null);
COMMIT;

-- ----------------------------
--  Table structure for `receipt_article`
-- ----------------------------
DROP TABLE IF EXISTS `receipt_article`;
CREATE TABLE `receipt_article` (
	`receipt_id` int(11) NOT NULL,
	`article_id` int(11) NOT NULL,
	PRIMARY KEY (`receipt_id`, `article_id`),
	CONSTRAINT `receipt_article_article_id_fk` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`)  ON UPDATE CASCADE,
	CONSTRAINT `receipt_article_receipt_id_fk` FOREIGN KEY (`receipt_id`) REFERENCES `receipt` (`id`)  ON UPDATE CASCADE,
	INDEX `receipt_article_receipt_id_fk_idx` (`receipt_id`) comment '',
	INDEX `receipt_article_article_id_fk_idx` (`article_id`) comment ''
) ENGINE=`InnoDB` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ROW_FORMAT=DYNAMIC COMMENT='' CHECKSUM=0 DELAY_KEY_WRITE=0;

-- ----------------------------
--  Records of `receipt_article`
-- ----------------------------
BEGIN;
INSERT INTO `receipt_article` VALUES ('3', '10');
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` char(255) NOT NULL,
	`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE `account_id_UNIQUE` (`id`) comment ''
) ENGINE=`InnoDB` AUTO_INCREMENT=1 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ROW_FORMAT=DYNAMIC COMMENT='' CHECKSUM=0 DELAY_KEY_WRITE=0;

SET FOREIGN_KEY_CHECKS = 1;
