CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','TEACHER','STUDENT','ACCOUNTANT') NOT NULL,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
);

CREATE TABLE academic_years (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teachers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  teacher_id VARCHAR(50) UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender ENUM('MALE','FEMALE','OTHER') NOT NULL,
  dob DATE NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NULL,
  address TEXT NULL,
  subject VARCHAR(100) NOT NULL,
  hire_date DATE NOT NULL,
  profile_photo VARCHAR(255) NULL,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_teachers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id VARCHAR(50) UNIQUE,
  name VARCHAR(100) NOT NULL,
  grade VARCHAR(50) NOT NULL,
  room VARCHAR(50) NOT NULL,
  teacher_id INT NULL,
  academic_year_id INT NULL,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
  CONSTRAINT fk_classes_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE SET NULL
);

CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  student_id VARCHAR(50) UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender ENUM('MALE','FEMALE','OTHER') NOT NULL,
  dob DATE NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  address TEXT NULL,
  parent_name VARCHAR(150) NULL,
  parent_phone VARCHAR(30) NULL,
  class_id INT NULL,
  enrollment_date DATE NOT NULL,
  profile_photo VARCHAR(255) NULL,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_students_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

CREATE TABLE subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_id VARCHAR(50) UNIQUE,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  teacher_id INT NULL,
  class_id INT NULL,
  credits INT NOT NULL DEFAULT 1,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_subjects_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
  CONSTRAINT fk_subjects_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

CREATE TABLE exams (
  id INT PRIMARY KEY AUTO_INCREMENT,
  exam_id VARCHAR(50) UNIQUE,
  name VARCHAR(150) NOT NULL,
  type ENUM('MIDTERM','FINAL','MONTHLY','QUIZ') NOT NULL,
  class_id INT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('DRAFT','OPEN','CLOSED') DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exams_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

CREATE TABLE grades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  exam_id INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  grade VARCHAR(10) NOT NULL,
  remark VARCHAR(255) NULL,
  percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_grades_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_grades_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  CONSTRAINT fk_grades_exam FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

CREATE TABLE attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  class_id INT NOT NULL,
  subject_id INT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('PRESENT','ABSENT','LATE','EXCUSED') NOT NULL,
  remark VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);

CREATE TABLE fees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fee_id VARCHAR(50) UNIQUE,
  student_id INT NOT NULL,
  fee_type ENUM('TUITION','REGISTRATION','LIBRARY','TRANSPORTATION','UNIFORM','OTHER') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  academic_year_id INT NULL,
  status ENUM('PENDING','PAID','PARTIAL','OVERDUE') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fees_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_fees_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE SET NULL
);

CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  payment_id VARCHAR(50) UNIQUE,
  student_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method ENUM('CASH','BANK_TRANSFER','CARD','ONLINE_PAYMENT') NOT NULL,
  reference_number VARCHAR(100) NULL,
  status ENUM('SUCCESS','PENDING','FAILED') DEFAULT 'SUCCESS',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE notices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  author VARCHAR(150) NOT NULL,
  target_audience ENUM('EVERYONE','STUDENTS','TEACHERS','PARENTS','SPECIFIC_CLASS') NOT NULL,
  publish_date DATE NOT NULL,
  expiry_date DATE NULL,
  status ENUM('PUBLISHED','DRAFT','ARCHIVED') DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, attendance_date);
CREATE INDEX idx_fees_student_status ON fees(student_id, status);
