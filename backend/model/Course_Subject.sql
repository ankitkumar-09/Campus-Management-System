use university;
CREATE TABLE Course_Subjects (
    cs_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- optional, in case you want to keep history
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    UNIQUE(course_id, subject_id, semester)
);
select * from course_subjects;
drop table Course_Subjects;
truncate table  course_subjects;

