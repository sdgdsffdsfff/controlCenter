CREATE DATABASE  IF NOT EXISTS `llmofang_cc` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `llmofang_cc`;
-- MySQL dump 10.13  Distrib 5.5.41, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: llmofang_cc
-- ------------------------------------------------------
-- Server version	5.5.41-0ubuntu0.14.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `app_data_rule`
--

DROP TABLE IF EXISTS `app_data_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_data_rule` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `app_id` int(10) NOT NULL,
  `app_dr_type` tinyint(1) NOT NULL,
  `app_dr_amount` int(10) NOT NULL,
  `app_dr_duration` int(10) NOT NULL,
  `app_dr_create_time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_app_data_rule_1_idx` (`app_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_data_rule`
--

LOCK TABLES `app_data_rule` WRITE;
/*!40000 ALTER TABLE `app_data_rule` DISABLE KEYS */;
INSERT INTO `app_data_rule` VALUES (7,1,0,524288000,10368000,1433018119),(8,0,0,10368000,10368000,1433018119),(9,2,0,10485760,10368000,1426409041),(33,3,0,1048576000,2592000,1426514776);
/*!40000 ALTER TABLE `app_data_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apps`
--

DROP TABLE IF EXISTS `apps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_customer_id` int(10) NOT NULL,
  `app_is_disabled` tinyint(1) NOT NULL DEFAULT '0',
  `app_name` varchar(50) NOT NULL,
  `app_id` varchar(100) NOT NULL,
  `app_key` varchar(100) NOT NULL,
  `app_icon` varchar(100) DEFAULT NULL,
  `app_intro` varchar(255) DEFAULT NULL,
  `app_create_time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_apps_1_idx` (`app_customer_id`),
  CONSTRAINT `fk_apps_1` FOREIGN KEY (`app_customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apps`
--

LOCK TABLES `apps` WRITE;
/*!40000 ALTER TABLE `apps` DISABLE KEYS */;
INSERT INTO `apps` VALUES (1,1,0,'ＷＩＦＩ万能钥匙','tc6nvipyaigwb0ukjuhcj3kz8n8xmig5r2jf0oa4gg25ou61','vdax1anbo1v1y5iga4n9jdrdkvmo43zeu4tvlx1ahxk4ftxm','/images/index.png','WiFi万能钥匙，一款帮助用户随身连接免费wifi热点的工具，支持安卓、IOS移动设备，支持电脑解锁连接附近共享WiFi，下载安装后可获得像手机端同样的连接WiFi体验，使用户能够实现任何地方不断网，享受丰富多彩的互联网生活.',1419960695),(2,1,0,'捕鱼达人３','5944023d2931cc131abd646e644f3dfcd4d2969ca10a4a36c75d57e39638e9d62dc12c541585486aae1676d90da3087a','021141914d8a2f7bd06cdd9d8caf613b3a6066e1103b8a9f09a9cbceda7059840e717971d43ea961a5e3c4f5d18cdea0','/images/index2.png','捕鱼达人3是一款益智休闲类的小游戏。首次安卓版不仅拥有丰富的捕鱼场景，也有新鲜的画面视觉体验。',1425284935),(3,1,0,'联连WiFi2','0074eac0e4d199721bbcbb02d51e9b958879ade0692e1ba6ce6d073f7f95f5f007a48b856820b2b0082816cb51c56d70','fd27c48754442af51ae31ea6673d9731c2d059ac8141bff4b20b3704ced1444233dbb369a45fe62a59c305108a4dea28','','联连免费WiFi—万能的免费上网神器，是一款帮助您随时随地实现上网需求的WiFi热点连接工具，无需消耗您的上网流量。安全性高、覆盖广、操作简单，是智能手机用户的必备App应用。',1425287139);
/*!40000 ALTER TABLE `apps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_username` varchar(45) NOT NULL,
  `customer_password` varchar(45) NOT NULL,
  `customer_create_time` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'wengcan','e3ceb5881a0a1fdaad01296d7554868d',1419960695);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers_apps`
--

DROP TABLE IF EXISTS `customers_apps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers_apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ca_customer_id` int(10) NOT NULL,
  `ca_app_id` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_customers_apps_1_idx` (`ca_customer_id`),
  KEY `fk_customers_apps_2_idx` (`ca_app_id`),
  CONSTRAINT `fk_customers_apps_1` FOREIGN KEY (`ca_customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_customers_apps_2` FOREIGN KEY (`ca_app_id`) REFERENCES `apps` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers_apps`
--

LOCK TABLES `customers_apps` WRITE;
/*!40000 ALTER TABLE `customers_apps` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers_apps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers_info`
--

DROP TABLE IF EXISTS `customers_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers_info` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `customer_id` int(10) NOT NULL,
  `customer_name` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `customer_phone` varchar(45) DEFAULT NULL,
  `customer_company` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `customer_address` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `customer_title` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `customer_website` varchar(100) DEFAULT NULL,
  `customer_notify_email` varchar(100) DEFAULT NULL,
  `customer_notify_phone` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_customer_info_1_idx` (`customer_id`),
  CONSTRAINT `fk_customer_info_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers_info`
--

LOCK TABLES `customers_info` WRITE;
/*!40000 ALTER TABLE `customers_info` DISABLE KEYS */;
INSERT INTO `customers_info` VALUES (6,1,'翁灿','13262261650','流量魔方','上海市松江区沪亭北路618弄79#901','流量魔方','llmofang.com','572037922@qq.com','13262261650');
/*!40000 ALTER TABLE `customers_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_customers`
--

DROP TABLE IF EXISTS `data_customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data_ca_id` int(10) NOT NULL,
  `data_time_start` int(10) NOT NULL,
  `data_time_end` int(10) NOT NULL,
  `data_data_total` int(10) NOT NULL DEFAULT '0',
  `data_data_usage` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_data_customers_1_idx` (`data_ca_id`),
  CONSTRAINT `fk_data_customers_1` FOREIGN KEY (`data_ca_id`) REFERENCES `customers_apps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_customers`
--

LOCK TABLES `data_customers` WRITE;
/*!40000 ALTER TABLE `data_customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_packages`
--

DROP TABLE IF EXISTS `data_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_packages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data_user_id` int(10) NOT NULL,
  `data_time_start` int(10) NOT NULL,
  `data_time_end` int(10) NOT NULL,
  `data_data_total` int(15) NOT NULL DEFAULT '0',
  `data_data_usage` int(15) NOT NULL DEFAULT '0',
  `data_is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_data_packages_1_idx` (`data_user_id`),
  CONSTRAINT `fk_data_packages_1` FOREIGN KEY (`data_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_packages`
--

LOCK TABLES `data_packages` WRITE;
/*!40000 ALTER TABLE `data_packages` DISABLE KEYS */;
INSERT INTO `data_packages` VALUES (17,15,1426655841,1437023841,10368000,0,1),(18,16,1427332526,1437700526,10368000,0,1);
/*!40000 ALTER TABLE `data_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_users`
--

DROP TABLE IF EXISTS `data_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data_user_id` int(10) NOT NULL,
  `data_app_id` int(10) NOT NULL,
  `data_time_start` int(10) NOT NULL,
  `data_time_end` int(10) NOT NULL,
  `data_data_total` int(10) NOT NULL DEFAULT '0',
  `data_data_usage` int(10) NOT NULL DEFAULT '0',
  `data_is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_data_users_1_idx` (`data_user_id`),
  KEY `fk_data_users_2_idx` (`data_app_id`),
  CONSTRAINT `fk_data_users_1` FOREIGN KEY (`data_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_data_users_2` FOREIGN KEY (`data_app_id`) REFERENCES `apps` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_users`
--

LOCK TABLES `data_users` WRITE;
/*!40000 ALTER TABLE `data_users` DISABLE KEYS */;
INSERT INTO `data_users` VALUES (2,7,1,1426476345,1451577600,104857600,0,1),(5,15,1,1426655841,1437023841,524288000,0,1),(6,16,1,1427332526,1437700526,524288000,0,1);
/*!40000 ALTER TABLE `data_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_whitelist`
--

DROP TABLE IF EXISTS `domain_whitelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain_whitelist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dw_app_id` int(10) NOT NULL,
  `dw_ruler` varchar(45) NOT NULL,
  `dw_create_time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_domain_whitelist_1_idx` (`dw_app_id`),
  CONSTRAINT `fk_domain_whitelist_1` FOREIGN KEY (`dw_app_id`) REFERENCES `apps` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_whitelist`
--

LOCK TABLES `domain_whitelist` WRITE;
/*!40000 ALTER TABLE `domain_whitelist` DISABLE KEYS */;
INSERT INTO `domain_whitelist` VALUES (1,1,'',1423076276),(2,2,'10.0.0.1',1423076339),(9,3,'10.1.1.1',1426561931);
/*!40000 ALTER TABLE `domain_whitelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) NOT NULL,
  `user_sdk_version` char(10) DEFAULT NULL,
  `user_phone_number` bigint(11) DEFAULT NULL,
  `user_phone_system` varchar(45) DEFAULT NULL,
  `user_phone_imei` char(32) DEFAULT NULL,
  `user_card_imsi` char(32) NOT NULL,
  `user_create_time` int(10) NOT NULL,
  `user_is_disabled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (7,'d75a7d4eff4eea4db33ed759ba79996d',NULL,NULL,NULL,NULL,'89014103211118510720',1423463229,0),(15,'ee7f7beea9996f3f9c61dcf18438136d','1.0.0',NULL,'Android','89860114840601022364','460011929818958',1426655841,0),(16,'12e9aaac2d52311a4ff70f8c7575c4c7','1.0.0',15555215554,'Android','89014103211118510720','310260000000000',1427332526,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-04-10 14:04:56
