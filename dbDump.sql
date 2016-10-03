CREATE DATABASE  IF NOT EXISTS `store_supply` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `store_supply`;
-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: store_supply
-- ------------------------------------------------------
-- Server version	5.6.33

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
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `account_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_firstName` varchar(45) NOT NULL,
  `account_lastName` varchar(45) NOT NULL,
  `account_email` varchar(45) NOT NULL,
  `account_password` char(128) NOT NULL,
  `account_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `account_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `account_id_UNIQUE` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `article` (
  `article_id` int(11) NOT NULL AUTO_INCREMENT,
  `article_name` varchar(45) NOT NULL,
  `article_quantity` decimal(6,3) NOT NULL,
  `article_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `article_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` VALUES (10,'Banana',52.880,'2016-09-23 20:21:46',NULL),(11,'Tomato',2.590,'2016-09-23 20:21:46','2016-10-03 19:47:08'),(12,'Potato',93.900,'2016-09-23 20:21:46','2016-10-03 19:47:08'),(13,'Onion',5.760,'2016-09-23 20:21:46','2016-10-03 19:47:08'),(14,'Orange',14.500,'2016-09-23 20:22:21','2016-10-03 19:47:08'),(15,'Lemon',13.930,'2016-09-23 20:25:26','2016-10-03 19:47:08');
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipt`
--

DROP TABLE IF EXISTS `receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receipt` (
  `receipt_id` int(11) NOT NULL AUTO_INCREMENT,
  `receipt_number` varchar(45) NOT NULL,
  `receipt_total` decimal(6,3) NOT NULL,
  `receipt_date` varchar(45) DEFAULT NULL,
  `receipt_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `receipt_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`receipt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipt`
--

LOCK TABLES `receipt` WRITE;
/*!40000 ALTER TABLE `receipt` DISABLE KEYS */;
INSERT INTO `receipt` VALUES (3,'10804558',266.580,'2016-09-25 12:20:00','2016-09-25 14:48:50','2016-09-25 14:49:58'),(4,'10704536',638.950,'2016-09-24 14:35:00','2016-09-25 14:49:38',NULL),(5,'10604480',545.830,'2016-09-23 15:00:00','2016-09-25 15:29:51','2016-09-25 15:31:20'),(6,'10504428',591.910,'2016-09-22 14:48:00','2016-09-25 15:30:36','2016-09-25 15:31:20');
/*!40000 ALTER TABLE `receipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipt_article_map`
--

DROP TABLE IF EXISTS `receipt_article_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receipt_article_map` (
  `receipt_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `article_price` decimal(6,3) NOT NULL,
  `total_article_price` decimal(6,3) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`receipt_id`,`article_id`),
  KEY `FK_receiptArticleMap_article_idx` (`article_id`),
  CONSTRAINT `FK_receiptArticleMap_article` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_receiptArticleMap_receipt` FOREIGN KEY (`receipt_id`) REFERENCES `receipt` (`receipt_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipt_article_map`
--

LOCK TABLES `receipt_article_map` WRITE;
/*!40000 ALTER TABLE `receipt_article_map` DISABLE KEYS */;
INSERT INTO `receipt_article_map` VALUES (5,10,11.000,45.870,'2016-09-25 15:32:15',NULL),(5,15,20.000,20.000,'2016-09-25 15:32:49',NULL);
/*!40000 ALTER TABLE `receipt_article_map` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-10-03 21:48:37
