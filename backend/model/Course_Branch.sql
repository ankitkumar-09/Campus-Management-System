USE university;

CREATE TABLE Course_Branch (
    branch_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    branch_name VARCHAR(100) NOT NULL,
    description TEXT,
    UNIQUE(course_id, branch_name),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

ALTER TABLE Course_Branch
ADD CONSTRAINT fk_course
FOREIGN KEY (course_id) REFERENCES Courses(course_id)
ON DELETE CASCADE;
select * from Course_Branch;

drop table Course_Branch;