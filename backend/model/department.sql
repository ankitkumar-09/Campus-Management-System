CREATE TABLE departments (
  department_id   INT PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL UNIQUE,
  dept_code       VARCHAR(16)  NOT NULL UNIQUE,
  hod_name        VARCHAR(100),
  hod_email       VARCHAR(255),
  phone           VARCHAR(20),
  office_location VARCHAR(100),
  description text
  );
  


select * from departments;