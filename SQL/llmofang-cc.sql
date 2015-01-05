CREATE DATABASE  IF NOT EXISTS `llmofang-cc` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `llmofang-cc`;
-- MySQL dump 10.13  Distrib 5.5.40, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: llmofang-cc
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
-- Table structure for table `apps`
--

DROP TABLE IF EXISTS `apps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_user_id` int(10) NOT NULL,
  `app_is_disabled` tinyint(1) NOT NULL DEFAULT '0',
  `appd_name` varchar(50) NOT NULL,
  `app_id` varchar(100) NOT NULL,
  `app_key` varchar(100) NOT NULL,
  `app_create_time` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_apps_1_idx` (`app_user_id`),
  CONSTRAINT `fk_apps_1` FOREIGN KEY (`app_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apps`
--

LOCK TABLES `apps` WRITE;
/*!40000 ALTER TABLE `apps` DISABLE KEYS */;
/*!40000 ALTER TABLE `apps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `client_id` varchar(50) NOT NULL,
  `client_hashed_imei` varchar(50) NOT NULL,
  `client_create_time` int(10) NOT NULL,
  `client_is_disabled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients_apps`
--

DROP TABLE IF EXISTS `clients_apps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients_apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_client_id` int(10) NOT NULL,
  `app_app_id` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_clients_apps_1_idx` (`app_client_id`),
  KEY `fk_clients_apps_2_idx` (`app_app_id`),
  CONSTRAINT `fk_clients_apps_1` FOREIGN KEY (`app_client_id`) REFERENCES `clients` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_clients_apps_2` FOREIGN KEY (`app_app_id`) REFERENCES `apps` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients_apps`
--

LOCK TABLES `clients_apps` WRITE;
/*!40000 ALTER TABLE `clients_apps` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients_apps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_clients`
--

DROP TABLE IF EXISTS `data_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data_client_app_id` int(10) NOT NULL,
  `data_time_start` int(10) NOT NULL,
  `data_time_end` int(10) NOT NULL,
  `data_data_total` int(10) NOT NULL DEFAULT '0',
  `data_data_usage` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_data_clients_1_idx` (`data_client_app_id`),
  CONSTRAINT `fk_data_clients_1` FOREIGN KEY (`data_client_app_id`) REFERENCES `clients_apps` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_clients`
--

LOCK TABLES `data_clients` WRITE;
/*!40000 ALTER TABLE `data_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `data_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data_users`
--

DROP TABLE IF EXISTS `data_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `data_app_user_id` int(10) NOT NULL,
  `data_time_start` int(10) NOT NULL,
  `data_time_end` int(10) NOT NULL,
  `data_data_total` int(15) NOT NULL,
  `data_data_usage` int(15) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_data_users_1_idx` (`data_app_user_id`),
  CONSTRAINT `fk_data_users_1` FOREIGN KEY (`data_app_user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
  `user_username` varchar(45) NOT NULL,
  `user_password` varchar(50) NOT NULL,
  `user_create_time` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
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

-- Dump completed on 2014-12-29 10:02:00
