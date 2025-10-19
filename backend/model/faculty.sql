use university;
CREATE TABLE Faculty (
    faculty_id INT UNIQUE AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_id VARCHAR(100),
    email VARCHAR(100) PRIMARY KEY,
    password varchar(100),
    dob DATE,
    contact_number VARCHAR(15),
    address TEXT,
    gender VARCHAR(10)
);
ALTER TABLE Faculty ADD COLUMN profile_image_url VARCHAR(255);

ALTER TABLE Faculty
ADD COLUMN designation VARCHAR(100),
ADD COLUMN degree VARCHAR(100);


DROP TABLE FACULTY;
truncate table faculty; 
select * from faculty;
rollback;
delete from faculty where faculty_id=2;

