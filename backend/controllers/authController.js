const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const MAX_PROFILE_PHOTO_BYTES = 512 * 1024;

const createToken = (user) => jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
);

const register = async (req, res, next) => {
    try {
        const { name, email, password, role = 'STUDENT' } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
            },
        });

        const token = createToken(user);
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = createToken(user);
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.user.id) },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                profilePhoto: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        next(error);
    }
};

const updateProfilePhoto = async (req, res, next) => {
    try {
        const profilePhoto = req.body.profilePhoto;
        const isRemovingPhoto = profilePhoto === null;
        const match = typeof profilePhoto === 'string'
            ? /^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/.exec(profilePhoto)
            : null;

        if (!isRemovingPhoto && !match) {
            return res.status(400).json({ message: 'A valid JPEG profile photo is required' });
        }

        if (!isRemovingPhoto) {
            const image = Buffer.from(match[1], 'base64');
            if (image.length > MAX_PROFILE_PHOTO_BYTES) {
                return res.status(413).json({ message: 'Profile photo must be 512 KB or smaller' });
            }
            if (image[0] !== 0xff || image[1] !== 0xd8 || image[2] !== 0xff) {
                return res.status(400).json({ message: 'The uploaded file is not a valid JPEG image' });
            }
        }

        const user = await prisma.user.update({
            where: { id: Number(req.user.id) },
            data: { profilePhoto },
            select: { profilePhoto: true },
        });

        res.json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getProfile, updateProfilePhoto };
