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

Update the database URL in `server/.env` (create this file if it doesn't exist):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/student_dashboard_ctf"
```

### 3. Environment Configuration

**Important**: The JWT secret must be stored in `/etc/.env` for the application to work properly.

On Unix/Linux systems, run:

```bash
sudo chmod +x setup-env.sh
sudo ./setup-env.sh
```

On Windows, manually create `/etc/.env` with the following content:

```
JWT_SECRET=supersecret_admin_signing_key
ADMIN_ID=1
ADMIN_EMAIL=admin@site.local
```

### 4. Database Migration and Seeding

```bash
npm run db:push
npm run db:seed
```

### 5. Create Uploads Directory

```bash
sudo mkdir -p /var/app/uploads
sudo chmod 755 /var/app/uploads
```

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
