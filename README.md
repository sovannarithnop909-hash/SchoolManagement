# School Management System

A complete full-stack School Management System built with React + Vite on the frontend, Express + Prisma + MySQL on the backend, and role-based authentication.

## Features

- Student, teacher, class, subject, exam, grade, attendance, fee, payment, notice, report, and user management
- JWT-based auth and role authorization
- Admin, teacher, student, and accountant roles
- Dashboard with charts and summaries
- MySQL database with Prisma ORM
- Responsive, professional SaaS-style UI

## Folder Structure

```text
school-management-system/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── prisma/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── database/
│   ├── schema.sql
│   └── seed.sql
├── README.md
└── .gitignore
```

## Tech Stack

Frontend:
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- Lucide React
- React Hook Form

Backend:
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT
- bcryptjs
- Helmet
- CORS
- Express Rate Limit

## Installation

### 1. Install Node.js
Install Node.js LTS from https://nodejs.org/

### 2. Install MySQL
Install MySQL Community Server locally and create a database named `school_management`.

### 3. Create database
```sql
CREATE DATABASE school_management;
```

### 4. Configure environment variables
Create a file at `backend/.env` based on `.env.example` and set your values.

```env
PORT=5000
JWT_SECRET=your_secure_secret
DATABASE_URL=mysql://root:password@localhost:3306/school_management
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 5. Install frontend dependencies
```bash
cd frontend
npm install
```

### 6. Install backend dependencies
```bash
cd backend
npm install
```

### 7. Run Prisma migration / push
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 8. Seed demo data
```bash
cd backend
node prisma/seed.js
```

### 9. Start backend
```bash
cd backend
npm run dev
```

### 10. Start frontend
```bash
cd frontend
npm run dev
```

## Demo Accounts

- Admin: admin@school.com | password: School@123
- Teacher: teacher@school.com | password: School@123
- Student: student@school.com | password: School@123
- Accountant: accountant@school.com | password: School@123

## API Routes

### Auth
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/profile

### Students
- GET /api/students
- GET /api/students/:id
- POST /api/students
- PUT /api/students/:id
- DELETE /api/students/:id

### Teachers
- GET /api/teachers
- POST /api/teachers
- PUT /api/teachers/:id
- DELETE /api/teachers/:id

### Classes
- GET /api/classes
- POST /api/classes
- PUT /api/classes/:id
- DELETE /api/classes/:id

### Subjects
- GET /api/subjects
- POST /api/subjects
- PUT /api/subjects/:id
- DELETE /api/subjects/:id

### Exams
- GET /api/exams
- POST /api/exams

### Grades
- GET /api/grades
- POST /api/grades

### Attendance
- GET /api/attendance
- POST /api/attendance

### Fees
- GET /api/fees
- POST /api/fees

### Payments
- GET /api/payments
- POST /api/payments

### Notices
- GET /api/notices
- POST /api/notices
- PUT /api/notices/:id
- DELETE /api/notices/:id

### Reports
- GET /api/reports/students
- GET /api/reports/attendance
- GET /api/reports/grades
- GET /api/reports/fees

## Database Schema

The main schema includes tables for:
- users
- students
- teachers
- classes
- subjects
- exams
- grades
- attendance
- fees
- payments
- notices
- academic_years

## Deployment Notes

For production, configure:
- a secure JWT secret
- production MySQL host and credentials
- environment variables for frontend and backend
- reverse proxy or process manager (PM2, Docker, or a hosting provider)
- HTTPS and CORS restrictions

## Security

- Passwords are hashed with bcryptjs
- JWT-based authentication is required for protected routes
- Role-based authorization is enforced for admin, teacher, student, and accountant pages
- Rate limiting and security headers are enabled

## License

MIT

# SchoolManagement
