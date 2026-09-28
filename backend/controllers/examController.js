const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const listExams = async (req, res, next) => {
    try {
        const where = req.user.role === 'TEACHER'
            ? { class: { teacher: { userId: Number(req.user.id) } } }
            : {};
        const exams = await prisma.exam.findMany({
            where,
            include: { class: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(exams);
    } catch (error) {
        next(error);
    }
};

const createExam = async (req, res, next) => {
    try {
        const exam = await prisma.exam.create({
            data: {
                examId: req.body.examId,
                name: req.body.name,
                type: req.body.type,
                classId: req.body.classId ? Number(req.body.classId) : null,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
                status: req.body.status || 'DRAFT',
            },
        });
        res.status(201).json(exam);
    } catch (error) {
        next(error);
    }
};

module.exports = { listExams, createExam };
