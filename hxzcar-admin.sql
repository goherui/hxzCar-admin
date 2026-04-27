/*
 Navicat Premium Dump SQL

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 80408 (8.4.8)
 Source Host           : 115.190.54.31:3306
 Source Schema         : hxzcar-admin

 Target Server Type    : MySQL
 Target Server Version : 80408 (8.4.8)
 File Encoding         : 65001

 Date: 26/04/2026 19:51:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '管理员账号',
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '加密密码',
  `nickname` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '昵称',
  `role` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'operator' COMMENT 'super_admin超级管理员/operator运营员',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '0禁用 1正常',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '运营管理员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_user
-- ----------------------------
INSERT INTO `admin_user` VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', '超级管理员', 'super_admin', 1, '2026-04-24 14:37:42', '2026-04-24 14:37:42');
INSERT INTO `admin_user` VALUES (2, 'operator1', 'e10adc3949ba59abbe56e057f20f883e', '运营小张', 'operator', 1, '2026-04-24 14:40:01', '2026-04-24 14:40:01');
INSERT INTO `admin_user` VALUES (3, 'operator2', 'e10adc3949ba59abbe56e057f20f883e', '运营小李', 'operator', 1, '2026-04-24 14:40:01', '2026-04-24 14:40:01');
INSERT INTO `admin_user` VALUES (4, 'op_chen', 'e10adc3949ba59abbe56e057f20f883e', '运营小陈', 'operator', 1, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `admin_user` VALUES (5, 'op_wang', 'e10adc3949ba59abbe56e057f20f883e', '运营小王', 'operator', 1, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `admin_user` VALUES (6, 'op_li', 'e10adc3949ba59abbe56e057f20f883e', '运营小李', 'operator', 1, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `admin_user` VALUES (7, 'op_zhang', 'e10adc3949ba59abbe56e057f20f883e', '运营小张', 'operator', 1, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `admin_user` VALUES (8, 'audit_admin', 'e10adc3949ba59abbe56e057f20f883e', '审核管理员', 'operator', 1, '2026-04-25 08:49:09', '2026-04-25 08:49:09');

-- ----------------------------
-- Table structure for city_supply_demand
-- ----------------------------
DROP TABLE IF EXISTS `city_supply_demand`;
CREATE TABLE `city_supply_demand`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `city_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '城市名称',
  `city_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '城市编码',
  `online_driver_num` int NOT NULL DEFAULT 0 COMMENT '在线司机数',
  `pending_order_num` int NOT NULL DEFAULT 0 COMMENT '待匹配订单数',
  `supply_status` tinyint NOT NULL DEFAULT 1 COMMENT '0运力不足 1供需平衡 2运力过剩',
  `stat_date` date NOT NULL COMMENT '统计日期',
  `stat_hour` int NOT NULL COMMENT '统计小时 0-23',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_city_stat`(`city_code` ASC, `stat_date` ASC, `stat_hour` ASC) USING BTREE,
  INDEX `idx_stat_date`(`stat_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '城市供需统计表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of city_supply_demand
-- ----------------------------
INSERT INTO `city_supply_demand` VALUES (1, '南京', '320100', 3260, 1850, 1, '2026-04-24', 10, '2026-04-24 14:40:57');
INSERT INTO `city_supply_demand` VALUES (2, '苏州', '320200', 2150, 960, 2, '2026-04-24', 10, '2026-04-24 14:40:57');
INSERT INTO `city_supply_demand` VALUES (3, '无锡', '320300', 1280, 1520, 0, '2026-04-24', 10, '2026-04-24 14:40:57');
INSERT INTO `city_supply_demand` VALUES (4, '常州', '320400', 1560, 1120, 1, '2026-04-24', 11, '2026-04-25 08:49:10');
INSERT INTO `city_supply_demand` VALUES (5, '南通', '320600', 1890, 950, 2, '2026-04-24', 11, '2026-04-25 08:49:10');
INSERT INTO `city_supply_demand` VALUES (6, '徐州', '320300', 1420, 1680, 0, '2026-04-24', 11, '2026-04-25 08:49:10');
INSERT INTO `city_supply_demand` VALUES (7, '盐城', '320900', 1180, 870, 1, '2026-04-24', 11, '2026-04-25 08:49:10');
INSERT INTO `city_supply_demand` VALUES (8, '扬州', '321000', 1350, 760, 2, '2026-04-24', 11, '2026-04-25 08:49:10');
INSERT INTO `city_supply_demand` VALUES (9, '镇江', '321100', 950, 1120, 0, '2026-04-24', 11, '2026-04-25 08:49:10');
INSERT INTO `city_supply_demand` VALUES (10, '泰州', '321200', 1210, 890, 1, '2026-04-24', 11, '2026-04-25 08:49:10');
INSERT INTO `city_supply_demand` VALUES (11, '宿迁', '321300', 870, 650, 2, '2026-04-24', 11, '2026-04-25 08:49:10');
INSERT INTO `city_supply_demand` VALUES (12, '连云港', '320700', 760, 920, 0, '2026-04-24', 11, '2026-04-25 08:49:10');
INSERT INTO `city_supply_demand` VALUES (13, '淮安', '320800', 1080, 910, 1, '2026-04-24', 11, '2026-04-25 08:49:10');

-- ----------------------------
-- Table structure for complaint_ticket
-- ----------------------------
DROP TABLE IF EXISTS `complaint_ticket`;
CREATE TABLE `complaint_ticket`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `ticket_no` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '工单编号',
  `order_id` bigint NOT NULL COMMENT '关联订单ID',
  `order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单编号',
  `driver_id` bigint NOT NULL COMMENT '司机ID',
  `passenger_id` bigint NOT NULL COMMENT '乘客ID',
  `complaint_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '投诉类型：绕路/服务差/无故取消等',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '投诉详情',
  `img_urls` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '图片凭证多图逗号分隔',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '0待处理 1处理中 2已完结 3已关闭',
  `solution` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '处理结果',
  `operator_id` bigint NULL DEFAULT NULL COMMENT '处理管理员ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '投诉时间',
  `resolve_time` datetime NULL DEFAULT NULL COMMENT '完结时间',
  `stat_date` date GENERATED ALWAYS AS (cast(`create_time` as date)) VIRTUAL NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_ticket_no`(`ticket_no` ASC) USING BTREE,
  INDEX `idx_order_id`(`order_id` ASC) USING BTREE,
  INDEX `idx_driver_id`(`driver_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `fk_complaint_passenger`(`passenger_id` ASC) USING BTREE,
  INDEX `fk_complaint_admin`(`operator_id` ASC) USING BTREE,
  INDEX `idx_stat_date`(`stat_date` ASC) USING BTREE,
  CONSTRAINT `fk_complaint_admin` FOREIGN KEY (`operator_id`) REFERENCES `admin_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_complaint_driver` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_complaint_order` FOREIGN KEY (`order_id`) REFERENCES `order_main` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_complaint_passenger` FOREIGN KEY (`passenger_id`) REFERENCES `passenger` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '投诉工单表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of complaint_ticket
-- ----------------------------
INSERT INTO `complaint_ticket` VALUES (1, 'T20260424001', 1, 'ORD202604240001', 1, 1, '绕路多收费', '司机故意绕远路，比平时贵了不少', 'https://xxx/img1.jpg', 2, NULL, 1, '2026-04-24 09:05:20', '2026-04-24 10:12:30', DEFAULT);
INSERT INTO `complaint_ticket` VALUES (2, 'T20260424002', 2, 'ORD202604240002', 2, 2, '服务态度差', '司机语气不好，中途随意停车', NULL, 0, NULL, NULL, '2026-04-24 10:20:15', NULL, DEFAULT);
INSERT INTO `complaint_ticket` VALUES (3, 'T20260424003', 6, 'ORD202604240006', 6, 6, '车内异味', '车内烟味很大，通风差', NULL, 2, NULL, 2, '2026-04-24 13:00:00', '2026-04-24 14:00:00', DEFAULT);
INSERT INTO `complaint_ticket` VALUES (4, 'T20260424004', 7, 'ORD202604240007', 7, 7, '未准时到达', '司机迟到10分钟以上', 'https://xxx/img2.jpg', 2, NULL, 3, '2026-04-24 14:00:00', '2026-04-24 15:00:00', DEFAULT);
INSERT INTO `complaint_ticket` VALUES (5, 'T20260424005', 8, 'ORD202604240008', 8, 8, '路线不熟悉', '司机不认识路，多次绕路', NULL, 1, NULL, NULL, '2026-04-24 15:00:00', NULL, DEFAULT);
INSERT INTO `complaint_ticket` VALUES (6, 'T20260424006', 11, 'ORD202604240011', 11, 11, '服务态度差', '司机全程不耐烦，语气恶劣', NULL, 0, NULL, NULL, '2026-04-24 08:00:00', NULL, DEFAULT);
INSERT INTO `complaint_ticket` VALUES (7, 'T20260424007', 12, 'ORD202604240012', 12, 12, '车内脏乱', '车内垃圾多，座椅脏', NULL, 2, NULL, 4, '2026-04-24 09:00:00', '2026-04-24 10:00:00', DEFAULT);
INSERT INTO `complaint_ticket` VALUES (8, 'T20260424008', 16, 'ORD202604240016', 16, 16, '乱收费', '费用比预估高出很多', NULL, 1, NULL, NULL, '2026-04-24 14:00:00', NULL, DEFAULT);
INSERT INTO `complaint_ticket` VALUES (9, 'T20260424009', 17, 'ORD202604240017', 17, 17, '不文明驾驶', '司机开车玩手机，危险驾驶', 'https://xxx/img3.jpg', 2, NULL, 5, '2026-04-24 15:00:00', '2026-04-24 16:00:00', DEFAULT);
INSERT INTO `complaint_ticket` VALUES (10, 'T20260424010', 21, 'ORD202604240021', 21, 21, '未佩戴口罩', '司机未按规定佩戴口罩', NULL, 0, NULL, NULL, '2026-04-24 09:00:00', NULL, DEFAULT);
INSERT INTO `complaint_ticket` VALUES (11, 'T20260424011', 22, 'ORD202604240022', 22, 22, '拒绝开空调', '天气炎热，司机拒绝开空调', NULL, 2, NULL, 1, '2026-04-24 10:00:00', '2026-04-24 11:00:00', DEFAULT);
INSERT INTO `complaint_ticket` VALUES (12, 'T20260424012', 26, 'ORD202604240026', 2, 1, '强行拼车', '未经过同意，司机强行拼客', NULL, 1, NULL, NULL, '2026-04-24 15:00:00', NULL, DEFAULT);

-- ----------------------------
-- Table structure for coupon
-- ----------------------------
DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `activity_id` bigint NULL DEFAULT NULL COMMENT '所属活动ID',
  `coupon_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '优惠券名称',
  `coupon_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '立减券/折扣券/满减券',
  `denomination` decimal(10, 2) NOT NULL COMMENT '面额/折扣比例',
  `condition_amount` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '使用门槛金额',
  `total_count` int NOT NULL DEFAULT 0 COMMENT '发放总量',
  `send_count` int NOT NULL DEFAULT 0 COMMENT '已发放',
  `used_count` int NOT NULL DEFAULT 0 COMMENT '已使用',
  `valid_days` int NOT NULL DEFAULT 7 COMMENT '有效天数',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '0失效 1正常 2下架',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_activity_id`(`activity_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_coupon_activity` FOREIGN KEY (`activity_id`) REFERENCES `marketing_activity` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '优惠券配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of coupon
-- ----------------------------
INSERT INTO `coupon` VALUES (1, 1, '出行5元立减券', '立减券', 5.00, 20.00, 10000, 6200, 1850, 7, 1, '2026-04-24 14:40:57', '2026-04-24 14:40:57');
INSERT INTO `coupon` VALUES (2, 1, '出行8元立减券', '立减券', 8.00, 30.00, 5000, 2100, 620, 7, 1, '2026-04-24 14:40:57', '2026-04-24 14:40:57');
INSERT INTO `coupon` VALUES (3, 2, '新人9折折扣券', '折扣券', 0.90, 15.00, 8000, 3500, 980, 15, 1, '2026-04-24 14:40:57', '2026-04-24 14:40:57');
INSERT INTO `coupon` VALUES (4, 3, '周末满30减10券', '满减券', 10.00, 30.00, 6000, 0, 0, 10, 0, '2026-04-24 14:40:57', '2026-04-24 14:40:57');
INSERT INTO `coupon` VALUES (5, 4, '五一10元立减券', '立减券', 10.00, 30.00, 20000, 0, 0, 15, 0, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `coupon` VALUES (6, 4, '五一15元立减券', '立减券', 15.00, 50.00, 10000, 0, 0, 15, 0, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `coupon` VALUES (7, 5, '端午满50减15券', '满减券', 15.00, 50.00, 8000, 0, 0, 10, 0, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `coupon` VALUES (8, 6, '老用户8折券', '折扣券', 0.80, 20.00, 5000, 2650, 680, 30, 1, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `coupon` VALUES (9, 7, '企业12元立减券', '立减券', 12.00, 25.00, 15000, 9850, 3240, 60, 1, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `coupon` VALUES (10, 7, '企业20元立减券', '立减券', 20.00, 40.00, 8000, 5120, 1680, 60, 1, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `coupon` VALUES (11, 8, '夜间7折券', '折扣券', 0.70, 15.00, 12000, 7890, 2560, 20, 1, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `coupon` VALUES (12, 8, '夜间5折券', '折扣券', 0.50, 20.00, 6000, 3560, 1120, 20, 1, '2026-04-25 08:49:10', '2026-04-25 08:49:10');

-- ----------------------------
-- Table structure for data_statistics
-- ----------------------------
DROP TABLE IF EXISTS `data_statistics`;
CREATE TABLE `data_statistics`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `stat_date` date NOT NULL COMMENT '统计日期',
  `stat_type` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'day日/week周/month月',
  `order_total` int NOT NULL DEFAULT 0 COMMENT '订单总量',
  `order_complete` int NOT NULL DEFAULT 0 COMMENT '完成订单量',
  `order_cancel` int NOT NULL DEFAULT 0 COMMENT '取消订单量',
  `gmv` decimal(12, 2) NOT NULL DEFAULT 0.00 COMMENT '交易GMV',
  `new_user_num` int NOT NULL DEFAULT 0 COMMENT '新增用户数',
  `active_user_num` int NOT NULL DEFAULT 0 COMMENT '活跃用户数',
  `complete_rate` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '完单率%',
  `cancel_rate` decimal(5, 2) NOT NULL DEFAULT 0.00 COMMENT '取消率%',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_stat_date_type`(`stat_date` ASC, `stat_type` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '运营数据统计表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of data_statistics
-- ----------------------------
INSERT INTO `data_statistics` VALUES (1, '2026-04-23', 'day', 12580, 11260, 1320, 286520.50, 368, 5260, 89.50, 10.50, '2026-04-24 14:40:57');
INSERT INTO `data_statistics` VALUES (2, '2026-04-24', 'day', 8650, 7820, 830, 196850.20, 215, 4120, 90.40, 9.60, '2026-04-24 14:40:57');
INSERT INTO `data_statistics` VALUES (3, '2026-04-20', 'week', 68920, 61580, 7340, 1568920.80, 1860, 21560, 89.30, 10.60, '2026-04-24 14:40:57');
INSERT INTO `data_statistics` VALUES (4, '2026-04-21', 'day', 10250, 9120, 1130, 235680.25, 298, 4520, 89.00, 11.00, '2026-04-25 08:49:10');
INSERT INTO `data_statistics` VALUES (5, '2026-04-22', 'day', 11360, 10150, 1210, 261240.75, 325, 4890, 89.40, 10.60, '2026-04-25 08:49:10');
INSERT INTO `data_statistics` VALUES (6, '2026-04-20', 'month', 186500, 167820, 18680, 4256980.50, 8950, 125600, 89.90, 10.10, '2026-04-25 08:49:10');
INSERT INTO `data_statistics` VALUES (7, '2026-04-15', 'week', 56890, 51240, 5650, 1285690.30, 1560, 18950, 89.90, 10.10, '2026-04-25 08:49:10');
INSERT INTO `data_statistics` VALUES (8, '2026-04-16', 'day', 9850, 8760, 1090, 225360.80, 275, 4310, 88.90, 11.10, '2026-04-25 08:49:10');
INSERT INTO `data_statistics` VALUES (9, '2026-04-17', 'day', 10680, 9580, 1100, 245120.40, 305, 4620, 89.70, 10.30, '2026-04-25 08:49:10');
INSERT INTO `data_statistics` VALUES (10, '2026-04-18', 'day', 11920, 10750, 1170, 275890.20, 345, 4980, 90.20, 9.80, '2026-04-25 08:49:10');
INSERT INTO `data_statistics` VALUES (11, '2026-04-19', 'day', 12850, 11630, 1220, 298560.60, 375, 5260, 90.50, 9.50, '2026-04-25 08:49:10');

-- ----------------------------
-- Table structure for driver
-- ----------------------------
DROP TABLE IF EXISTS `driver`;
CREATE TABLE `driver`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `driver_no` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '司机编号',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '姓名',
  `phone` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `license_plate` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '车牌号',
  `car_model` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '车型',
  `rating` decimal(3, 2) NULL DEFAULT 5.00 COMMENT '服务评分',
  `total_orders` int NOT NULL DEFAULT 0 COMMENT '总接单量',
  `today_income` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '今日收入',
  `service_score` int NOT NULL DEFAULT 100 COMMENT '服务分',
  `audit_status` tinyint NOT NULL DEFAULT 0 COMMENT '0待审核 1审核通过 2审核驳回',
  `online_status` tinyint NOT NULL DEFAULT 0 COMMENT '0离线 1空闲 2行程中',
  `id_card_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '身份证号(脱敏)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_driver_no`(`driver_no` ASC) USING BTREE,
  UNIQUE INDEX `uk_phone`(`phone` ASC) USING BTREE,
  INDEX `idx_audit_status`(`audit_status` ASC) USING BTREE,
  INDEX `idx_online_status`(`online_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '司机信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of driver
-- ----------------------------
INSERT INTO `driver` VALUES (1, 'D001', '王师傅', '13811112222', '苏A12345', '丰田卡罗拉', 4.95, 328, 186.50, 98, 1, 1, NULL, '2026-04-24 14:40:01', '2026-04-24 14:40:01');
INSERT INTO `driver` VALUES (2, 'D002', '李师傅', '13822223333', '苏A23456', '大众朗逸', 4.88, 256, 152.30, 95, 1, 2, NULL, '2026-04-24 14:40:01', '2026-04-24 14:40:01');
INSERT INTO `driver` VALUES (3, 'D003', '张师傅', '13833334444', '苏A34567', '别克英朗', 4.75, 198, 98.60, 92, 1, 0, NULL, '2026-04-24 14:40:01', '2026-04-24 14:40:01');
INSERT INTO `driver` VALUES (4, 'D004', '刘师傅', '13844445555', '苏A45678', '本田思域', 4.90, 412, 235.80, 99, 0, 0, NULL, '2026-04-24 14:40:01', '2026-04-24 14:40:01');
INSERT INTO `driver` VALUES (5, 'D005', '陈师傅', '13855556666', '苏A56789', '日产轩逸', 4.82, 285, 168.90, 96, 2, 0, NULL, '2026-04-24 14:40:01', '2026-04-24 14:40:01');
INSERT INTO `driver` VALUES (6, 'D006', '赵师傅', '13866667777', '苏A67890', '本田雅阁', 4.93, 412, 245.20, 97, 1, 1, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (7, 'D007', '吴师傅', '13877778888', '苏A78901', '大众帕萨特', 4.86, 365, 210.80, 94, 1, 2, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (8, 'D008', '郑师傅', '13888889999', '苏A89012', '丰田凯美瑞', 4.79, 298, 176.50, 91, 1, 0, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (9, 'D009', '孙师傅', '13899990000', '苏A90123', '日产天籁', 4.91, 526, 312.70, 98, 1, 1, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (10, 'D010', '周师傅', '13800001111', '苏A01234', '别克君威', 4.84, 311, 182.30, 95, 1, 2, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (11, 'D011', '冯师傅', '13711112222', '苏B12345', '比亚迪秦', 4.77, 245, 143.90, 92, 0, 0, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (12, 'D012', '陈师傅', '13722223333', '苏B23456', '特斯拉Model3', 4.98, 689, 426.50, 99, 1, 1, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (13, 'D013', '褚师傅', '13733334444', '苏B34567', '奥迪A4L', 4.90, 445, 268.40, 96, 1, 2, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (14, 'D014', '卫师傅', '13744445555', '苏B45678', '宝马3系', 4.83, 377, 221.70, 93, 1, 0, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (15, 'D015', '蒋师傅', '13755556666', '苏B56789', '奔驰C级', 4.76, 289, 169.20, 90, 2, 0, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (16, 'D016', '沈师傅', '13766667777', '苏C12345', '大众ID4', 4.94, 512, 301.80, 97, 1, 1, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (17, 'D017', '韩师傅', '13777778888', '苏C23456', '蔚来ET5', 4.87, 401, 235.10, 94, 1, 2, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (18, 'D018', '杨师傅', '13788889999', '苏C34567', '小鹏P7', 4.80, 332, 194.60, 91, 1, 0, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (19, 'D019', '朱师傅', '13799990000', '苏C45678', '理想L7', 4.92, 578, 346.30, 98, 1, 1, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (20, 'D020', '秦师傅', '13600001111', '苏C56789', '问界M5', 4.85, 389, 229.50, 95, 1, 2, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (21, 'D021', '袁师傅', '13611112222', '苏D12345', '五菱宏光', 4.78, 267, 157.40, 92, 0, 0, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (22, 'D022', '许师傅', '13622223333', '苏D23456', '长安深蓝', 4.96, 634, 387.20, 99, 1, 1, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (23, 'D023', '何师傅', '13633334444', '苏D34567', '大众途观L', 4.89, 423, 253.80, 96, 1, 2, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (24, 'D024', '吕师傅', '13644445555', '苏D45678', '丰田RAV4', 4.82, 354, 211.30, 93, 1, 0, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');
INSERT INTO `driver` VALUES (25, 'D025', '施师傅', '13655556666', '苏D56789', '本田CRV', 4.75, 271, 161.90, 90, 2, 0, NULL, '2026-04-25 08:49:09', '2026-04-25 08:49:09');

-- ----------------------------
-- Table structure for marketing_activity
-- ----------------------------
DROP TABLE IF EXISTS `marketing_activity`;
CREATE TABLE `marketing_activity`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `activity_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '活动名称',
  `activity_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '折扣/立减/裂变/新人券',
  `budget_total` decimal(12, 2) NOT NULL DEFAULT 0.00 COMMENT '总预算',
  `budget_used` decimal(12, 2) NOT NULL DEFAULT 0.00 COMMENT '已用预算',
  `participant_count` int NOT NULL DEFAULT 0 COMMENT '参与人数',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '0草稿 1进行中 2已结束 3已下架',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_time_range`(`start_time` ASC, `end_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '营销活动表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of marketing_activity
-- ----------------------------
INSERT INTO `marketing_activity` VALUES (1, '四月出行立减活动', '立减', 50000.00, 12580.50, 3680, '2026-04-01 00:00:00', '2026-04-30 23:59:59', 1, '2026-04-24 14:40:57', '2026-04-24 14:40:57');
INSERT INTO `marketing_activity` VALUES (2, '新人首单折扣福利', '折扣', 20000.00, 8960.00, 2150, '2026-04-10 00:00:00', '2026-05-10 23:59:59', 1, '2026-04-24 14:40:57', '2026-04-24 14:40:57');
INSERT INTO `marketing_activity` VALUES (3, '周末出行特惠活动', '满减', 30000.00, 0.00, 0, '2026-05-01 00:00:00', '2026-05-15 23:59:59', 0, '2026-04-24 14:40:57', '2026-04-24 14:40:57');
INSERT INTO `marketing_activity` VALUES (4, '五一出行狂欢节', '立减', 100000.00, 0.00, 0, '2026-05-01 00:00:00', '2026-05-07 23:59:59', 0, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `marketing_activity` VALUES (5, '端午特惠礼包', '满减', 40000.00, 0.00, 0, '2026-06-10 00:00:00', '2026-06-12 23:59:59', 0, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `marketing_activity` VALUES (6, '老用户回归福利', '折扣', 30000.00, 5280.70, 1256, '2026-04-15 00:00:00', '2026-04-30 23:59:59', 1, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `marketing_activity` VALUES (7, '企业客户专属', '立减', 80000.00, 23650.25, 5890, '2026-04-01 00:00:00', '2026-06-30 23:59:59', 1, '2026-04-25 08:49:10', '2026-04-25 08:49:10');
INSERT INTO `marketing_activity` VALUES (8, '夜间出行半价', '折扣', 60000.00, 18920.30, 4210, '2026-04-10 00:00:00', '2026-05-10 23:59:59', 1, '2026-04-25 08:49:10', '2026-04-25 08:49:10');

-- ----------------------------
-- Table structure for order_main
-- ----------------------------
DROP TABLE IF EXISTS `order_main`;
CREATE TABLE `order_main`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单编号',
  `passenger_id` bigint NOT NULL COMMENT '乘客ID',
  `driver_id` bigint NULL DEFAULT NULL COMMENT '司机ID',
  `start_addr` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '起点地址',
  `end_addr` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '终点地址',
  `start_lng` decimal(12, 6) NULL DEFAULT NULL COMMENT '起点经度',
  `start_lat` decimal(12, 6) NULL DEFAULT NULL COMMENT '起点纬度',
  `end_lng` decimal(12, 6) NULL DEFAULT NULL COMMENT '终点经度',
  `end_lat` decimal(12, 6) NULL DEFAULT NULL COMMENT '终点纬度',
  `car_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '车型',
  `origin_amount` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '原始预估金额',
  `discount_amount` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '优惠金额',
  `final_amount` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '实付金额',
  `status` tinyint NOT NULL COMMENT '0待接单 1已接单 2行程中 3待支付 4已完成 5已取消',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  `pickup_time` datetime NULL DEFAULT NULL COMMENT '接单时间',
  `start_time` datetime NULL DEFAULT NULL COMMENT '行程开始时间',
  `end_time` datetime NULL DEFAULT NULL COMMENT '行程结束时间',
  `cancel_time` datetime NULL DEFAULT NULL COMMENT '取消时间',
  `cancel_reason` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '取消原因',
  `stat_date` date GENERATED ALWAYS AS (cast(`create_time` as date)) VIRTUAL COMMENT '统计日期' NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_order_no`(`order_no` ASC) USING BTREE,
  INDEX `idx_passenger_id`(`passenger_id` ASC) USING BTREE,
  INDEX `idx_driver_id`(`driver_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_stat_date`(`stat_date` ASC) USING BTREE,
  CONSTRAINT `fk_order_driver` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_order_passenger` FOREIGN KEY (`passenger_id`) REFERENCES `passenger` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '订单主表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_main
-- ----------------------------
INSERT INTO `order_main` VALUES (1, 'ORD202604240001', 1, 1, '南京南站', '新街口商圈', 118.780000, 32.040000, 118.800000, 32.050000, '特惠快车', 28.00, 5.00, 23.00, 4, '2026-04-24 08:10:20', '2026-04-24 08:11:30', '2026-04-24 08:15:00', '2026-04-24 08:32:10', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (2, 'ORD202604240002', 2, 2, '夫子庙', '南京站', 118.790000, 32.030000, 118.820000, 32.060000, '舒适型', 35.00, 8.00, 27.00, 4, '2026-04-24 09:20:15', '2026-04-24 09:21:00', '2026-04-24 09:25:00', '2026-04-24 09:48:20', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (3, 'ORD202604240003', 3, 3, '江宁万达', '南京南站', 118.850000, 31.950000, 118.780000, 32.040000, '特惠快车', 42.00, 6.50, 35.50, 2, '2026-04-24 10:30:40', '2026-04-24 10:32:00', '2026-04-24 10:38:00', NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (4, 'ORD202604240004', 4, NULL, '鼓楼广场', '江北龙湖', 118.770000, 32.050000, 118.650000, 32.200000, '顺风车', 58.00, 10.00, 48.00, 0, '2026-04-24 11:15:30', NULL, NULL, NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (5, 'ORD202604240005', 5, 1, '仙林大学城', '新街口', 118.900000, 32.100000, 118.800000, 32.050000, '舒适型', 32.00, 0.00, 32.00, 5, '2026-04-24 07:40:10', '2026-04-24 07:41:20', NULL, NULL, NULL, '用户临时取消', DEFAULT);
INSERT INTO `order_main` VALUES (6, 'ORD202604240006', 6, 6, '南京禄口机场', '河西万达', 118.850000, 31.980000, 118.790000, 32.030000, '舒适型', 68.00, 12.00, 56.00, 4, '2026-04-24 12:10:20', '2026-04-24 12:11:30', '2026-04-24 12:15:00', '2026-04-24 12:42:10', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (7, 'ORD202604240007', 7, 7, '雨花台', '南京南站', 118.770000, 32.010000, 118.780000, 32.040000, '特惠快车', 32.00, 6.00, 26.00, 4, '2026-04-24 13:20:15', '2026-04-24 13:21:00', '2026-04-24 13:25:00', '2026-04-24 13:48:20', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (8, 'ORD202604240008', 8, 8, '浦口公园', '鼓楼医院', 118.680000, 32.120000, 118.770000, 32.050000, '顺风车', 44.00, 8.00, 36.00, 2, '2026-04-24 14:30:40', '2026-04-24 14:32:00', '2026-04-24 14:38:00', NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (9, 'ORD202604240009', 9, 9, '仙林湖', '南京博物院', 118.950000, 32.130000, 118.810000, 32.040000, '特惠快车', 38.00, 7.00, 31.00, 0, '2026-04-24 15:15:30', NULL, NULL, NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (10, 'ORD202604240010', 10, 10, '江心洲', '奥体中心', 118.720000, 32.060000, 118.790000, 32.030000, '舒适型', 42.00, 0.00, 42.00, 5, '2026-04-24 16:40:10', '2026-04-24 16:41:20', NULL, NULL, NULL, '行程变更取消', DEFAULT);
INSERT INTO `order_main` VALUES (11, 'ORD202604240011', 11, 11, '南京工业大学', '文德路地铁站', 118.560000, 32.080000, 118.590000, 32.070000, '特惠快车', 22.00, 4.00, 18.00, 4, '2026-04-24 07:10:20', '2026-04-24 07:11:30', '2026-04-24 07:15:00', '2026-04-24 07:32:10', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (12, 'ORD202604240012', 12, 12, '南京艺术学院', '江苏大剧院', 118.760000, 32.060000, 118.780000, 32.040000, '舒适型', 36.00, 9.00, 27.00, 4, '2026-04-24 08:20:15', '2026-04-24 08:21:00', '2026-04-24 08:25:00', '2026-04-24 08:48:20', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (13, 'ORD202604240013', 13, 13, '南京科技馆', '雨花客厅', 118.750000, 32.000000, 118.770000, 32.010000, '顺风车', 28.00, 5.00, 23.00, 2, '2026-04-24 09:30:40', '2026-04-24 09:32:00', '2026-04-24 09:38:00', NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (14, 'ORD202604240014', 14, 14, '南京政务服务中心', '奥体东站', 118.790000, 32.030000, 118.780000, 32.040000, '特惠快车', 18.00, 3.00, 15.00, 0, '2026-04-24 10:15:30', NULL, NULL, NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (15, 'ORD202604240015', 15, 15, '南京国际博览中心', '元通站', 118.780000, 32.030000, 118.790000, 32.020000, '舒适型', 26.00, 0.00, 26.00, 5, '2026-04-24 11:40:10', '2026-04-24 11:41:20', NULL, NULL, NULL, '用户主动取消', DEFAULT);
INSERT INTO `order_main` VALUES (16, 'ORD202604240016', 16, 16, '南京商厦', '小市地铁站', 118.800000, 32.080000, 118.810000, 32.070000, '特惠快车', 24.00, 5.00, 19.00, 4, '2026-04-24 13:10:20', '2026-04-24 13:11:30', '2026-04-24 13:15:00', '2026-04-24 13:32:10', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (17, 'ORD202604240017', 17, 17, '南京火车站东广场', '中央门', 118.810000, 32.080000, 118.800000, 32.070000, '舒适型', 30.00, 7.00, 23.00, 4, '2026-04-24 14:20:15', '2026-04-24 14:21:00', '2026-04-24 14:25:00', '2026-04-24 14:48:20', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (18, 'ORD202604240018', 18, 18, '南京长江大桥', '桥北客运站', 118.710000, 32.130000, 118.730000, 32.120000, '顺风车', 36.00, 6.00, 30.00, 2, '2026-04-24 15:30:40', '2026-04-24 15:32:00', '2026-04-24 15:38:00', NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (19, 'ORD202604240019', 19, 19, '南京大屠杀遇难同胞纪念馆', '云锦路站', 118.760000, 32.030000, 118.770000, 32.020000, '特惠快车', 20.00, 4.00, 16.00, 0, '2026-04-24 16:15:30', NULL, NULL, NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (20, 'ORD202604240020', 20, 20, '南京莫愁湖公园', '水西门大街', 118.770000, 32.040000, 118.760000, 32.030000, '舒适型', 28.00, 0.00, 28.00, 5, '2026-04-24 17:40:10', '2026-04-24 17:41:20', NULL, NULL, NULL, '计划改变取消', DEFAULT);
INSERT INTO `order_main` VALUES (21, 'ORD202604240021', 21, 21, '南京清凉山公园', '汉中门大街', 118.760000, 32.050000, 118.770000, 32.040000, '特惠快车', 26.00, 5.00, 21.00, 4, '2026-04-24 08:10:20', '2026-04-24 08:11:30', '2026-04-24 08:15:00', '2026-04-24 08:32:10', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (22, 'ORD202604240022', 22, 22, '南京乌龙潭公园', '省人民医院', 118.760000, 32.040000, 118.770000, 32.050000, '舒适型', 34.00, 8.00, 26.00, 4, '2026-04-24 09:20:15', '2026-04-24 09:21:00', '2026-04-24 09:25:00', '2026-04-24 09:48:20', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (23, 'ORD202604240023', 23, 23, '南京石头城遗址公园', '草场门大街', 118.750000, 32.060000, 118.760000, 32.050000, '顺风车', 32.00, 6.00, 26.00, 2, '2026-04-24 10:30:40', '2026-04-24 10:32:00', '2026-04-24 10:38:00', NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (24, 'ORD202604240024', 24, 24, '南京国防园', '清凉门大街', 118.750000, 32.050000, 118.750000, 32.060000, '特惠快车', 16.00, 3.00, 13.00, 0, '2026-04-24 11:15:30', NULL, NULL, NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (25, 'ORD202604240025', 25, 1, '南京绣球公园', '挹江门', 118.740000, 32.070000, 118.750000, 32.060000, '舒适型', 24.00, 0.00, 24.00, 5, '2026-04-24 12:40:10', '2026-04-24 12:41:20', NULL, NULL, NULL, '临时有事取消', DEFAULT);
INSERT INTO `order_main` VALUES (26, 'ORD202604240026', 1, 2, '南京阅江楼', '建宁路', 118.730000, 32.080000, 118.740000, 32.070000, '特惠快车', 30.00, 6.00, 24.00, 4, '2026-04-24 14:10:20', '2026-04-24 14:11:30', '2026-04-24 14:15:00', '2026-04-24 14:32:10', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (27, 'ORD202604240027', 2, 3, '南京燕子矶公园', '和燕路', 118.780000, 32.150000, 118.730000, 32.080000, '舒适型', 46.00, 10.00, 36.00, 4, '2026-04-24 15:20:15', '2026-04-24 15:21:00', '2026-04-24 15:25:00', '2026-04-24 15:48:20', NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (28, 'ORD202604240028', 3, 4, '南京牛首山风景区', '宁丹大道', 118.800000, 31.900000, 118.850000, 31.950000, '顺风车', 58.00, 12.00, 46.00, 2, '2026-04-24 16:30:40', '2026-04-24 16:32:00', '2026-04-24 16:38:00', NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (29, 'ORD202604240029', 4, 5, '南京方山风景区', '天印大道', 118.880000, 31.920000, 118.800000, 31.900000, '特惠快车', 42.00, 8.00, 34.00, 0, '2026-04-24 17:15:30', NULL, NULL, NULL, NULL, NULL, DEFAULT);
INSERT INTO `order_main` VALUES (30, 'ORD202604240030', 5, 6, '南京珍珠泉风景区', '浦珠北路', 118.630000, 32.150000, 118.680000, 32.120000, '舒适型', 64.00, 0.00, 64.00, 5, '2026-04-24 18:40:10', '2026-04-24 18:41:20', NULL, NULL, NULL, '行程取消', DEFAULT);

-- ----------------------------
-- Table structure for order_status_log
-- ----------------------------
DROP TABLE IF EXISTS `order_status_log`;
CREATE TABLE `order_status_log`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_id` bigint NOT NULL COMMENT '订单ID',
  `order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单编号',
  `status` tinyint NOT NULL COMMENT '订单状态',
  `operator_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户/司机/系统/管理员',
  `operator_id` bigint NULL DEFAULT NULL COMMENT '操作人ID',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注说明',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_order_id`(`order_id` ASC) USING BTREE,
  INDEX `idx_order_no`(`order_no` ASC) USING BTREE,
  INDEX `idx_create_time`(`create_time` ASC) USING BTREE,
  CONSTRAINT `fk_log_order` FOREIGN KEY (`order_id`) REFERENCES `order_main` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '订单状态流水表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_status_log
-- ----------------------------
INSERT INTO `order_status_log` VALUES (1, 1, 'ORD202604240001', 0, '用户', 1, '发起下单', '2026-04-24 14:40:57');
INSERT INTO `order_status_log` VALUES (2, 1, 'ORD202604240001', 1, '司机', 1, '司机接单', '2026-04-24 14:40:57');
INSERT INTO `order_status_log` VALUES (3, 1, 'ORD202604240001', 2, '司机', 1, '行程开始', '2026-04-24 14:40:57');
INSERT INTO `order_status_log` VALUES (4, 1, 'ORD202604240001', 4, '司机', 1, '行程结束订单完成', '2026-04-24 14:40:57');
INSERT INTO `order_status_log` VALUES (5, 2, 'ORD202604240002', 0, '用户', 2, '发起下单', '2026-04-24 14:40:57');
INSERT INTO `order_status_log` VALUES (6, 2, 'ORD202604240002', 1, '司机', 2, '司机接单', '2026-04-24 14:40:57');
INSERT INTO `order_status_log` VALUES (7, 3, 'ORD202604240003', 0, '用户', 3, '发起下单', '2026-04-24 14:40:57');
INSERT INTO `order_status_log` VALUES (8, 3, 'ORD202604240003', 2, '司机', 3, '行程进行中', '2026-04-24 14:40:57');
INSERT INTO `order_status_log` VALUES (9, 6, 'ORD202604240006', 0, '用户', 6, '发起下单', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (10, 6, 'ORD202604240006', 1, '司机', 6, '司机接单', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (11, 6, 'ORD202604240006', 2, '司机', 6, '行程开始', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (12, 6, 'ORD202604240006', 4, '司机', 6, '订单完成', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (13, 7, 'ORD202604240007', 0, '用户', 7, '发起下单', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (14, 7, 'ORD202604240007', 1, '司机', 7, '司机接单', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (15, 8, 'ORD202604240008', 0, '用户', 8, '发起下单', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (16, 8, 'ORD202604240008', 2, '司机', 8, '行程中', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (17, 9, 'ORD202604240009', 0, '用户', 9, '待接单', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (18, 10, 'ORD202604240010', 5, '系统', 5, '订单取消', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (19, 11, 'ORD202604240011', 4, '司机', 11, '订单完成', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (20, 12, 'ORD202604240012', 4, '司机', 12, '订单完成', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (21, 13, 'ORD202604240013', 2, '司机', 13, '行程中', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (22, 14, 'ORD202604240014', 0, '用户', 14, '待接单', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (23, 15, 'ORD202604240015', 5, '用户', 15, '主动取消', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (24, 16, 'ORD202604240016', 4, '司机', 16, '订单完成', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (25, 17, 'ORD202604240017', 4, '司机', 17, '订单完成', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (26, 18, 'ORD202604240018', 2, '司机', 18, '行程中', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (27, 19, 'ORD202604240019', 0, '用户', 19, '待接单', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (28, 20, 'ORD202604240020', 5, '用户', 20, '主动取消', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (29, 21, 'ORD202604240021', 4, '司机', 21, '订单完成', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (30, 22, 'ORD202604240022', 4, '司机', 22, '订单完成', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (31, 23, 'ORD202604240023', 2, '司机', 23, '行程中', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (32, 24, 'ORD202604240024', 0, '用户', 24, '待接单', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (33, 25, 'ORD202604240025', 5, '用户', 25, '主动取消', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (34, 26, 'ORD202604240026', 4, '司机', 2, '订单完成', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (35, 27, 'ORD202604240027', 4, '司机', 3, '订单完成', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (36, 28, 'ORD202604240028', 2, '司机', 4, '行程中', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (37, 29, 'ORD202604240029', 0, '用户', 5, '待接单', '2026-04-25 08:49:10');
INSERT INTO `order_status_log` VALUES (38, 30, 'ORD202604240030', 5, '用户', 6, '主动取消', '2026-04-25 08:49:10');

-- ----------------------------
-- Table structure for passenger
-- ----------------------------
DROP TABLE IF EXISTS `passenger`;
CREATE TABLE `passenger`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `phone` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `nickname` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像地址',
  `total_orders` int NOT NULL DEFAULT 0 COMMENT '累计订单数',
  `total_consumption` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '累计消费',
  `balance` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '账户余额',
  `member_level` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'V1' COMMENT '会员等级',
  `register_date` date NOT NULL COMMENT '注册日期',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '0禁用 1正常',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_phone`(`phone` ASC) USING BTREE,
  INDEX `idx_member_level`(`member_level` ASC) USING BTREE,
  INDEX `idx_register_date`(`register_date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '乘客用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of passenger
-- ----------------------------
INSERT INTO `passenger` VALUES (1, '13911110001', '晚风', 'https://xxx/avatar1.png', 35, 989.50, 428.50, 'V3', '2025-01-12', 0, '2026-04-24 14:40:01', '2026-04-25 11:00:14');
INSERT INTO `passenger` VALUES (2, '13911110002', '星河', 'https://xxx/avatar2.png', 18, 326.20, 86.30, 'V2', '2025-02-05', 1, '2026-04-24 14:40:01', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (3, '13911110003', '木木', 'https://xxx/avatar3.png', 62, 1258.80, 359.80, 'V4', '2024-11-20', 1, '2026-04-24 14:40:01', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (4, '13911110004', '阿泽', 'https://xxx/avatar4.png', 9, 156.00, 25.00, 'V1', '2026-03-10', 1, '2026-04-24 14:40:01', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (5, '13911110005', '小夏', 'https://xxx/avatar5.png', 27, 520.30, 168.90, 'V2', '2025-08-15', 0, '2026-04-24 14:40:01', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (6, '13911110006', '星辰', 'https://xxx/avatar6.png', 42, 826.30, 215.60, 'V3', '2025-01-15', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (7, '13911110007', '月亮', 'https://xxx/avatar7.png', 23, 418.60, 96.20, 'V2', '2025-02-10', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (8, '13911110008', '阳光', 'https://xxx/avatar8.png', 78, 1589.20, 428.70, 'V4', '2024-12-05', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (9, '13911110009', '微风', 'https://xxx/avatar9.png', 14, 247.80, 36.80, 'V1', '2026-03-15', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (10, '13911110010', '彩虹', 'https://xxx/avatar10.png', 33, 635.10, 152.40, 'V2', '2025-09-20', 0, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (11, '13911110011', '白云', 'https://xxx/avatar11.png', 56, 1107.40, 298.30, 'V3', '2025-01-20', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (12, '13911110012', '蓝天', 'https://xxx/avatar12.png', 29, 553.70, 105.70, 'V2', '2025-03-12', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (13, '13911110013', '大海', 'https://xxx/avatar13.png', 91, 1842.60, 526.90, 'V4', '2024-10-18', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (14, '13911110014', '森林', 'https://xxx/avatar14.png', 11, 192.30, 72.50, 'V1', '2026-03-20', 0, '2026-04-25 08:49:09', '2026-04-25 11:57:39');
INSERT INTO `passenger` VALUES (15, '13911110015', '沙漠', 'https://xxx/avatar15.png', 38, 741.80, 189.60, 'V3', '2025-10-11', 0, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (16, '13911110016', '青山', 'https://xxx/avatar16.png', 49, 958.20, 245.80, 'V3', '2025-01-25', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (17, '13911110017', '绿水', 'https://xxx/avatar17.png', 27, 516.90, 92.30, 'V2', '2025-04-15', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (18, '13911110018', '飞鸟', 'https://xxx/avatar18.png', 85, 1723.50, 486.50, 'V4', '2024-11-25', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (19, '13911110019', '游鱼', 'https://xxx/avatar19.png', 17, 308.40, 28.60, 'V1', '2026-03-25', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (20, '13911110020', '落叶', 'https://xxx/avatar20.png', 35, 679.60, 135.70, 'V2', '2025-11-15', 0, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (21, '13911110021', '飞雪', 'https://xxx/avatar21.png', 63, 1224.70, 268.40, 'V3', '2025-02-01', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (22, '13911110022', '寒霜', 'https://xxx/avatar22.png', 31, 594.20, 112.80, 'V2', '2025-05-10', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (23, '13911110023', '雷电', 'https://xxx/avatar23.png', 97, 1968.30, 598.20, 'V4', '2024-09-30', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (24, '13911110024', '云雾', 'https://xxx/avatar24.png', 9, 159.10, 19.90, 'V1', '2026-03-30', 1, '2026-04-25 08:49:09', '2026-04-25 10:47:05');
INSERT INTO `passenger` VALUES (25, '13911110025', '冰霜', 'https://xxx/avatar25.png', 44, 853.40, 175.30, 'V3', '2025-12-01', 0, '2026-04-25 08:49:09', '2026-04-25 10:47:05');

-- ----------------------------
-- Table structure for pricing_rule
-- ----------------------------
DROP TABLE IF EXISTS `pricing_rule`;
CREATE TABLE `pricing_rule`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `city_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '城市编码',
  `city_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '城市名称',
  `car_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '车型',
  `base_fare` decimal(10, 2) NOT NULL COMMENT '起步价',
  `distance_unit_price` decimal(10, 2) NOT NULL COMMENT '里程费/公里',
  `time_unit_price` decimal(10, 2) NOT NULL COMMENT '时长费/分钟',
  `night_start` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '23:00' COMMENT '夜间开始时间',
  `night_end` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '06:00' COMMENT '夜间结束时间',
  `night_rate` decimal(3, 1) NOT NULL DEFAULT 1.2 COMMENT '夜间倍率',
  `dynamic_rate` decimal(3, 1) NOT NULL DEFAULT 1.0 COMMENT '动态调价倍率',
  `version` int NOT NULL DEFAULT 1 COMMENT '规则版本号',
  `operator_id` bigint NOT NULL COMMENT '操作管理员ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_city_car_type`(`city_code` ASC, `car_type` ASC) USING BTREE,
  INDEX `idx_city_name`(`city_name` ASC) USING BTREE,
  INDEX `fk_pricing_admin`(`operator_id` ASC) USING BTREE,
  CONSTRAINT `fk_pricing_admin` FOREIGN KEY (`operator_id`) REFERENCES `admin_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '计价规则表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pricing_rule
-- ----------------------------
INSERT INTO `pricing_rule` VALUES (1, '320100', '南京', '特惠快车', 8.00, 1.80, 0.50, '23:00', '06:00', 1.2, 1.0, 1, 1, '2026-04-24 14:40:57', '2026-04-24 14:40:57');
INSERT INTO `pricing_rule` VALUES (2, '320100', '南京', '舒适型', 12.00, 2.50, 0.60, '23:00', '06:00', 1.3, 1.0, 1, 1, '2026-04-24 14:40:57', '2026-04-24 14:40:57');
INSERT INTO `pricing_rule` VALUES (3, '320100', '南京', '顺风车', 6.00, 1.20, 0.40, '23:00', '06:00', 1.1, 0.9, 1, 1, '2026-04-24 14:40:57', '2026-04-24 14:40:57');
INSERT INTO `pricing_rule` VALUES (4, '320200', '苏州', '特惠快车', 7.50, 1.70, 0.45, '23:00', '06:00', 1.2, 1.0, 1, 1, '2026-04-24 14:40:57', '2026-04-24 14:40:57');

SET FOREIGN_KEY_CHECKS = 1;
