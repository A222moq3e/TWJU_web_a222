import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const universityDomain = 'utwj.local';


async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123_jR1a1nXd%0a222', 12);
  const admin = await prisma.user.upsert({
    where: { email: `admin@${universityDomain}` },
    update: {},
    create: {
      email: `admin@${universityDomain}`,
      passwordHash: adminPassword,
      role: 'admin',
      profile: {
        create: {
          displayName: 'Admin User'
        }
      }
    }
  });

  // Create test student users
  const studentPassword = await bcrypt.hash('student123', 12);
  const students = [
    { email: 'john.doe@stu' + universityDomain, name: 'John Doe' },
    { email: 'jane.smith@stu' + universityDomain, name: 'Jane Smith' },
    { email: 'bob.wilson@stu' + universityDomain, name: 'Bob Wilson' },
    { email: 'alice.brown@stu' + universityDomain, name: 'Alice Brown' }
  ];

  for (const student of students) {
    await prisma.user.upsert({
      where: { email: student.email },
      update: {},
      create: {
        email: student.email,
        passwordHash: studentPassword,
        role: 'student',
        profile: {
          create: {
            displayName: student.name
          }
        }
      }
    });
  }

  // Create courses
  const courses = [
    { title: 'Introduction to Computer Science', description: 'Basic programming concepts', sectionNumber: '171', courseCode: 'CS101', hours: 4 },
    { title: 'Web Development Fundamentals', description: 'HTML, CSS, and JavaScript basics', sectionNumber: '173', courseCode: 'WEB201', hours: 3 },
    { title: 'Enviroment Variables', description: 'how we can set variables in secure way', sectionNumber: '172', courseCode: 'ENV301', hours: 2 },
    { title: 'Cybersecurity Basics', description: 'Introduction to security concepts', sectionNumber: '171', courseCode: 'SEC101', hours: 2 }
  ];

  const createdCourses = [];
  for (const course of courses) {
    const created = await prisma.course.create({
      data: course
    });
    createdCourses.push(created);
  }

  // Enroll every student in all 4 courses
  const allStudents = await prisma.user.findMany({
    where: { role: 'student' }
  });

  for (const student of allStudents) {
    for (const course of createdCourses) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: student.id, courseId: course.id } },
        update: {},
        create: { userId: student.id, courseId: course.id }
      });
    }
  }

  // Create uploads directory (default-1.png should already exist from Docker copy)
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create student upload directories (avatars should already exist from Docker copy)
  for (const student of allStudents) {
    const studentUploadDir = path.join(uploadsDir, student.id.toString());
    if (!fs.existsSync(studentUploadDir)) {
      fs.mkdirSync(studentUploadDir, { recursive: true });
    }
  }

  console.log('Database seeded successfully!');
  console.log('Admin user: admin@' + universityDomain + ' / admin123');
  console.log('Test students: john.doe@stu' + universityDomain + ' / student123');
  console.log('Created uploads directory with sample avatar');
  console.log(`Admin user ID: ${admin.id}`);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
