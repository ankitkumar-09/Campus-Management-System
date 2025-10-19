USE university;

CREATE TABLE Sections(
    section_id INT PRIMARY KEY AUTO_INCREMENT,
    section_name VARCHAR(50) NOT NULL UNIQUE,
    course_id INT NOT NULL,
    branch_id INT,
    semester INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES Course_Branch(branch_id) ON DELETE CASCADE
);

delete from sections where section_id=1;

SELECT * FROM Sections;

desc sections;
drop table sections;




DROP TABLE Sections;
