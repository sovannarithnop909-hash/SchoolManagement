const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const listNotices = async (req, res, next) => {
    try {
        const notices = await prisma.notice.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(notices);
    } catch (error) {
        next(error);
    }
};

const createNotice = async (req, res, next) => {
    try {
        const notice = await prisma.notice.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                author: req.body.author,
                targetAudience: req.body.targetAudience,
                publishDate: new Date(req.body.publishDate),
                expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
                status: req.body.status || 'DRAFT',
            },
        });
        res.status(201).json(notice);
    } catch (error) {
        next(error);
    }
};

const updateNotice = async (req, res, next) => {
    try {
        const notice = await prisma.notice.update({
            where: { id: Number(req.params.id) },
            data: {
                ...req.body,
                publishDate: req.body.publishDate ? new Date(req.body.publishDate) : undefined,
                expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined,
            },
        });
        res.json(notice);
    } catch (error) {
        next(error);
    }
};

const deleteNotice = async (req, res, next) => {
    try {
        await prisma.notice.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { listNotices, createNotice, updateNotice, deleteNotice };
