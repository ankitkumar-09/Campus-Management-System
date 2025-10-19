# University Management System API Documentation

This document provides a complete overview of the backend API for the University Management System, including authentication, faculty/student management, courses, subjects, semester-wise subject mapping, bulk operations, and announcement uploads. It also details the database schema for all models.

---

## Table of Contents

- [API Endpoints](#api-endpoints)
  - [Admin](#admin)
  - [Faculty](#faculty)
  - [Student](#student)
  - [Announcement](#announcement)
  - [Courses & Subjects](#courses--subjects)
- [Database Models](#database-models)
  - [Admin Table](#admin-table)
  - [Faculty Table](#faculty-table)
  - [Student Table](#student-table)
  - [Announcement Table](#announcement-table)
- [Bulk Operations](#bulk-operations)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)

---

## API Endpoints

### Admin

| Endpoint                              | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|----------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/admin/signin`                       | POST   | Admin login                      | `{ "email": "admin@email.com", "password": "password" }`                             | `{ "message": "Login successful", "token": "...", "role": "admin" }`                               |
| `/admin/add-faculty`                   | POST   | Add new faculty                  | `{ "name": "...", "department": "...", "email": "...", "dob": "...", ... }`          | `{ "message": "Faculty added successfully" }`                                                      |
| `/admin/add-student`                   | POST   | Add new student                  | `{ "name": "...", "email": "...", "course": "...", "branch": "...", ... }`           | `{ "success": true, "message": "Student added successfully", "data": { ... } }`                    |
| `/admin/add-bulk-student`              | POST   | Bulk add students (CSV/Excel)    | `multipart/form-data` with file field                                                | `{ "message": "Bulk students added successfully", "added": N, "failedEmails": [ ... ] }`           |
| `/admin/upload-announcement`           | POST   | Upload announcement (with file)  | `multipart/form-data` with fields: `type`, `title`, `description`, `file` (optional) | `{ "message": "Announcement saved successfully", "url": "https://..." }`                           |
### Courses & Subjects

| Endpoint                                         | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|-------------------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/admin/add-new-course`                         | POST   | Add new course                   | `{ "course_name": "...", "duration_years": 3, "department": "...", "course_code": "...", "description": "..." }` | `{ "message": "Course added successfully" }`                                                       |
| `/admin/get-all-courses`                        | GET    | Get all courses                  | None                                                                                 | `[ { "course_id": 1, "course_name": "...", ... }, ... ]`                                           |
| `/admin/add-new-subject`                        | POST   | Add new subject                  | `{ "subject_name": "...", "subject_code": "...", "course": "...", "credits": 4, "description": "..." }` | `{ "message": "Subject added successfully" }`                                                      |
| `/admin/get-all-subjects`                       | GET    | Get all subjects                 | None                                                                                 | `[ { "subject_id": 1, "subject_name": "...", ... }, ... ]`                                         |
| `/admin/get-all-subjects-by-course/:course`     | GET    | Get all subjects by course name  | Path param: course name (string)                                                     | `[ { "subject_id": 1, "subject_name": "...", ... }, ... ]`                                         |
| `/admin/add-course-subjects-semster-wise`       | POST   | Assign subjects to a course semester | `{ "course_id": 1, "semester": 3, "subject_ids": [5, 7, 9] }`                         | `{ "message": "Subjects for semester updated successfully" }`                                     |

### Faculty

| Endpoint                              | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|----------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/faculty/login`                      | POST   | Faculty login                    | `{ "email": "faculty@email.com", "password": "password" }`                           | `{ "message": "Login successful", "token": "...", "role": "faculty" }`                             |

### Student

| Endpoint                              | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|----------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/student/login`                      | POST   | Student login                    | `{ "email": "student@email.com", "password": "password" }`                           | `{ "message": "Login successful", "token": "...", "role": "student" }`                             |

### Announcement

| Endpoint                              | Method | Description                      | Request Body / Params                                                                 | Response Example                                                                                   |
|----------------------------------------|--------|----------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `/admin/upload-announcement`           | POST   | Upload announcement (with file)  | `multipart/form-data` with fields: `type`, `title`, `description`, `file` (optional) | `{ "message": "Announcement saved successfully", "url": "https://..." }`                           |

---

## Database Models

### Admin Table

| Column      | Type           | Constraints           | Description         |
|-------------|----------------|----------------------|---------------------|
| admin_id    | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique admin ID     |
| name        | VARCHAR(25)    |                      | Admin name          |
| email       | VARCHAR(100)   | NOT NULL, UNIQUE     | Admin email         |
| password    | VARCHAR(100)   |                      | Hashed password     |

**SQL:**
```sql
CREATE TABLE admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100)
);
```

---

### Faculty Table

| Column         | Type           | Constraints           | Description         |
|----------------|----------------|----------------------|---------------------|
| faculty_id     | INT            | UNIQUE, AUTO_INCREMENT | Unique faculty ID   |
| name           | VARCHAR(100)   | NOT NULL             | Faculty name        |
| department     | VARCHAR(100)   |                      | Department          |
| email          | VARCHAR(100)   | PRIMARY KEY          | Faculty email       |
| password       | VARCHAR(100)   |                      | Hashed password     |
| dob            | DATE           |                      | Date of birth       |
| contact_number | VARCHAR(15)    |                      | Contact number      |
| address        | TEXT           |                      | Address             |
| gender         | VARCHAR(10)    |                      | Gender              |

**SQL:**
```sql
CREATE TABLE Faculty (
    faculty_id INT UNIQUE AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    email VARCHAR(100) PRIMARY KEY,
    password varchar(100),
    dob DATE,
    contact_number VARCHAR(15),
    address TEXT,
    gender VARCHAR(10)
);
```

---

### Student Table

| Column      | Type           | Constraints           | Description         |
|-------------|----------------|----------------------|---------------------|
| student_id  | INT            | UNIQUE, AUTO_INCREMENT | Unique student ID   |
| name        | VARCHAR(100)   |                      | Student name        |
| email       | VARCHAR(100)   | PRIMARY KEY          | Student email       |
| password    | VARCHAR(100)   |                      | Hashed password     |
| roll_no     | INT            | UNIQUE               | Roll number         |
| course      | VARCHAR(100)   | NOT NULL             | Course name         |
| branch      | VARCHAR(100)   |                      | Branch              |
| semester    | INT            |                      | Semester            |
| year        | INT            |                      | Year                |
| dob         | DATE           |                      | Date of birth       |
| gender      | VARCHAR(10)    |                      | Gender              |
| contact     | VARCHAR(15)    |                      | Contact number      |
| address     | TEXT           |                      | Address             |

**SQL:**
```sql
CREATE TABLE Student (
    student_id INT UNIQUE AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) PRIMARY KEY,
    password varchar(100),
    roll_no INT UNIQUE,
    course VARCHAR(100) NOT NULL,
    branch VARCHAR(100),
    semester INT,
    year INT,
    dob DATE,
    gender VARCHAR(10),
    contact VARCHAR(15),
    address TEXT
);
ALTER TABLE Student AUTO_INCREMENT = 1000;
```

---

### Announcement Table

| Column         | Type           | Constraints           | Description         |
|----------------|----------------|----------------------|---------------------|
| announcement_id| INT            | PRIMARY KEY, AUTO_INCREMENT | Unique announcement ID |
| title          | VARCHAR(255)   | NOT NULL             | Announcement title  |
| type           | ENUM           | NOT NULL             | Announcement type   |
| description    | TEXT           |                      | Description         |
| file_url       | VARCHAR(500)   |                      | File URL (optional) |
| admin_id       | INT            | NOT NULL, FOREIGN KEY| Admin who posted    |
| created_at     | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP | Creation time   |

**SQL:**
```sql
CREATE TABLE announcement (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    type ENUM('Holiday', 'Academic', 'Sports', 'Exam', 'Fees', 'Admission', 'Others') NOT NULL,
    description TEXT,
    file_url VARCHAR(500),
    admin_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);
```
### Courses
| Column           | Type         | Constraints                  | Description                             |
| ---------------- | ------------ | ---------------------------- | --------------------------------------- |
| course\_id       | INT          | PRIMARY KEY, AUTO\_INCREMENT | Unique course ID                        |
| course\_name     | VARCHAR(100) | NOT NULL, UNIQUE             | Name of the course                      |
| duration\_years  | INT          | NOT NULL                     | Duration of the course in years         |
| total\_semesters | INT          | NOT NULL                     | Total number of semesters in the course |
| course\_code     | VARCHAR(20)  | UNIQUE                       | Unique course code                      |
| department       | VARCHAR(100) |                              | Department offering the course          |
| description      | TEXT         |                              | Additional details about the course     |

**SQL:**
```sql
CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL UNIQUE,
    duration_years INT NOT NULL,
    total_semesters INT NOT NULL,
    course_code VARCHAR(20) UNIQUE,
    department VARCHAR(100),
    description TEXT
);
```

### Subjects
| Column        | Type         | Constraints                  | Description                          |
| ------------- | ------------ | ---------------------------- | ------------------------------------ |
| subject\_id   | INT          | PRIMARY KEY, AUTO\_INCREMENT | Unique subject ID                    |
| subject\_name | VARCHAR(100) | NOT NULL                     | Name of the subject                  |
| subject\_code | VARCHAR(20)  | NOT NULL, UNIQUE             | Unique code for the subject          |
| course        | VARCHAR(100) | NOT NULL                     | Course this subject belongs to       |
| credits       | INT          | NOT NULL                     | Credits awarded for this subject     |
| description   | TEXT         |                              | Additional details about the subject |

**SQL:**
```sql
CREATE TABLE Subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    course VARCHAR(100) NOT NULL,
    credits INT NOT NULL,
    description TEXT
);
```

### Course_Subjects
| Column                                    | Type    | Constraints                                                          | Description                                |
| ----------------------------------------- | ------- | -------------------------------------------------------------------- | ------------------------------------------ |
| cs\_id                                    | INT     | PRIMARY KEY, AUTO\_INCREMENT                                         | Unique course-subject mapping ID           |
| course\_id                                | INT     | NOT NULL, FOREIGN KEY (Courses.course\_id) ON DELETE CASCADE         | ID of the course                           |
| subject\_id                               | INT     | NOT NULL, FOREIGN KEY (Subjects.subject\_id) ON DELETE CASCADE       | ID of the subject                          |
| semester                                  | INT     | NOT NULL                                                             | Semester in which the subject is taught    |
| is\_active                                | BOOLEAN | DEFAULT TRUE                                                         | Status of the mapping (active/inactive)    |
| UNIQUE(course\_id, subject\_id, semester) | -       | Ensures a subject can only be assigned once per semester in a course | Unique course-subject-semester combination |

**SQL:**
```sql
CREATE TABLE Course_Subjects (
    cs_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    UNIQUE(course_id, subject_id, semester)
);
```
---

## Bulk Operations

- **Bulk Add Students:**  
  Endpoint: `/admin/add-bulk-student`  
  Method: `POST`  
  Content-Type: `multipart/form-data`  
  Body: Upload a CSV or Excel file with columns matching the student table schema.  
  - Each student will receive credentials via email.
  - Failed email deliveries are reported in the response.

---

## Authentication

- All login endpoints return a JWT token on success.
- Use the token in the `Authorization` header for protected routes.

---

## Error Handling

- All endpoints return appropriate HTTP status codes and error messages.
- Common errors:
  - `400 Bad Request`: Missing required fields.
  - `401 Unauthorized`: Invalid credentials.
  - `404 Not Found`: User not found.
  - `409 Conflict`: Duplicate entry.
  - `500 Internal Server Error`: Server-side error.

---

## Environment Variables

Set these in your `.env` file:

| Variable            | Description                   |
|---------------------|------------------------------|
| `database_pass`     | MySQL root password          |
| `PORT`              | Server port (default: 3000)  |
| `JWT_SECRET_KEY`    | JWT secret key               |
| `ADMIN_EMAIL`       | Email for sending credentials|
| `ADMIN_EMAIL_PASS`  | Email password/app password  |
| `CLOUD_NAME`        | Cloudinary cloud name        |
| `CLOUD_API_KEY`     | Cloudinary API key           |
| `CLOUD_SECRET_KEY`  | Cloudinary API secret        |

---

## Setup Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure `.env` file:**
   ```
   database_pass=your_mysql_password
   PORT=3000
   JWT_SECRET_KEY=your_secret_key
   ADMIN_EMAIL=your_email@gmail.com
   ADMIN_EMAIL_PASS=your_email_app_password
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_SECRET_KEY=your_cloudinary_api_secret
   ```

3. **Setup MySQL database:**
   - Run the SQL scripts in [`backend/model/createDatabase.sql`](backend/model/createDatabase.sql), [`backend/model/admin.sql`](backend/model/admin.sql), [`backend/model/faculty.sql`](backend/model/faculty.sql), [`backend/model/student.sql`](backend/model/student.sql), and [`backend/model/announcement.sql`](backend/model/announcement.sql).

4. **Start the server:**
   ```sh
   node app.js
   ```

---

## Example Requests

### Admin Login

```http
POST /admin/signin
Content-Type: application/json

{
  "email": "satya@gmail.com",
  "password": "deepasingh"
}
```

### Add Faculty

```http
POST /admin/add-faculty
Content-Type: application/json

{
  "name": "Satya Prakash Singh",
  "email": "satyasingh159357@gmail.com"
}
```

### Add Student

```http
POST /admin/add-student
Content-Type: application/json

{
  "name": "Satya Prakash Singh",
  "email": "satyasingh159357@gmail.com",
  "course": "B.Tech",
  "branch": "Computer Science",
  "semester": 5,
  "year": 2025,
  "dob": "2004-07-15",
  "gender": "Male",
  "contact": "9843332210",
  "address": "123, MG Road, New Delhi"
}
```

### Bulk Add Students

```http
POST /admin/add-bulk-student
Content-Type: multipart/form-data

file: [students.csv or students.xlsx]
```

### Upload Announcement

```http
POST /admin/upload-announcement
Content-Type: multipart/form-data

type: "Academic"
title: "Mid-Sem Exam Schedule"
description: "Mid-semester exams will start from 15th August."
file: [optional: exam_schedule.pdf]
```

**Response:**
```json
{
  "message": "Announcement saved successfully",
  "url": "https://res.cloudinary.com/your_cloud_name/..."
}
```
### Get All Subjects by Course
```http
GET /admin/get-all-subjects-by-course/BCA
```

**Response:**
```json
[
  {
    "subject_id": 1,
    "subject_name": "Mathematics I",
    "subject_code": "MATH101",
    "course": "BCA",
    "credits": 4,
    "description": "Basic Mathematics"
  }
]
```

### Assign Semester-Wise Subjects
```http
POST /admin/add-course-subjects-semster-wise
Content-Type: application/json

{
  "course_id": 1,
  "semester": 3,
  "subject_ids": [5, 7, 9]
}
```

**Response:**
```json
{
  "message": "Subjects for semester updated successfully"
}
```

---


## Notes

- Passwords are randomly generated and sent to users via email.
- All sensitive operations require authentication.
- For bulk uploads, ensure your file matches the required schema.
- Announcement uploads support optional file attachments (PDF, images, etc.) stored on Cloudinary.


- Semester values must be valid for the course (check `total_semesters` in `Courses`).
- `subject_ids` must exist in the `Subjects` table and belong to the same course.

---

For further details, refer to the email:singhsatyaprakash70675@gmail.com