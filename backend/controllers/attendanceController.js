const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const listAttendance = async (req, res, next) => {
    try {
        const where = req.user.role === 'TEACHER'
            ? { class: { teacher: { userId: Number(req.user.id) } } }
            : {};
        const attendance = await prisma.attendance.findMany({
            where,
            include: { student: true, class: true, subject: true },
            orderBy: { attendanceDate: 'desc' },
        });
        res.json(attendance);
    } catch (error) {
        next(error);
    }
};

const listOwnAttendance = async (req, res, next) => {
    try {
        const student = await prisma.student.findUnique({
            where: { userId: Number(req.user.id) },
            select: { id: true },
        });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const attendance = await prisma.attendance.findMany({
            where: { studentId: student.id },
            include: { class: true, subject: true },
            orderBy: { attendanceDate: 'desc' },
        });
        res.json(attendance);
    } catch (error) {
        next(error);
    }
};

const getAttendanceQrToken = async (req, res, next) => {
    try {
        const profile = req.user.role === 'STUDENT'
            ? await prisma.student.findUnique({
                where: { userId: Number(req.user.id) },
                select: { id: true },
            })
            : await prisma.teacher.findUnique({
                where: { userId: Number(req.user.id) },
                select: { id: true },
            });

        if (!profile) return res.status(404).json({ message: 'Attendance profile not found' });

        const token = jwt.sign(
            {
                profileId: profile.id,
                role: req.user.role,
                purpose: 'attendance-check-in',
            },
            process.env.JWT_SECRET || 'dev-secret',
            { expiresIn: '5m' },
        );
        res.json({ token, expiresInSeconds: 300 });
    } catch (error) {
        next(error);
    }
};

const markAttendanceFromQr = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: 'QR token is required' });

        let identity;
        try {
            identity = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        } catch {
            return res.status(401).json({ message: 'QR code is invalid or expired' });
        }
        if (identity.purpose !== 'attendance-check-in') {
            return res.status(400).json({ message: 'This QR code is not an attendance credential' });
        }

        const attendanceDate = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
        if (identity.role === 'STUDENT') {
            const student = await prisma.student.findUnique({
                where: { id: Number(identity.profileId) },
                include: { class: true },
            });
            if (!student || !student.classId) {
                return res.status(404).json({ message: 'Student or assigned class not found' });
            }
            if (req.user.role === 'TEACHER') {
                const teacher = await prisma.teacher.findUnique({
                    where: { userId: Number(req.user.id) },
                    select: { id: true },
                });
                if (!teacher || student.class?.teacherId !== teacher.id) {
                    return res.status(403).json({ message: 'You can only check in students from your assigned classes' });
                }
            }

            const existing = await prisma.attendance.findFirst({
                where: {
                    studentId: student.id,
                    classId: student.classId,
                    attendanceDate,
                    subjectId: null,
                },
            });
            if (existing) return res.status(409).json({ message: 'Student is already checked in today' });

            const record = await prisma.attendance.create({
                data: {
                    studentId: student.id,
                    classId: student.classId,
                    attendanceDate,
                    status: 'PRESENT',
                    remark: 'QR check-in',
                },
                include: { student: true, class: true },
            });
            return res.status(201).json({ type: 'STUDENT', record });
        }

        if (identity.role === 'TEACHER') {
            const teacher = await prisma.teacher.findUnique({
                where: { id: Number(identity.profileId) },
            });
            if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });

            const existing = await prisma.teacherAttendance.findUnique({
                where: {
                    teacherId_attendanceDate: {
                        teacherId: teacher.id,
                        attendanceDate,
                    },
                },
            });
            if (existing) return res.status(409).json({ message: 'Teacher is already checked in today' });

            const record = await prisma.teacherAttendance.create({
                data: {
                    teacherId: teacher.id,
                    attendanceDate,
                    status: 'PRESENT',
                },
                include: { teacher: true },
            });
            return res.status(201).json({ type: 'TEACHER', record });
        }

        return res.status(400).json({ message: 'Unsupported attendance QR role' });
    } catch (error) {
        next(error);
    }
};

const createAttendance = async (req, res, next) => {
    try {
        const studentId = Number(req.body.studentId);
        const classId = Number(req.body.classId);
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { classId: true },
        });
        if (!student || student.classId !== classId) {
            return res.status(400).json({ message: 'Selected class does not match the student enrollment' });
        }
        if (req.user.role === 'TEACHER') {
            const assignedClass = await prisma.class.findFirst({
                where: {
                    id: classId,
                    teacher: { userId: Number(req.user.id) },
                },
                select: { id: true },
            });
            if (!assignedClass) return res.status(403).json({ message: 'You can only take attendance for your assigned classes' });
        }

        const record = await prisma.attendance.create({
            data: {
                studentId,
                classId,
                subjectId: req.body.subjectId ? Number(req.body.subjectId) : null,
                attendanceDate: new Date(req.body.attendanceDate),
                status: req.body.status,
                remark: req.body.remark || '',
            },
        });
        res.status(201).json(record);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listAttendance,
    listOwnAttendance,
    getAttendanceQrToken,
    markAttendanceFromQr,
    createAttendance,
};
