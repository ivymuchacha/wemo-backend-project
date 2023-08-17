INSERT INTO `wemo`.`rentStatus` (`id`, `name`) VALUES (1, '租借中');
INSERT INTO `wemo`.`rentStatus` (`id`, `name`) VALUES (2, '已結束');
INSERT INTO `wemo`.`scooterState` (`id`, `name`) VALUES (1, '正常');
INSERT INTO `wemo`.`scooterState` (`id`, `name`) VALUES (2, '維修中');
INSERT INTO `wemo`.`scooterState` (`id`, `name`) VALUES (3, '已報廢');
INSERT INTO `scooter` (`name`, `license_number`, `price`, `stateId`) VALUES ('scooter one', 'AAA-001', 50, 1);
INSERT INTO `scooter` (`name`, `license_number`, `price`, `stateId`) VALUES ('scooter two', 'AAA-002', 80, 1);
