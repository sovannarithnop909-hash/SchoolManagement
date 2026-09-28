USE school_management;

INSERT INTO academic_years (name, start_date, end_date, status) VALUES
('2025-2026', '2025-09-01', '2026-06-30', 'ACTIVE');

INSERT INTO users (name, email, password_hash, role, status) VALUES
('System Admin', 'admin@school.com', '$2a$10$9Cj1F0a6Wm8hM2xFNlL9huD1o1b6cJb4l0g5YcfS7LJVE4dRznM1m', 'ADMIN', 'ACTIVE'),
('Ms. Carter', 'teacher@school.com', '$2a$10$9Cj1F0a6Wm8hM2xFNlL9huD1o1b6cJb4l0g5YcfS7LJVE4dRznM1m', 'TEACHER', 'ACTIVE'),
('Ava Johnson', 'student@school.com', '$2a$10$9Cj1F0a6Wm8hM2xFNlL9huD1o1b6cJb4l0g5YcfS7LJVE4dRznM1m', 'STUDENT', 'ACTIVE'),
('Mr. Smith', 'accountant@school.com', '$2a$10$9Cj1F0a6Wm8hM2xFNlL9huD1o1b6cJb4l0g5YcfS7LJVE4dRznM1m', 'ACCOUNTANT', 'ACTIVE');

INSERT INTO teachers (teacher_id, user_id, first_name, last_name, gender, dob, email, phone, address, subject, hire_date, status) VALUES
('T-1001', 2, 'Emma', 'Carter', 'FEMALE', '1987-06-12', 'teacher@school.com', '+1234567890', '25 Green Way', 'Mathematics', '2021-08-15', 'ACTIVE');

INSERT INTO classes (class_id, name, grade, room, teacher_id, academic_year_id, status) VALUES
('CLS-101', 'Grade 10-A', '10', 'Room 101', 1, 1, 'ACTIVE'),
('CLS-102', 'Grade 11-B', '11', 'Room 202', 1, 1, 'ACTIVE'),
('CLS-103', 'Grade 9-C', '9', 'Room 303', 1, 1, 'ACTIVE'),
('CLS-104', 'Grade 12-A', '12', 'Room 404', 1, 1, 'ACTIVE'),
('CLS-105', 'Grade 8-B', '8', 'Room 505', 1, 1, 'ACTIVE');

INSERT INTO students (student_id, user_id, first_name, last_name, gender, dob, email, phone, address, parent_name, parent_phone, class_id, enrollment_date, status) VALUES
('ST-1001', 3, 'Ava', 'Johnson', 'FEMALE', '2009-04-05', 'student@school.com', '+1111111111', '4 Oak Lane', 'John Johnson', '+1222222222', 1, '2025-09-01', 'ACTIVE');

INSERT INTO subjects (subject_id, name, code, teacher_id, class_id, credits, status) VALUES
('SUB-101', 'Mathematics', 'MATH101', 1, 1, 4, 'ACTIVE'),
('SUB-102', 'Physics', 'PHY102', 1, 1, 3, 'ACTIVE'),
('SUB-103', 'Biology', 'BIO103', 1, 2, 3, 'ACTIVE'),
('SUB-104', 'English', 'ENG104', 1, 3, 2, 'ACTIVE');

INSERT INTO exams (exam_id, name, type, class_id, start_date, end_date, status) VALUES
('EXM-201', 'Midterm Exam', 'MIDTERM', 1, '2025-11-10', '2025-11-15', 'OPEN'),
('EXM-202', 'Final Exam', 'FINAL', 1, '2026-01-20', '2026-01-27', 'DRAFT');

INSERT INTO fees (fee_id, student_id, fee_type, amount, due_date, academic_year_id, status) VALUES
('FEE-001', 1, 'TUITION', 2200.00, '2025-10-15', 1, 'PENDING'),
('FEE-002', 1, 'LIBRARY', 200.00, '2025-10-20', 1, 'PAID');

INSERT INTO payments (payment_id, student_id, amount, payment_date, payment_method, reference_number, status) VALUES
('PAY-001', 1, 2200.00, '2025-10-05', 'BANK_TRANSFER', 'REF-1001', 'SUCCESS');

INSERT INTO notices (title, description, author, target_audience, publish_date, expiry_date, status) VALUES
('Welcome Back', 'Welcome to the new academic year. Please check your schedule.', 'Admin', 'EVERYONE', '2025-09-01', '2025-12-31', 'PUBLISHED');
