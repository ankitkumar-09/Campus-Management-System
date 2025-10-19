use university;
CREATE TABLE admin (
	admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25),
    email VARCHAR(100) NOT NULL UNIQUE,
    token VARCHAR(500),
    password VARCHAR(100)
);
ALTER TABLE admin
ADD COLUMN role VARCHAR(50) DEFAULT 'admin';

desc admin;

select * from admin;
delete from admin where admin_id=5;
drop table admin;


