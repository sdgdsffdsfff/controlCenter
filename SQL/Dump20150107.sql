CREATE DATABASE  IF NOT EXISTS `llmofang_cc` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `llmofang_cc`;
-- MySQL dump 10.13  Distrib 5.5.40, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: llmofang_cc
-- ------------------------------------------------------
-- Server version	5.5.40-0ubuntu1

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
  `app_data_rule_type` tinyint(1) NOT NULL,
  `app_data_rule_amount` int(10) NOT NULL,
  `app_data_rule_create_time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_app_data_rule_1_idx` (`app_id`),
  CONSTRAINT `fk_app_data_rule_1` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_data_rule`
--

LOCK TABLES `app_data_rule` WRITE;
/*!40000 ALTER TABLE `app_data_rule` DISABLE KEYS */;
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
  `app_create_time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_apps_1_idx` (`app_customer_id`),
  CONSTRAINT `fk_apps_1` FOREIGN KEY (`app_customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apps`
--

LOCK TABLES `apps` WRITE;
/*!40000 ALTER TABLE `apps` DISABLE KEYS */;
INSERT INTO `apps` VALUES (1,1,0,'first_app','tc6nvipyaigwb0ukjuhcj3kz8n8xmig5r2jf0oa4gg25ou61','vdax1anbo1v1y5iga4n9jdrdkvmo43zeu4tvlx1ahxk4ftxm',1419960695);
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
  CONSTRAINT `fk_data_customers_1` FOREIGN KEY (`data_ca_id`) REFERENCES `customers_apps` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
  PRIMARY KEY (`id`),
  KEY `fk_data_packages_1_idx` (`data_user_id`),
  CONSTRAINT `fk_data_packages_1` FOREIGN KEY (`data_user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_packages`
--

LOCK TABLES `data_packages` WRITE;
/*!40000 ALTER TABLE `data_packages` DISABLE KEYS */;
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
  CONSTRAINT `fk_data_users_1` FOREIGN KEY (`data_user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_data_users_2` FOREIGN KEY (`data_app_id`) REFERENCES `apps` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_users`
--

LOCK TABLES `data_users` WRITE;
/*!40000 ALTER TABLE `data_users` DISABLE KEYS */;
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
  `dw_ip_or_domain` varchar(45) NOT NULL,
  `dw_create_time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_domain_whitelist_1_idx` (`dw_app_id`),
  CONSTRAINT `fk_domain_whitelist_1` FOREIGN KEY (`dw_app_id`) REFERENCES `apps` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_whitelist`
--

LOCK TABLES `domain_whitelist` WRITE;
/*!40000 ALTER TABLE `domain_whitelist` DISABLE KEYS */;
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
  `user_phone_numner` bigint(11) DEFAULT NULL,
  `user_hashed_iemi` char(32) DEFAULT NULL,
  `user_hashed_imsi` char(32) NOT NULL,
  `user_create_time` int(10) NOT NULL,
  `user_is_disabled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'1',13303333333,'4a62f4cd28d3857e5e669064de11b519','56590a4c15850413df606bea7f190f07',1419960695,0);
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

-- Dump completed on 2015-01-07 17:54:26
