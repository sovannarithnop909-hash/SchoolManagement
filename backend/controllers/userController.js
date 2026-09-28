const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const listUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password || 'school123', 10);
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                passwordHash,
                role: req.body.role || 'STUDENT',
                status: req.body.status || 'ACTIVE',
            },
        });
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: {
                name: req.body.name,
                email: req.body.email,
                role: req.body.role,
                status: req.body.status,
            },
        });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await prisma.user.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { listUsers, createUser, updateUser, deleteUser };
