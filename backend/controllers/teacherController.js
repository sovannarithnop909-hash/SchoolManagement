const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const listTeachers = async (req, res, next) => {
    try {
        const where = req.user.role === 'TEACHER'
            ? { userId: Number(req.user.id) }
            : {};
        const teachers = await prisma.teacher.findMany({
            where,
            include: { classes: true, subjects: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(teachers);
    } catch (error) {
        next(error);
    }
};

const getTeacherByUserId = async (req, res, next) => {
    try {
        const teacher = await prisma.teacher.findUnique({
            where: { userId: Number(req.user.id) },
            include: {
                classes: { include: { students: true } },
                subjects: true,
                attendanceRecords: {
                    orderBy: { attendanceDate: 'desc' },
                    take: 10,
                },
            },
        });

        if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });
        res.json(teacher);
    } catch (error) {
        next(error);
    }
};

const createTeacher = async (req, res, next) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ message: 'An initial password is required for the teacher account' });
        }

        const result = await prisma.$transaction(async (transaction) => {
            const user = await transaction.user.create({
                data: {
                    name: `${req.body.firstName} ${req.body.lastName}`.trim(),
                    email: req.body.email,
                    passwordHash: await bcrypt.hash(req.body.password, 10),
                    role: 'TEACHER',
                },
            });
            const teacher = await transaction.teacher.create({
                data: {
                    teacherId: req.body.teacherId,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    gender: req.body.gender,
                    dob: req.body.dob ? new Date(req.body.dob) : null,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address,
                    subject: req.body.subject,
                    hireDate: new Date(req.body.hireDate || new Date()),
                    profilePhoto: req.body.profilePhoto,
                    status: req.body.status || 'ACTIVE',
                    userId: user.id,
                },
            });
            return {
                ...teacher,
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
            };
        });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const updateTeacher = async (req, res, next) => {
    try {
        const teacher = await prisma.teacher.update({
            where: { id: Number(req.params.id) },
            data: {
                ...req.body,
                dob: req.body.dob ? new Date(req.body.dob) : undefined,
                hireDate: req.body.hireDate ? new Date(req.body.hireDate) : undefined,
            },
        });
        res.json(teacher);
    } catch (error) {
        next(error);
    }
};

const deleteTeacher = async (req, res, next) => {
    try {
        await prisma.teacher.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listTeachers,
    getTeacherByUserId,
    createTeacher,
    updateTeacher,
    deleteTeacher,
};
