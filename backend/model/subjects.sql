use university;
DROP TABLE Subjects;
CREATE TABLE Subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    course varchar(100) not null,
    credits INT NOT NULL,
    description text
);
select * from subjects;