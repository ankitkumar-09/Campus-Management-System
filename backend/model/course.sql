use university;

CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL UNIQUE,
    duration_years INT NOT NULL,                  
    total_semesters INT NOT NULL,                 
    course_code VARCHAR(20) UNIQUE,               
    department VARCHAR(100),                     
    description TEXT                             
);
select * from courses;

drop table Courses;