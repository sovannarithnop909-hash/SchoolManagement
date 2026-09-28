const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const listSubjects = async (req, res, next) => {
    try {
        const where = req.user.role === 'TEACHER'
            ? { teacher: { userId: Number(req.user.id) } }
            : {};
        const subjects = await prisma.subject.findMany({
            where,
            include: { teacher: true, class: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(subjects);
    } catch (error) {
        next(error);
    }
};

const createSubject = async (req, res, next) => {
    try {
        let teacherId = req.body.teacherId ? Number(req.body.teacherId) : null;
        const classId = req.body.classId ? Number(req.body.classId) : null;
        if (req.user.role === 'TEACHER') {
            const teacher = await prisma.teacher.findUnique({
                where: { userId: Number(req.user.id) },
                select: { id: true },
            });
            if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });
            if (classId) {
                const assignedClass = await prisma.class.findFirst({
                    where: { id: classId, teacherId: teacher.id },
                    select: { id: true },
                });
                if (!assignedClass) return res.status(403).json({ message: 'You can only add subjects to your assigned classes' });
            }
            teacherId = teacher.id;
        }
        const subject = await prisma.subject.create({
            data: {
                subjectId: req.body.subjectId,
                name: req.body.name,
                code: req.body.code,
                teacherId,
                classId,
                credits: Number(req.body.credits || 1),
                status: req.body.status || 'ACTIVE',
            },
        });
        res.status(201).json(subject);
    } catch (error) {
        next(error);
    }
};

const updateSubject = async (req, res, next) => {
    try {
        if (req.user.role === 'TEACHER') {
            const assignedSubject = await prisma.subject.findFirst({
                where: {
                    id: Number(req.params.id),
                    teacher: { userId: Number(req.user.id) },
                },
                select: { id: true },
            });
            if (!assignedSubject) return res.status(404).json({ message: 'Subject not found in your assignments' });
        }
        const subject = await prisma.subject.update({
            where: { id: Number(req.params.id) },
            data: {
                ...req.body,
                credits: req.body.credits ? Number(req.body.credits) : undefined,
            },
        });
        res.json(subject);
    } catch (error) {
        next(error);
    }
};

const deleteSubject = async (req, res, next) => {
    try {
        await prisma.subject.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { listSubjects, createSubject, updateSubject, deleteSubject };
