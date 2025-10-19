
# University Management System REST API Documentation

This documentation describes all endpoints, required parameters, request/response formats, and underlying MySQL database structure for your University Management System backend. It includes updates and clarifications based on current code, routes, and SQL schema files.

***

## Table of Contents

- [Authentication](#authentication)
- [Admin Endpoints](#admin-endpoints)
- [Faculty Endpoints](#faculty-endpoints)
- [Student Endpoints](#student-endpoints)
- [Announcement Endpoints](#announcement-endpoints)
- [Courses, Branches, Subjects, Sections](#courses-branches-subjects-sections)
- [Department Endpoints](#department-endpoints)
- [Bulk Operations](#bulk-operations)
- [Attendance](#attendance)
- [Database Models](#database-models)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)

***

## Authentication

- All login endpoints return a JWT token. Token (`Authorization: Bearer <token>`) must be included in headers for protected routes.
- Passwords must be provided on login; new users get random passwords via email.
- Error responses are standardized with appropriate HTTP codes.

***

## Admin Endpoints

| Endpoint | Method | Description |
| :-- | :-- | :-- |
| `/admin/signin` | POST | Admin login |
| `/admin/add-student` | POST | Add single student |
| `/admin/add-bulk-student` | POST | Bulk add students (CSV/Excel upload) |
| `/admin/upload-announcement` | POST | Upload announcement, optional file |
| `/admin/add-new-course` | POST | Add a new course |
| `/admin/get-all-courses` | GET | List all courses |
| `/admin/add-branch` | POST | Add a new branch for a course |
| `/admin/get-all-branches` | GET | List all course branches |
| `/admin/add-new-subject` | POST | Add a subject |
| `/admin/get-all-subjects` | GET | List all subjects |
| `/admin/get-all-subjects-by-course/:course` | GET | Subjects for a specific course |
| `/admin/add-section` | POST | Add section to course/semester |
| `/admin/get-all-sections/:course_id` | GET | Sections for given course |
| `/admin/add-students-to-section` | POST | Assign multiple students to a section |
| `/admin/add-department` | POST | Add a new department |
| `/admin/get-all-departments` | GET | List all departments |
| `/admin/add-faculty` | POST | Add faculty member |
| `/admin/get-all-faculty` | GET | List all faculty |
| `/admin/assign-course-secction-subject-to-faculty` | POST | Assign subject/course/section to faculty |

### Request/Response Samples

#### Admin Login

```http
POST /admin/signin
Content-Type: application/json
{
  "email": "admin@email.com",
  "password": "adminPassword"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "<jwt-token>",
  "role": "admin"
}
```


#### Add Student

```http
POST /admin/add-student
Content-Type: application/json
{
  "name": "Student Name",
  "email": "student@email.com",
  "course_id": 1,
  "branch_id": 2,
  "section_id": 3,
  "semester": 5,
  "year": 2025,
  "dob": "2004-07-15",
  "gender": "Male",
  "nationality": "Indian",
  "blood_group": "O+",
  "contact": "9876543210",
  "address": "College St, Delhi",
  "father_name": "Father Name",
  "father_contact": "9876543200",
  "father_occupation": "Engineer",
  "mother_name": "Mother Name",
  "mother_contact": "9876543211",
  "mother_occupation": "Doctor"
}
```

Response:

```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "student_id": 1023,
    "university_id": "10023",
    "roll_no": "20023"
  }
}
```


#### Bulk Add Students

```http
POST /admin/add-bulk-student
Content-Type: multipart/form-data
file: [students.csv or students.xlsx]
```

Response:

```json
{
  "message": "Bulk students added successfully",
  "added": 52,
  "failedEmails": [
    { "email": "fail1@email.com", "error": "Email send failure" }
  ]
}
```


#### Add Faculty

```http
POST /admin/add-faculty
Content-Type: application/json
{
  "name": "Faculty Name",
  "department_id": 3,
  "email": "faculty@email.com",
  "dob": "1980-01-01",
  "contact_number": "9123456789",
  "address": "Faculty Address",
  "gender": "Female"
}
```

Response:

```json
{
  "message": "Faculty added successfully"
}
```


#### Assign Subject to Faculty

```http
POST /admin/assign-course-secction-subject-to-faculty
Content-Type: application/json
{
  "faculty_id": 5,
  "subject_id": 12,
  "course_id": 1,
  "branch_id": 2,
  "section_id": 3,
  "semester": 5
}
```

Response:

```json
{
  "message": "Subject assigned to faculty successfully"
}
```


***

## Faculty Endpoints

| Endpoint | Method | Description |
| :-- | :-- | :-- |
| `/faculty/login` | POST | Faculty login |
| `/faculty/reset-password` | POST | Faculty password reset |
| `/faculty/get-faculty` | GET | Get all faculty members |
| `/faculty/assigned-subjects/:faculty_id` | GET | Subjects assigned to faculty |
| `/faculty/get-section/:faculty_id` | GET | Sections for faculty's subjects |
| `/faculty/get-student/:section_id` | GET | Students in a section |
| `/faculty/mark-attendance` | POST | Mark student attendance |
| `/faculty/get-announcement` | GET | List all announcements |

### Request/Response Samples

#### Faculty Login

```http
POST /faculty/login
Content-Type: application/json
{
  "email": "faculty@email.com",
  "password": "facultyPassword"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "<jwt-token>",
  "role": "faculty"
}
```


#### Mark Attendance

```http
POST /faculty/mark-attendance
Content-Type: application/json
{
  "faculty_subject_id": 2,
  "date": "2025-08-17",
  "attendance": [
    { "student_id": 1012, "status": "Present" },
    { "student_id": 1013, "status": "Absent" }
  ]
}
```

Response:

```json
{
  "message": "Attendance marked successfully"
}
```


***

## Student Endpoints

| Endpoint | Method | Description |
| :-- | :-- | :-- |
| `/student/login` | POST | Student login |
| `/student/reset-password` | POST | Student password reset |
| `/student/profile/:student_id` | GET | Get student profile |
| `/student/current-subjects/:student_id` | GET | Get current subjects assigned |
| `/student/get-announcement` | GET | Get current announcements |
| `/student/get-student-attendance/:student_id` | GET | Get student's attendance |

### Request/Response Samples

#### Student Login

```http
POST /student/login
Content-Type: application/json
{
  "email": "student@email.com",
  "password": "studentPassword"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "<jwt-token>",
  "role": "student"
}
```


#### Student Attendance

```http
GET /student/get-student-attendance/1012
```

Response:

```json
[
  {
    "subject_id": 1,
    "subject_name": "Mathematics I",
    "total_classes": 30,
    "total_present": 28,
    "total_absent": 2,
    "percentage": 93.33
  }
]
```


***

## Announcement Endpoints

| Endpoint | Method | Description |
| :-- | :-- | :-- |
| `/admin/upload-announcement` | POST | Upload announcement (with file) |
| `/faculty/get-announcement` | GET | List all announcements |
| `/student/get-announcement` | GET | List all announcements |

### Sample

```http
POST /admin/upload-announcement
Content-Type: multipart/form-data
type: "Academic"
title: "Exam Notice"
description: "Exam on 1st Sep"
announcement_file: [exam.pdf]
```

Response:

```json
{
  "message": "Announcement saved successfully",
  "url": "https://res.cloudinary.com/..."
}
```


***

## Courses, Branches, Subjects, Sections

| Endpoint | Method | Description |
| :-- | :-- | :-- |
| `/admin/add-new-course` | POST | Add course |
| `/admin/get-all-courses` | GET | List courses |
| `/admin/add-branch` | POST | Add branch |
| `/admin/get-all-branches` | GET | List branches |
| `/admin/add-new-subject` | POST | Add subject |
| `/admin/get-all-subjects` | GET | List subjects |
| `/admin/get-all-subjects-by-course/:course` | GET | Subjects for course |
| `/admin/add-section` | POST | Add section |
| `/admin/get-all-sections/:course_id` | GET | List sections for course |


***

## Department Endpoints

| Endpoint | Method | Description |
| :-- | :-- | :-- |
| `/admin/add-department` | POST | Add department |
| `/admin/get-all-departments` | GET | List departments |


***

## Bulk Operations

- Bulk add students via `/admin/add-bulk-student` uploading CSV/Excel matching student table columns.
- Failed emails are reported in response.
- All students get credentials via email.

***

## Attendance

- Attendance is per student, subject, date, marked by faculty.
- See table [Attendance](#attendance-table).
- Duplicate (student, subject, date) records are prevented.

***

## 📑 Database Models

## **Admin**

| Column     | Type     | Constraints                |
|------------|----------|-----------------------------|
| admin_id   | INT      | **PK**, AUTO_INCREMENT      |
| name       | VARCHAR  | NOT NULL                    |
| email      | VARCHAR  | UNIQUE, NOT NULL            |
| password   | VARCHAR  | Hashed, NOT NULL            |

---

## **Faculty**

| Column          | Type     | Constraints                          |
|-----------------|----------|---------------------------------------|
| faculty_id      | INT      | **PK**, AUTO_INCREMENT                |
| name            | VARCHAR  | NOT NULL                              |
| department_id   | INT      | **FK → departments.department_id**    |
| email           | VARCHAR  | UNIQUE, NOT NULL                      |
| password        | VARCHAR  | Hashed                                |
| dob             | DATE     |                                       |
| contact_number  | VARCHAR  |                                       |
| address         | TEXT     |                                       |
| gender          | VARCHAR  |                                       |

---

## **Student**

| Column             | Type     | Constraints                                      |
|--------------------|----------|--------------------------------------------------|
| student_id         | INT      | **PK**, AUTO_INCREMENT                           |
| university_id      | VARCHAR  | UNIQUE                                           |
| name               | VARCHAR  | NOT NULL                                         |
| email              | VARCHAR  | UNIQUE, NOT NULL                                 |
| password           | VARCHAR  | Hashed                                           |
| roll_no            | VARCHAR  | UNIQUE                                           |
| course_id          | INT      | **FK → courses.course_id**                       |
| branch_id          | INT      | **FK → course_branch.branch_id**                 |
| section_id         | INT      | **FK → sections.section_id**                     |
| semester           | INT      | NOT NULL                                         |
| year               | INT      | NOT NULL                                         |
| dob                | DATE     |                                                  |
| gender             | VARCHAR  |                                                  |
| nationality        | VARCHAR  |                                                  |
| blood_group        | VARCHAR  |                                                  |
| contact            | VARCHAR  |                                                  |
| address            | TEXT     |                                                  |
| father_name        | VARCHAR  |                                                  |
| father_contact     | VARCHAR  |                                                  |
| father_occupation  | VARCHAR  |                                                  |
| mother_name        | VARCHAR  |                                                  |
| mother_contact     | VARCHAR  |                                                  |
| mother_occupation  | VARCHAR  |                                                  |

---

## **Announcement**

| Column          | Type      | Constraints                              |
|-----------------|-----------|-------------------------------------------|
| announcement_id | INT       | **PK**, AUTO_INCREMENT                   |
| title           | VARCHAR   | NOT NULL                                 |
| type            | ENUM      | (‘Holiday’, ‘Academic’, ‘Sports’, etc.)  |
| description     | TEXT      |                                           |
| file_url        | VARCHAR   |                                           |
| admin_id        | INT       | **FK → admin.admin_id**                   |
| created_at      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP                 |

---

## **Courses**

| Column           | Type     | Constraints                     |
|------------------|----------|----------------------------------|
| course_id        | INT      | **PK**, AUTO_INCREMENT           |
| course_name      | VARCHAR  | UNIQUE, NOT NULL                 |
| duration_years   | INT      |                                  |
| total_semesters  | INT      |                                  |
| course_code      | VARCHAR  | UNIQUE                           |
| department       | VARCHAR  |                                  |
| description      | TEXT     |                                  |

---

## **Subjects**

| Column        | Type     | Constraints                     |
|---------------|----------|----------------------------------|
| subject_id    | INT      | **PK**, AUTO_INCREMENT           |
| subject_name  | VARCHAR  | NOT NULL                         |
| subject_code  | VARCHAR  | UNIQUE                           |
| course        | INT      | **FK → courses.course_id**       |
| credits       | INT      |                                  |
| description   | TEXT     |                                  |

---

## **Course_Subjects**

| Column     | Type | Constraints                                               |
|------------|------|----------------------------------------------------------|
| cs_id      | INT  | **PK**, AUTO_INCREMENT                                    |
| course_id  | INT  | **FK → courses.course_id**                                |
| subject_id | INT  | **FK → subjects.subject_id**                              |
| semester   | INT  | NOT NULL                                                  |
| is_active  | BOOL | DEFAULT true                                              |
| UNIQUE     | (course_id, subject_id, semester)                                |

---

## **Attendance**

| Column             | Type     | Constraints                                                   |
|--------------------|----------|---------------------------------------------------------------|
| attendance_id      | INT      | **PK**, AUTO_INCREMENT                                        |
| student_id         | INT      | **FK → student.student_id**                                   |
| faculty_subject_id | INT      | **FK → course_subjects.cs_id**                                |
| date               | DATE     | NOT NULL                                                      |
| status             | ENUM     | (‘Present’, ‘Absent’)                                         |
| UNIQUE             | (student_id, faculty_subject_id, date)                                   |

---

## **Sections**

| Column       | Type     | Constraints                            |
|--------------|----------|-----------------------------------------|
| section_id   | INT      | **PK**, AUTO_INCREMENT                 |
| section_name | VARCHAR  | UNIQUE, NOT NULL                       |
| course_id    | INT      | **FK → courses.course_id**             |
| branch_id    | INT      | **FK → course_branch.branch_id**       |
| semester     | INT      | NOT NULL                               |

---

## **Departments**

| Column           | Type     | Constraints                    |
|------------------|----------|---------------------------------|
| department_id    | INT      | **PK**, AUTO_INCREMENT          |
| department_name  | VARCHAR  | UNIQUE, NOT NULL                |
| dept_code        | VARCHAR  | UNIQUE                          |
| hod_name         | VARCHAR  |                                 |
| hod_email        | VARCHAR  | UNIQUE                          |
| phone            | VARCHAR  |                                 |
| office_location  | VARCHAR  |                                 |
| description      | TEXT     |                                 |

---
***

## Environment Variables

Set these in your `.env` file:


| Variable | Description |
| :-- | :-- |
| database_pass | MySQL password |
| PORT | Node server port |
| JWT_SECRET_KEY | JWT secret |
| ADMIN_EMAIL | Email for sending credentials |
| ADMIN_EMAIL_PASS | Email password/app password |
| CLOUD_NAME | Cloudinary cloud name |
| CLOUD_API_KEY | Cloudinary API key |
| CLOUD_SECRET_KEY | Cloudinary API secret |


***

## Setup Instructions

**Install Dependencies**

```sh
npm install
```

**Configure `.env` File**

```sh
database_pass=your_mysql_password
PORT=3000
JWT_SECRET_KEY=secretkey
...
```

**Setup Database**
Run all SQL files in given order.
**Start the Server**

```sh
node app.js
```


***

### Notes

- Passwords are securely hashed, randomly generated, and emailed for new users.
- All email send failures are reported in bulk operations.
- Announcements can include an optional file uploaded to Cloudinary.
- Subject/course/semester relationships are strictly validated for assignments.
- All endpoints return informative error codes and messages.

***

This documentation is complete and reflects the current backend API and database design. Adjust endpoint details if controllers, routes, or schema files change.