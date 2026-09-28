const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const listGrades = async (req, res, next) => {
    try {
        const grades = await prisma.grade.findMany({
            include: { student: true, subject: true, exam: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(grades);
    } catch (error) {
        next(error);
    }
};

const createGrade = async (req, res, next) => {
    try {
        const { studentId, subjectId, examId, score } = req.body;
        const percentage = Number(score);
        let grade = 'F';
        if (percentage >= 90) grade = 'A';
        else if (percentage >= 80) grade = 'B';
        else if (percentage >= 70) grade = 'C';
        else if (percentage >= 60) grade = 'D';
        else if (percentage >= 50) grade = 'E';

        const created = await prisma.grade.create({
            data: {
                studentId: Number(studentId),
                subjectId: Number(subjectId),
                examId: Number(examId),
                score: Number(score),
                grade,
                remark: percentage >= 50 ? 'Pass' : 'Needs improvement',
                percentage: Number(percentage),
            },
        });
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

module.exports = { listGrades, createGrade };
