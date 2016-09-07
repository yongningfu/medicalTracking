DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(12) NOT NULL DEFAULT '',
  `status` tinyint(11) NOT NULL DEFAULT '1' COMMENT '1 为有效 2 为禁用',
  `create_time` datetime NOT NULL,
  `retrieve_key` varchar(255) NOT NULL,
  `retrieve_time` datetime DEFAULT NULL,
  `accessToken` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `position`;

CREATE TABLE `position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `launcher_id` int(11) unsigned NOT NULL,
  `longitude` decimal(10,7) DEFAULT '999.9999999',
  `latitude` decimal(10,7) DEFAULT '999.9999999',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`launcher_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;












