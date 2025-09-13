import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const universityDomain = 'utwj.local';


async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
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
    { title: 'Introduction to Computer Science', description: 'Basic programming concepts', sectionNumber: '001', courseCode: 'CS101', hours: 3 },
    { title: 'Web Development Fundamentals', description: 'HTML, CSS, and JavaScript basics', sectionNumber: '002', courseCode: 'WEB201', hours: 3 },
    { title: 'Database Design', description: 'Relational database concepts and SQL', sectionNumber: '001', courseCode: 'DB301', hours: 4 },
    { title: 'Cybersecurity Basics', description: 'Introduction to security concepts', sectionNumber: '003', courseCode: 'SEC101', hours: 2 }
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

  // Create uploads directory and sample avatar for one student
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Find a student to give an avatar
  const studentWithAvatar = allStudents[0];
  if (studentWithAvatar) {
    const studentUploadDir = path.join(uploadsDir, studentWithAvatar.id.toString());
    if (!fs.existsSync(studentUploadDir)) {
      fs.mkdirSync(studentUploadDir, { recursive: true });
    }

    // Create a simple avatar file (1x1 PNG)
    const avatarPath = path.join(studentUploadDir, 'avatar.png');
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, // bit depth, color type, etc.
      0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 // IEND chunk
    ]);
    
    fs.writeFileSync(avatarPath, pngData);

    // Update the student's profile to show they have an avatar
    await prisma.profile.update({
      where: { userId: studentWithAvatar.id },
      data: { avatarSet: true }
    });
  } else {
    console.log('No students found to assign an avatar.');
  }

  console.log('Database seeded successfully!');
  console.log('Admin user: admin@' + universityDomain + ' / admin123');
  console.log('Test students: john.doe@stu' + universityDomain + ' / student123');
  console.log('Created uploads directory with sample avatar');
  console.log(`Admin user ID: ${admin.id}`);
  if (studentWithAvatar) {
    console.log(`Student with avatar ID: ${studentWithAvatar.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
