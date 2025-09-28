# Student Dashboard CTF

A student dashboard application built with React and Express.js that demonstrates JWT security vulnerabilities. This CTF challenge teaches about JWT token manipulation and database privilege escalation.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (HS256)
- **Deployment**: Docker + Docker Compose

## Prerequisites

- Docker and Docker Compose
- OR Node.js (v18 or higher) + npm for local development

## Quick Start with Docker

### 1. Build and Run

```bash
# Build the Docker image
docker-compose build

# Start the application
docker-compose up -d
```

### 2. Access the Application

- **Web Interface**: http://localhost:10009
- **API**: http://localhost:10009/api

The database is automatically initialized with sample data when the container starts.

## Local Development Setup

### 1. Install Dependencies

```bash
npm run setup
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
JWT_SECRET="supers3cr3t_adm1n_s1gn1ng_k3y_a222"
DATABASE_URL="file:./dev.db"
API_URL="http://localhost:10003"
VITE_API_URL="http://localhost:10003"
```

### 3. Database Setup

The application uses SQLite with automatic database initialization:

```bash
npm run db:push
npm run db:seed
```

### 4. Start Development Servers

```bash
npm run dev
```

This starts the backend server (port 10003) and frontend development server (port 10002).

## Test Accounts

After seeding the database, you can use these test accounts:

- **Admin**: admin@utwj.local / admin123_jR1a1nXd%0a222
- **Student**: john.doe@stuutwj.local / student123

## CTF Challenge

This application contains a JWT security vulnerability. The challenge involves:

1. **Finding the JWT Secret**: Discover the JWT signing secret from environment variables
2. **Token Manipulation**: Create a JWT token with admin privileges
3. **Privilege Escalation**: Access the admin panel to retrieve the dynamic flag

### Dynamic Flag

The flag is generated dynamically on each application startup:
- **Format**: `FLAG{32-character-hex-string}`
- **Example**: `FLAG{}`
- **Generation**: Random 16 bytes converted to 32-character hexadecimal string

### JWT Structure

The JWT tokens contain only:
```json
{
  "id": "1",
  "iat": 1758901530,
  "exp": 1758987930
}
```

**Note**: Role information is stored in the database, not in the JWT token.

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user info (includes admin panel if admin)
- `GET /students/` - Get list of students
- `GET /admin/` - Admin panel (requires admin role)

## Docker Commands

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop application
docker-compose down

# Rebuild without cache
docker-compose build --no-cache
```

## Development

- Backend only: `npm run server`
- Frontend only: `npm run web`
- Database operations: `npm run db:push`, `npm run db:seed`

## Project Structure

```
├── server/                 # Backend Express.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
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
├── ops/                  # Operations and configuration files
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile           # Multi-stage Docker build
└── build-docker.sh     # Docker build script
```

## Environment Files

The project uses multiple environment files for different purposes:

### 1. `.env` (Root Directory)
**Purpose**: Docker container environment configuration
```env
JWT_SECRET="supers3cr3t_adm1n_s1gn1ng_k3y_a222"
DATABASE_URL="file:./dev.db"
API_URL="http://localhost:10003"
VITE_API_URL="http://localhost:10003"
```

### 2. `server/.env` (Server Directory)
**Purpose**: Backend server environment configuration (for local development)
```env
JWT_SECRET="supers3cr3t_adm1n_s1gn1ng_k3y_a222"
DATABASE_URL="file:./dev.db"
PORT="10003"
```

### 3. `web/env.production`
**Purpose**: Frontend build-time environment variables
```env
VITE_API_URL="http://localhost:10003"
```

## Security Notes

- JWT tokens only contain user ID, no role information
- All authorization checks use database role verification
- Admin panel access requires database admin role
- Challenge involves finding JWT secret and understanding token structure
- **CTF Hint**: The JWT secret can be found in environment files
