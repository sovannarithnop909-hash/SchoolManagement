const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'You do not have access to this resource' });
    }
    next();
};

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: Number(req.user.id) } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        req.currentUser = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { authenticateToken, authorizeRoles, getCurrentUser };
