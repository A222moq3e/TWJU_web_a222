# Student Dashboard CTF

A web application built with React and Express.js for educational purposes.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (HS256)

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm run setup
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE student_dashboard_ctf;
```

Create a `server/.env` file with your database URL and JWT secret:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/student_dashboard_ctf"
JWT_SECRET="supersecret_admin_signing_key"
```

### 3. Environment Configuration

The application reads the JWT secret from the `JWT_SECRET` environment variable in `server/.env`. 

**For CTF Challenge**: The LFI vulnerability targets the `.env` file itself, which contains the JWT secret and database configuration.

### 4. Database Migration and Seeding

```bash
npm run db:push
npm run db:seed
```

### 5. Create Uploads Directory

The uploads directory will be created automatically when you run the seed script. It will contain:
- Sample avatar files for users
- The LFI vulnerability targets the `.env` file in the server directory

### 6. Start the Application

```bash
npm run dev
```

This will start both the backend server (port 10003) and frontend development server (port 10002).

## Access the Application

- Frontend: http://localhost:10002
- Backend API: http://localhost:10003

## Test Accounts

After seeding the database, you can use these test accounts:

- **Admin**: admin@site.local / admin123
- **Student**: john.doe@student.local / student123

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `GET /students/` - Get list of students
- `GET /students/dashboard` - Get dashboard data
- `GET /media/file` - File access endpoint
- `GET /admin/` - Admin panel (requires admin role)

## Development

- Backend only: `npm run server`
- Frontend only: `npm run web`
- Database operations: `npm run db:push`, `npm run db:migrate`, `npm run db:seed`

## Project Structure

```
├── server/                 # Backend Express.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Database models (Prisma)
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── lib/          # Utilities and database client
│   └── prisma/           # Database schema and migrations
├── web/                   # Frontend React application
│   └── src/
│       ├── components/    # Reusable React components
│       ├── pages/         # Page components
│       ├── api/          # API client functions
│       └── contexts/     # React contexts
└── ops/                  # Operations and configuration files
```
