const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const listPayments = async (req, res, next) => {
    try {
        const payments = await prisma.payment.findMany({
            include: { student: true, feeRecord: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(payments);
    } catch (error) {
        next(error);
    }
};

const createPayment = async (req, res, next) => {
    try {
        const amount = Number(req.body.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Payment amount must be greater than zero' });
        }

        const payment = await prisma.$transaction(async (transaction) => {
            const feeRecordId = req.body.feeRecordId ? Number(req.body.feeRecordId) : null;
            if (feeRecordId) {
                const fee = await transaction.fee.findUnique({ where: { id: feeRecordId } });
                if (!fee) {
                    const error = new Error('Fee record not found');
                    error.statusCode = 404;
                    throw error;
                }
                if (fee.studentId !== Number(req.body.studentId)) {
                    const error = new Error('Payment student does not match the fee record');
                    error.statusCode = 400;
                    throw error;
                }
            }

            const createdPayment = await transaction.payment.create({
                data: {
                    paymentId: req.body.paymentId || undefined,
                    studentId: Number(req.body.studentId),
                    feeRecordId,
                    amount,
                    paymentDate: new Date(req.body.paymentDate || new Date()),
                    paymentMethod: req.body.paymentMethod,
                    referenceNumber: req.body.referenceNumber || null,
                    status: req.body.status || 'SUCCESS',
                },
            });

            if (feeRecordId && createdPayment.status === 'SUCCESS') {
                const [fee, totals] = await Promise.all([
                    transaction.fee.findUnique({ where: { id: feeRecordId } }),
                    transaction.payment.aggregate({
                        where: { feeRecordId, status: 'SUCCESS' },
                        _sum: { amount: true },
                    }),
                ]);
                const paidAmount = Number(totals._sum.amount || 0);
                const feeStatus = paidAmount >= Number(fee.amount)
                    ? 'PAID'
                    : paidAmount > 0 ? 'PARTIAL' : 'PENDING';
                await transaction.fee.update({
                    where: { id: feeRecordId },
                    data: { status: feeStatus },
                });
            }

            return transaction.payment.findUnique({
                where: { id: createdPayment.id },
                include: { student: true, feeRecord: true },
            });
        });
        res.status(201).json(payment);
    } catch (error) {
        next(error);
    }
};

module.exports = { listPayments, createPayment };
