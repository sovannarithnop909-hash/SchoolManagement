const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const listClasses = async (req, res, next) => {
    try {
        const where = req.user.role === 'TEACHER'
            ? { teacher: { userId: Number(req.user.id) } }
            : {};
        const classes = await prisma.class.findMany({
            where,
            include: {
                teacher: true,
                students: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(classes);
    } catch (error) {
        next(error);
    }
};

const createClass = async (req, res, next) => {
    try {
        const schoolClass = await prisma.class.create({
            data: {
                classId: req.body.classId,
                name: req.body.name,
                grade: req.body.grade,
                room: req.body.room,
                teacherId: req.body.teacherId ? Number(req.body.teacherId) : null,
                academicYearId: req.body.academicYearId ? Number(req.body.academicYearId) : null,
                status: req.body.status || 'ACTIVE',
            },
        });
        res.status(201).json(schoolClass);
    } catch (error) {
        next(error);
    }
};

const updateClass = async (req, res, next) => {
    try {
        const schoolClass = await prisma.class.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });
        res.json(schoolClass);
    } catch (error) {
        next(error);
    }
};

const deleteClass = async (req, res, next) => {
    try {
        await prisma.class.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { listClasses, createClass, updateClass, deleteClass };
