const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const classRoutes = require('./routes/classRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const examRoutes = require('./routes/examRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const feeRoutes = require('./routes/feeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const { authenticateToken } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(helmet());
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: (origin, callback) => {
        const isLocalDevelopmentOrigin = process.env.NODE_ENV !== 'production'
            && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
        callback(null, !origin || origin === clientOrigin || isLocalDevelopmentOrigin);
    },
    credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health',
});
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { message: 'Too many unsuccessful login attempts. Please try again later.' },
});
app.use('/api', apiLimiter);

app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'ok', message: 'School Management API is running' });
    } catch (error) {
        res.status(503).json({ status: 'error', message: 'Database connection failed' });
    }
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/students', authenticateToken, studentRoutes);
app.use('/api/teachers', authenticateToken, teacherRoutes);
app.use('/api/classes', authenticateToken, classRoutes);
app.use('/api/subjects', authenticateToken, subjectRoutes);
app.use('/api/exams', authenticateToken, examRoutes);
app.use('/api/grades', authenticateToken, gradeRoutes);
app.use('/api/attendance', authenticateToken, attendanceRoutes);
app.use('/api/fees', authenticateToken, feeRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/notices', authenticateToken, noticeRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);
app.use('/api/users', authenticateToken, userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`School Management API running on port ${PORT}`);
});

module.exports = { app, prisma };
