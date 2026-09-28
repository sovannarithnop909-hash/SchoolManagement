const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const getStudents = async (req, res, next) => {
    try {
        const where = req.user.role === 'TEACHER'
            ? { class: { teacher: { userId: Number(req.user.id) } } }
            : {};
        const students = await prisma.student.findMany({
            where,
            include: {
                class: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(students);
    } catch (error) {
        next(error);
    }
};

const getStudentByUserId = async (req, res, next) => {
    try {
        const student = await prisma.student.findUnique({
            where: { userId: Number(req.user.id) },
            include: {
                class: true,
                fees: { orderBy: { dueDate: 'asc' } },
                payments: { orderBy: { paymentDate: 'desc' } },
                attendance: {
                    orderBy: { attendanceDate: 'desc' },
                    take: 10,
                },
                grades: {
                    include: { subject: true, exam: true },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });

        if (!student) return res.status(404).json({ message: 'Student profile not found' });
        res.json(student);
    } catch (error) {
        next(error);
    }
};

const getStudentById = async (req, res, next) => {
    try {
        const where = { id: Number(req.params.id) };
        if (req.user.role === 'TEACHER') {
            where.class = { teacher: { userId: Number(req.user.id) } };
        }
        const student = await prisma.student.findUnique({
            where,
            include: {
                class: true,
                fees: true,
                payments: true,
                attendance: true,
                grades: { include: { subject: true, exam: true } },
            },
        });

        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (error) {
        next(error);
    }
};

const createStudent = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload.password) {
            return res.status(400).json({ message: 'An initial password is required for the student account' });
        }
        if (req.user.role === 'TEACHER' && payload.classId) {
            const assignedClass = await prisma.class.findFirst({
                where: {
                    id: Number(payload.classId),
                    teacher: { userId: Number(req.user.id) },
                },
                select: { id: true },
            });
            if (!assignedClass) {
                return res.status(403).json({ message: 'You can only enroll students in your assigned classes' });
            }
        }

        const result = await prisma.$transaction(async (transaction) => {
            const user = await transaction.user.create({
                data: {
                    name: `${payload.firstName} ${payload.lastName}`.trim(),
                    email: payload.email,
                    passwordHash: await bcrypt.hash(payload.password, 10),
                    role: 'STUDENT',
                },
            });
            const student = await transaction.student.create({
                data: {
                    studentId: payload.studentId,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    gender: payload.gender,
                    dob: payload.dob ? new Date(payload.dob) : null,
                    email: payload.email,
                    phone: payload.phone,
                    address: payload.address,
                    parentName: payload.parentName,
                    parentPhone: payload.parentPhone,
                    classId: payload.classId ? Number(payload.classId) : null,
                    enrollmentDate: new Date(payload.enrollmentDate || new Date()),
                    profilePhoto: payload.profilePhoto,
                    status: payload.status || 'ACTIVE',
                    userId: user.id,
                },
            });
            const tuitionAmount = Number(payload.tuitionAmount || 0);
            const initialFee = tuitionAmount > 0
                ? await transaction.fee.create({
                    data: {
                        studentId: student.id,
                        feeType: 'TUITION',
                        amount: tuitionAmount,
                        dueDate: new Date(payload.feeDueDate || payload.enrollmentDate || new Date()),
                        status: 'PENDING',
                    },
                })
                : null;

            return {
                student,
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
                initialFee,
            };
        });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const updateStudent = async (req, res, next) => {
    try {
        const payload = req.body;
        if (req.user.role === 'TEACHER') {
            const assignedStudent = await prisma.student.findFirst({
                where: {
                    id: Number(req.params.id),
                    class: { teacher: { userId: Number(req.user.id) } },
                },
                select: { id: true },
            });
            if (!assignedStudent) return res.status(404).json({ message: 'Student not found in your assigned classes' });
        }
        const student = await prisma.student.update({
            where: { id: Number(req.params.id) },
            data: {
                ...payload,
                dob: payload.dob ? new Date(payload.dob) : undefined,
                classId: payload.classId ? Number(payload.classId) : undefined,
                enrollmentDate: payload.enrollmentDate ? new Date(payload.enrollmentDate) : undefined,
            },
        });
        res.json(student);
    } catch (error) {
        next(error);
    }
};

const deleteStudent = async (req, res, next) => {
    try {
        await prisma.student.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStudents,
    getStudentById,
    getStudentByUserId,
    createStudent,
    updateStudent,
    deleteStudent,
};
