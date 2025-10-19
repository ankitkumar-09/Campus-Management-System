use university;
CREATE TABLE Attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    faculty_subject_id INT NOT NULL,   -- which faculty & subject
    date DATE NOT NULL,
    status ENUM('Present','Absent') NOT NULL,
    
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_subject_id) REFERENCES Faculty_Subject(id) ON DELETE CASCADE,
    
    UNIQUE(student_id, faculty_subject_id, date)   -- avoid duplicate marking
);
TRUNCATE TABLE attendance;
drop table attendance;
