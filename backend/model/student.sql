use university;
CREATE TABLE Student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,          -- Internal unique ID
    university_id CHAR(5) UNIQUE,                       -- Auto-generated 5-digit University ID
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,                     -- Increased length for hashed passwords
    roll_no CHAR(5) UNIQUE,                             -- Auto-generated 5-digit Roll No
    
    -- Foreign Keys and Academic Info
    course_id INT NOT NULL,                             -- Foreign Key to Courses
    branch_id INT NULL,                                 -- Foreign Key to Course_Branch (can be null)
    section_id INT NULL,                                -- Foreign Key to Sections (can be null)
    department_id INT NOT NULL,                         -- Foreign Key to Departments
    semester INT,
    year INT,

    -- Personal Information
    dob DATE,
    gender VARCHAR(10),
    nationality VARCHAR(50) DEFAULT 'Indian',
    blood_group VARCHAR(5) NULL,
    contact VARCHAR(15) NOT NULL,
    address TEXT NULL,
    profile_image_url VARCHAR(255) NULL,                -- Corrected field for profile image URL

    -- Guardian Information
    father_name VARCHAR(100),
    father_contact VARCHAR(15),
    father_occupation VARCHAR(100),
    mother_name VARCHAR(100),
    mother_contact VARCHAR(15),
    mother_occupation VARCHAR(100),

    -- System Fields
    token VARCHAR(500) NULL,                            -- For authentication, password reset, etc.

    -- Defining Foreign Key Constraints
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES Course_Branch(branch_id) ON DELETE SET NULL, -- SET NULL is often safer
    FOREIGN KEY (section_id) REFERENCES Sections(section_id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id) ON DELETE CASCADE
);

-- Set the starting value for the auto-incrementing primary key
ALTER TABLE Student AUTO_INCREMENT = 1000;



DESC Student;


SELECT * FROM Student;


DELETE FROM Student WHERE student_id = 1000;


DELETE FROM Student;

TRUNCATE TABLE Student;