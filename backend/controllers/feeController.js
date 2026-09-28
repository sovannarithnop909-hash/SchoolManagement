const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const listFees = async (req, res, next) => {
    try {
        const fees = await prisma.fee.findMany({
            include: { student: true, academicYear: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(fees);
    } catch (error) {
        next(error);
    }
};

const createFee = async (req, res, next) => {
    try {
        const fee = await prisma.fee.create({
            data: {
                feeId: req.body.feeId,
                studentId: Number(req.body.studentId),
                feeType: req.body.feeType,
                amount: Number(req.body.amount),
                dueDate: new Date(req.body.dueDate),
                academicYearId: req.body.academicYearId ? Number(req.body.academicYearId) : null,
                status: req.body.status || 'PENDING',
            },
        });
        res.status(201).json(fee);
    } catch (error) {
        next(error);
    }
};

module.exports = { listFees, createFee };
