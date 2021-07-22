create database SWCGEST;
create user 'swcgest'@'%' identified by 'NetFlag01!';
grant all privileges on SWCGEST.* to 'swcgest'@'%';
use SWCGEST

DROP TABLE IF EXISTS `USERS`;
CREATE TABLE `USERS` (
  `ID` smallint(6) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(128),
  `SURNAME` varchar(128),
  `EMAIL` varchar(128),
  `USERNAME` varchar(128) NOT NULL UNIQUE,
  `PASSWORD` blob,
  `ROLEID` int(11) DEFAULT 1,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

LOCK TABLES `USERS` WRITE;
insert into `USERS` (ID, NAME, SURNAME, USERNAME, PASSWORD, ROLEID) VALUES (1, 'test','testina','test',AES_ENCRYPT('test',SHA2('StatRosaePristinaNomina',512)),2);
insert into `USERS` (ID, NAME, SURNAME, USERNAME, PASSWORD, ROLEID) VALUES (2, 'testa','testone','testAdmin',AES_ENCRYPT('testo',SHA2('StatRosaePristinaNomina',512)),1);

insert into `USERS` (ID, NAME, SURNAME, USERNAME, PASSWORD, ROLEID) VALUES (3, 'Forse','Vendo','SA',AES_ENCRYPT('testo',SHA2('StatRosaePristinaNomina',512)),3);
insert into `USERS` (ID, NAME, SURNAME, USERNAME, PASSWORD, ROLEID) VALUES (4, 'Tam','Tam','TAM',AES_ENCRYPT('testo',SHA2('StatRosaePristinaNomina',512)),4);
insert into `USERS` (ID, NAME, SURNAME, USERNAME, PASSWORD, ROLEID) VALUES (5, 'Piero','Mare','PM',AES_ENCRYPT('testo',SHA2('StatRosaePristinaNomina',512)),5);
insert into `USERS` (ID, NAME, SURNAME, USERNAME, PASSWORD, ROLEID) VALUES (6, 'Marco','Grandi','MGR',AES_ENCRYPT('testo',SHA2('StatRosaePristinaNomina',512)),9);
insert into `USERS` (ID, NAME, SURNAME, USERNAME, PASSWORD, ROLEID) VALUES (7, 'Salvo','Carini','SC',AES_ENCRYPT('testo',SHA2('StatRosaePristinaNomina',512)),6);
insert into `USERS` (ID, NAME, SURNAME, USERNAME, PASSWORD, ROLEID) VALUES (8, 'Ciro','Santo','CS',AES_ENCRYPT('testo',SHA2('StatRosaePristinaNomina',512)),7);
insert into `USERS` (ID, NAME, SURNAME, USERNAME, PASSWORD, ROLEID) VALUES (9, 'John','Connor','JC',AES_ENCRYPT('testo',SHA2('StatRosaePristinaNomina',512)),8);
UNLOCK TABLES;

DROP TABLE IF EXISTS `ROLES`;
CREATE TABLE `ROLES` (
  `ID` smallint(6) NOT NULL AUTO_INCREMENT,
  `ROLE` varchar(128) UNIQUE,
  `FUNCTION` varchar(128),
  `DESCRIPTION` varchar(128),
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

LOCK TABLES `ROLES` WRITE;
insert into `ROLES` (ID, ROLE, DESCRIPTION) VALUES (1, 'admin', 'System Administrator');
insert into `ROLES` (ID, ROLE, DESCRIPTION) VALUES (2, 'user', 'normal user');
insert into `ROLES` (ID, ROLE, DESCRIPTION) VALUES (3, 'SA', 'Sales Account');
insert into `ROLES` (ID, ROLE, DESCRIPTION) VALUES (4, 'TAM', 'Technical Account Manager');
insert into `ROLES` (ID, ROLE, DESCRIPTION) VALUES (5, 'PM', 'Project Manager');
insert into `ROLES` (ID, ROLE, DESCRIPTION) VALUES (6, 'SC', 'Senior Consultant');
insert into `ROLES` (ID, ROLE, DESCRIPTION) VALUES (7, 'CS', 'Consultant');
insert into `ROLES` (ID, ROLE, DESCRIPTION) VALUES (8, 'JC', 'Junior Consultant');
insert into `ROLES` (ID, ROLE, DESCRIPTION) VALUES (9, 'MGR', 'Manager');
UNLOCK TABLES;

DROP TABLE IF EXISTS `PREFIXES`;
CREATE TABLE `PREFIXES` (
  `ID` int(11) DEFAULT 1,
  `PROPPREFIX` varchar(8),
  `ORDPPREFIX` varchar(8),
  `INVPPREFIX` varchar(8),
  `POPREFIX` varchar(8),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `CONTACTS`;
CREATE TABLE `CONTACTS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(128),
  `SURNAME` varchar(128),
  `EMAIL` varchar(128),
  `ROLE` varchar(128),
  `TELEPHONE` varchar(16),
  `MOBILE` varchar(16),
  `CUSTOMERID` int(11),
  `PREMISEID` int(11),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `PREMISES`;
CREATE TABLE `PREMISES` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PREMISE` varchar(128),
  `STREET` varchar(128),
  `CITY` varchar(128),
  `ZIP` int(5),
  `PROVINCE` varchar(4),
  `TELEPHONE` varchar(16),
  `FAX` varchar(16),
  `COUNTRY` varchar(128),
  `COUNTRYCODE` varchar(2),
  `CUSTOMERID` int(11),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `TAGS`;
CREATE TABLE `TAGS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TAG` varchar(128) UNIQUE,
  `DESCRIPTION` varchar(256),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ITEMS`;
CREATE TABLE `ITEMS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(128) UNIQUE,
  `DESCRIPTION` varchar(256),
  `PRICE` numeric(19,4),
  `COST` numeric(19,4),
  `UNITID` int(11),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `UNITS`;
CREATE TABLE `UNITS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CODE` varchar(8) UNIQUE,
  `NAME` varchar(128),
  `DESCRIPTION` varchar(256),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
LOCK TABLES `UNITS` WRITE;
insert into `UNITS` (ID, CODE, NAME, DESCRIPTION) VALUES (1, 'QTA', 'Quantità', 'Numero di unità');
insert into `UNITS` (ID, CODE, NAME, DESCRIPTION) VALUES (2, 'CORE', 'Core', 'Numero di complessivo di core');
insert into `UNITS` (ID, CODE, NAME, DESCRIPTION) VALUES (3, 'CPU', 'CPUs', 'Numero di complessivo di cpu/socket');
insert into `UNITS` (ID, CODE, NAME, DESCRIPTION) VALUES (4, 'USR', 'Users', 'Numero di utenti');
insert into `UNITS` (ID, CODE, NAME, DESCRIPTION) VALUES (5, 'CUSR', 'Concurrent Users', 'Numero di utenti contemporaneamente attivi');
UNLOCK TABLES;

DROP TABLE IF EXISTS `PROFESSIONALS`;
CREATE TABLE `PROFESSIONALS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CODE` varchar(8) UNIQUE,
  `NAME` varchar(128),
  `DAILYPRICE` numeric(19,4),
  `DAILYCOST` numeric(19,4),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
LOCK TABLES `PROFESSIONALS` WRITE;
insert into `PROFESSIONALS` (ID, CODE, NAME, DAILYPRICE, DAILYCOST) VALUES (1, 'AN', 'Analyst', 400, 0);
insert into `PROFESSIONALS` (ID, CODE, NAME, DAILYPRICE, DAILYCOST) VALUES (2, 'CC', 'Consultant', 600, 0);
insert into `PROFESSIONALS` (ID, CODE, NAME, DAILYPRICE, DAILYCOST) VALUES (3, 'SC', 'Senior Consultant', 800, 0);
insert into `PROFESSIONALS` (ID, CODE, NAME, DAILYPRICE, DAILYCOST) VALUES (4, 'PM', 'Project Manager', 800, 0);
insert into `PROFESSIONALS` (ID, CODE, NAME, DAILYPRICE, DAILYCOST) VALUES (5, 'MGR', 'Manager', 1000, 0);
UNLOCK TABLES;

DROP TABLE IF EXISTS `PROPOSALSITEMS`;
CREATE TABLE `PROPOSALSITEMS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `PROPOSALID` int(11),
  `ITEMID` int(11),
  `QTA` int(11),
  `TOTPRICE` numeric(19,4),
  `TOTCOST` numeric(19,4),
  `DISCOUNT` numeric(19,4),
  `AMOUNT` numeric(19,4),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `CUSTOMERSTAGS`;
CREATE TABLE `CUSTOMERSTAGS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TAGID` int(11),
  `CUSTOMERID` int(11),
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `INDUSTRIES`;
CREATE TABLE `INDUSTRIES` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `INDUSTRY` varchar(128) UNIQUE,
  `DESCRIPTION` varchar(256),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;
LOCK TABLES `INDUSTRIES` WRITE;
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (1, 'Aerospace & Defense', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (2, 'Automotive', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (3, 'Biotechnology', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (4, 'Broadcasting/Media/Radio', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (5, 'Business Services', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (6, 'Communication Equipment', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (7, 'ICT Hardware', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (8, 'ICT Software', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (9, 'Distributor', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (10, 'Education', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (11, 'Electronic Equip./Components', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (12, 'Energy', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (13, 'Environmental Protection', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (14, 'Films/Entertainments', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (15, 'Food Services/Products', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (16, 'Health Care Services', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (17, 'Health/Medical IT', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (18, 'Information Technology', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (19, 'Insurance', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (20, 'Internet & Online Services', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (21, 'IT Security', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (22, 'Manufacturing', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (23, 'Material & Chemicals', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (24, 'Medical Devices', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (25, 'Pharmaceuticals', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (26, 'Public Administration / Government Institutes', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (27, 'Publishing & Advertising', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (28, 'Real Estate/Construction', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (29, 'Retailing', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (30, 'Security Services', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (31, 'Shipbuilding', '');
insert into `INDUSTRIES` (ID, INDUSTRY, DESCRIPTION) VALUES (32, 'Telecom/Networking', '');
UNLOCK TABLES;

DROP TABLE IF EXISTS `MARKETS`;
CREATE TABLE `MARKETS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `MARKET` varchar(128) UNIQUE,
  `DESCRIPTION` varchar(256),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `TERRITORIES`;
CREATE TABLE `TERRITORIES` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TERRITORY` varchar(128) UNIQUE,
  `DESCRIPTION` varchar(256),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `CUSTOMERS`;
CREATE TABLE `CUSTOMERS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(128) UNIQUE,
  `WEB` varchar(128),
  `GENERICEMAIL` varchar(128),
  `EMPLOYEESNUMBER` int(11),
  `TURNOVER` int(32),
  `VAT` varchar(16) UNIQUE,
  `SDINUM` varchar(8) UNIQUE,
  `PEC` varchar(128) UNIQUE,
  `CREDITRATINGID` int(11),
  `INDUSTRYID` int(11),
  `CATEGORYID` int(11),
  `MARKETID` int(11),
  `TERRITORYID` int(11),
  `STATUSID` int(11),
  `NOTES` varchar(4096),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `CUSTOMERSTATUS`;
CREATE TABLE `CUSTOMERSTATUS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CUSTOMERSTAT` varchar(128) UNIQUE,
  `DESCRIPTION` varchar(256),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
LOCK TABLES `CUSTOMERSTATUS` WRITE;
insert into `CUSTOMERSTATUS` (ID, CUSTOMERSTAT, DESCRIPTION) VALUES (1, 'Prospect', '');
insert into `CUSTOMERSTATUS` (ID, CUSTOMERSTAT, DESCRIPTION) VALUES (2, 'Active', '');
insert into `CUSTOMERSTATUS` (ID, CUSTOMERSTAT, DESCRIPTION) VALUES (3, 'Inactive', '');
insert into `CUSTOMERSTATUS` (ID, CUSTOMERSTAT, DESCRIPTION) VALUES (4, 'Dormient', '');
UNLOCK TABLES;

DROP TABLE IF EXISTS `OPPORTUNITYSTAGES`;
CREATE TABLE `OPPORTUNITYSTAGES` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `STAGE` varchar(128) UNIQUE,
  `DESCRIPTION` varchar(256),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `OPPORTUNITIES`;
CREATE TABLE `OPPORTUNITIES` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(128),
  `DESCRIPTION` varchar(256),
  `AMOUNT` int(16),
  `CUSTOMERID` int(11),
  `CONTACTID` int(11),
  `FINALCUSTOMERID` int(11),
  `STAGEID` int(11),
  `WINPROBABILITYID` int(11),
  `LEADSOURCEID` int(11),
  `BUSINESSUNITID` int(11),
  `TECHSUPPORTREQUIRED` boolean,
  `ASSIGNEDTOID` int(11),
  `PMID` int(11),
  `CLOSEDATE` date,
  `FCST1Y` int(16),
  `FCST2Y` int(16),
  `FCST3Y` int(16),
  `ESTIMATEID` int(11),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `COUNTRIES`;
CREATE TABLE `COUNTRIES` (
  `NAME` varchar(256),
  `A2CODE` varchar(2),
  `A3CODE` varchar(3),
  `NCODE` varchar(8),
  `MLAT` varchar(32),
  `MLONG` varchar(32),
  PRIMARY KEY (`A2CODE`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `WINPROBABILITIES`;
CREATE TABLE `WINPROBABILITIES` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CODE` varchar(32) UNIQUE,
  `PROBABILITY` smallint(3),
  `DESCRIPTION` varchar(256),
  `DISPLAYORDER` smallint(3),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
LOCK TABLES `WINPROBABILITIES` WRITE;
insert into `WINPROBABILITIES` (ID, CODE, PROBABILITY, DESCRIPTION, DISPLAYORDER) VALUES (1, 'Suspect', 5, '', 1);
insert into `WINPROBABILITIES` (ID, CODE, PROBABILITY, DESCRIPTION, DISPLAYORDER) VALUES (2, 'Pipeline', 35, '', 2);
insert into `WINPROBABILITIES` (ID, CODE, PROBABILITY, DESCRIPTION, DISPLAYORDER) VALUES (3, 'Best', 60, '', 3);
insert into `WINPROBABILITIES` (ID, CODE, PROBABILITY, DESCRIPTION, DISPLAYORDER) VALUES (4, 'Most', 80, '', 4);
insert into `WINPROBABILITIES` (ID, CODE, PROBABILITY, DESCRIPTION, DISPLAYORDER) VALUES (5, 'Won', 100, '', 5);
insert into `WINPROBABILITIES` (ID, CODE, PROBABILITY, DESCRIPTION, DISPLAYORDER) VALUES (6, 'Closed Won', 100, '', 6);
insert into `WINPROBABILITIES` (ID, CODE, PROBABILITY, DESCRIPTION, DISPLAYORDER) VALUES (7, 'Lost', 0, '', 7);
UNLOCK TABLES;

DROP TABLE IF EXISTS `BUSINESSUNITS`;
CREATE TABLE `BUSINESSUNITS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `BUSINESSUNIT` varchar(64) UNIQUE,
  `DESCRIPTION` varchar(256),
  `DISPLAYORDER` smallint(3),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
LOCK TABLES `BUSINESSUNITS` WRITE;
insert into `BUSINESSUNITS` (ID, BUSINESSUNIT, DESCRIPTION, DISPLAYORDER) VALUES (1, 'FRI', '', 1);
insert into `BUSINESSUNITS` (ID, BUSINESSUNIT, DESCRIPTION, DISPLAYORDER) VALUES (2, 'Cyber', '', 2);
insert into `BUSINESSUNITS` (ID, BUSINESSUNIT, DESCRIPTION, DISPLAYORDER) VALUES (3, 'IAM', '', 3);
UNLOCK TABLES;

DROP TABLE IF EXISTS `VATS`;
CREATE TABLE `VATS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CODE` varchar(64),
  `DESCRIPTION` varchar(256),
  `TYPE` varchar(32),
  `VALUE` numeric(8,2),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
LOCK TABLES `VATS` WRITE;
insert into `VATS` (ID, CODE, DESCRIPTION, TYPE, VALUE) VALUES (1, 'IVA-22', 'IVA al 22%', 'percentage', 22);
insert into `VATS` (ID, CODE, DESCRIPTION, TYPE, VALUE) VALUES (2, 'IVA-20', 'IVA al 20%', 'percentage', 20);
insert into `VATS` (ID, CODE, DESCRIPTION, TYPE, VALUE) VALUES (3, 'IVA-10', 'IVA al 10%', 'percentage', 10);
insert into `VATS` (ID, CODE, DESCRIPTION, TYPE, VALUE) VALUES (4, 'NOVAT',  'NO VAT/IVA', 'percentage', 0);
UNLOCK TABLES;

DROP TABLE IF EXISTS `ESTIMATES`;
CREATE TABLE `ESTIMATES` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `OPPORTUNITYID` int(11),
  `CUSTOMERID` int(11),
  `FINALCUSTOMERID` int(11),
  `CONTACTID` int(11),
  `ASSIGNEDTOID` int(11),
  `PMID` int(11),
  `BUSINESSUNITID` int(11),
  `NOTE` varchar(2048),
  `ITEMSLISTID` int(11),
  `PSLISTID` int(11),
  `PROJECTESTIMATEID` int(11),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ESTIMATEITEMS`;
CREATE TABLE `ESTIMATEITEMS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ESTIMATEID` int(11),
  `ITEMID` int(11),
  `NAME` varchar(128),
  `DESCRIPTION` varchar(256),
  `UNITS` int(11),
  `UNITID` int(11),
  `UNITPRICE` numeric(19,4),
  `UNITCOST` numeric(19,4),
  `PRICE` numeric(19,4),
  `COST` numeric(19,4),
  `VAT` numeric(19,4),
  `AMOUNT` numeric(19,4),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `ESTIMATEPS`;
CREATE TABLE `ESTIMATEPS` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ESTIMATEID` int(11),
  `PROFESSIONALID` int(11),
  `CODE` varchar(8),
  `NAME` varchar(128),
  `DAYS` int(11),
  `DAILYRATE` numeric(19,4),
  `DAILYCOST` numeric(19,4),
  `PRICE` numeric(19,4),
  `COST` numeric(19,4),
  `VAT` numeric(19,4),
  `AMOUNT` numeric(19,4),
  `CREATEDBY` smallint(6),
  `CREATEDAT` datetime,
  `MODIFIEDBY` smallint(6),
  `MODIFIEDAT` datetime,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;