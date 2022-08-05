CREATE TABLE `UserManagementSystem`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `comment` TEXT NOT NULL,
  `Status` VARCHAR(45) NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
);
