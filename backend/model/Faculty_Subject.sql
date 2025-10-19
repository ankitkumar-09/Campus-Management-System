use university;
CREATE TABLE Faculty_Subject (
    id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_id INT NOT NULL,
    subject_id INT NOT NULL,
    course_id INT NOT NULL,
    branch_id INT NULL,
    section_id INT NULL,
    semester INT NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id),
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    FOREIGN KEY (branch_id) REFERENCES Course_Branch(branch_id),
    FOREIGN KEY (section_id) REFERENCES Sections(section_id)
);

desc Faculty_Subject;

select * from faculty_subject;

drop table faculty_subject;

rollback;