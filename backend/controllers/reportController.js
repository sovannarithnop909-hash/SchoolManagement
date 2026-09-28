const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getStudentReports = async (req, res, next) => {
    try {
        const students = await prisma.student.findMany({ include: { class: true } });
        res.json({ students });
    } catch (error) {
        next(error);
    }
};

const getAttendanceReports = async (req, res, next) => {
    try {
        const where = req.user.role === 'TEACHER'
            ? { class: { teacher: { userId: Number(req.user.id) } } }
            : {};
        const [attendance, teacherAttendance] = await Promise.all([
            prisma.attendance.findMany({ where, include: { student: true, class: true } }),
            prisma.teacherAttendance.findMany({
                where: req.user.role === 'TEACHER'
                    ? { teacher: { userId: Number(req.user.id) } }
                    : {},
                include: { teacher: true },
            }),
        ]);
        res.json({ attendance, teacherAttendance });
    } catch (error) {
        next(error);
    }
};

const getGradeReports = async (req, res, next) => {
    try {
        const where = req.user.role === 'TEACHER'
            ? { subject: { teacher: { userId: Number(req.user.id) } } }
            : {};
        const grades = await prisma.grade.findMany({ where, include: { student: true, subject: true } });
        res.json({ grades });
    } catch (error) {
        next(error);
    }
};

const getFeeReports = async (req, res, next) => {
    try {
        const fees = await prisma.fee.findMany({ include: { student: true } });
        res.json({ fees });
    } catch (error) {
        next(error);
    }
};

module.exports = { getStudentReports, getAttendanceReports, getGradeReports, getFeeReports };
