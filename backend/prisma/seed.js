const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('School@123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@school.com' },
        update: {},
        create: {
            name: 'System Admin',
            email: 'admin@school.com',
            passwordHash,
            role: 'ADMIN',
        },
    });

    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@school.com' },
        update: {},
        create: {
            name: 'Ms. Carter',
            email: 'teacher@school.com',
            passwordHash,
            role: 'TEACHER',
        },
    });

    const student = await prisma.user.upsert({
        where: { email: 'student@school.com' },
        update: {},
        create: {
            name: 'Ava Johnson',
            email: 'student@school.com',
            passwordHash,
            role: 'STUDENT',
        },
    });

    const accountant = await prisma.user.upsert({
        where: { email: 'accountant@school.com' },
        update: {},
        create: {
            name: 'Mr. Smith',
            email: 'accountant@school.com',
            passwordHash,
            role: 'ACCOUNTANT',
        },
    });

    const academicYear = await prisma.academicYear.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: '2025-2026',
            startDate: new Date('2025-09-01'),
            endDate: new Date('2026-06-30'),
            status: 'ACTIVE',
        },
    });

    const teacherProfile = await prisma.teacher.upsert({
        where: { teacherId: 'T-1001' },
        update: {},
        create: {
            teacherId: 'T-1001',
            firstName: 'Emma',
            lastName: 'Carter',
            gender: 'FEMALE',
            dob: new Date('1987-06-12'),
            email: 'teacher@school.com',
            phone: '+1234567890',
            address: '25 Green Way',
            subject: 'Mathematics',
            hireDate: new Date('2021-08-15'),
            status: 'ACTIVE',
            userId: teacher.id,
        },
    });

    const class1 = await prisma.class.upsert({
        where: { classId: 'CLS-101' },
        update: {},
        create: {
            classId: 'CLS-101',
            name: 'Grade 10-A',
            grade: '10',
            room: 'Room 101',
            teacherId: teacherProfile.id,
            academicYearId: academicYear.id,
            status: 'ACTIVE',
        },
    });

    const studentProfile = await prisma.student.upsert({
        where: { email: 'student@school.com' },
        update: {},
        create: {
            studentId: 'ST-1001',
            firstName: 'Ava',
            lastName: 'Johnson',
            gender: 'FEMALE',
            dob: new Date('2009-04-05'),
            email: 'student@school.com',
            phone: '+1111111111',
            address: '4 Oak Lane',
            parentName: 'John Johnson',
            parentPhone: '+1222222222',
            classId: class1.id,
            enrollmentDate: new Date('2025-09-01'),
            status: 'ACTIVE',
            userId: student.id,
        },
    });

    await prisma.fee.upsert({
        where: { feeId: 'FEE-ST-1001-TUITION' },
        update: {},
        create: {
            feeId: 'FEE-ST-1001-TUITION',
            studentId: studentProfile.id,
            feeType: 'TUITION',
            amount: 2200,
            dueDate: new Date('2026-10-15'),
            academicYearId: academicYear.id,
            status: 'PENDING',
        },
    });

    await prisma.subject.upsert({
        where: { subjectId: 'SUB-101' },
        update: {},
        create: {
            subjectId: 'SUB-101',
            name: 'Mathematics',
            code: 'MATH101',
            teacherId: teacherProfile.id,
            classId: class1.id,
            credits: 4,
            status: 'ACTIVE',
        },
    });

    await prisma.exam.upsert({
        where: { examId: 'EXM-201' },
        update: {},
        create: {
            examId: 'EXM-201',
            name: 'Midterm Exam',
            type: 'MIDTERM',
            classId: class1.id,
            startDate: new Date('2025-11-10'),
            endDate: new Date('2025-11-15'),
            status: 'OPEN',
        },
    });

    await prisma.notice.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: 'Welcome Back',
            description: 'Welcome to the new academic year. Please check your schedule.',
            author: 'Admin',
            targetAudience: 'EVERYONE',
            publishDate: new Date('2025-09-01'),
            expiryDate: new Date('2025-12-31'),
            status: 'PUBLISHED',
        },
    });

    console.log('Seed data created successfully. Demo accounts: admin@school.com, teacher@school.com, student@school.com, accountant@school.com | password: School@123');
}

main()
    .catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
