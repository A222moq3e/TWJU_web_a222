# Student Dashboard CTF - FlagYard Challenge

## Challenge Description

This is a web application challenge that simulates a student dashboard system. The application has user authentication, role-based access control, and various endpoints for managing student information.

## Challenge Requirements Met

✅ **Dockerized as single container** - Uses multi-stage Docker build with redpwn/jail sandboxing  
✅ **Sandboxed with redpwn/jail** - Prevents command execution and arbitrary file access  
✅ **No internet connection** - Container runs in isolated environment  
✅ **No persistence required** - Uses SQLite database, no external dependencies  
✅ **No intensive brute forcing** - Can be solved with known credentials or simple techniques  
✅ **Dynamic flag support** - Flag passed via environment variable `FLAG`  
✅ **Port 5000/TCP** - Application serves on port 5000 as required  
✅ **Source code provided** - Full source code available for reverse engineering  
✅ **Automated solving script** - `solve.py` included with dependencies  
✅ **Memory limited** - Container limited to 1GB RAM  
✅ **Small Docker image** - Multi-stage build for minimal image size  

## Challenge Setup

### Prerequisites

- Docker and Docker Compose
- Python 3.6+ (for solving script)

### Building and Running

1. **Build the Docker image:**
   ```bash
   ./build-docker.sh
   ```

2. **Run the challenge:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - URL: http://localhost:5000
   - The application will be available on port 5000

### Testing with Solving Script

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the automated solver:**
   ```bash
   python3 solve.py http://localhost:5000
   ```

## Challenge Details

### Application Architecture

- **Backend:** Node.js with Express.js
- **Database:** SQLite with Prisma ORM
- **Frontend:** React with Vite
- **Authentication:** JWT-based authentication
- **File Uploads:** Multer for avatar uploads

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info (may expose admin panel)
- `GET /api/auth/me/dashboard` - Get user dashboard (may expose admin panel)
- `GET /api/admin/` - Admin panel (requires admin role)
- `GET /api/students` - List all students

### User Roles

- **Admin:** Full access to admin panel and flag
- **Student:** Limited access to student features

### Known Credentials

The application seeds with known users:
- **Admin:** `admin@utwj.local` / `admin123_jR1a1nXd%0a222`
- **Students:** Various test accounts with password `student123`

## Flag Location

The flag is accessible through:
1. Admin panel endpoint (`/api/admin/`) - requires admin role
2. User profile endpoints (`/api/auth/me`, `/api/auth/me/dashboard`) - may expose admin panel info for admin users

## Solving Strategies

1. **Known Credentials:** Use the seeded admin credentials
2. **Endpoint Enumeration:** Try various endpoints that might expose admin information
3. **JWT Analysis:** Examine JWT tokens for potential manipulation
4. **Role Escalation:** Attempt to escalate privileges

## Docker Configuration

- **Base Image:** `pwn.red/jail` for sandboxing
- **Port:** 5000/TCP
- **Memory Limit:** 1GB
- **Environment Variables:**
  - `FLAG` - Dynamic flag from environment
  - `NODE_ENV=production`
  - `DATABASE_URL=file:./dev.db`
  - `JWT_SECRET=supers3cr3t_adm1n_s1gn1ng_k3y_a222`

## Files Structure

```
├── Dockerfile              # Multi-stage build with redpwn/jail
├── docker-compose.yml      # Container orchestration
├── run.sh                  # Startup script with socat
├── solve.py               # Automated solving script
├── requirements.txt       # Python dependencies
├── server/               # Backend source code
├── web/                  # Frontend source code
└── FLAGYARD_README.md    # This file
```

## Security Considerations

- Application runs in sandboxed environment
- No external network access
- File uploads are restricted
- JWT tokens are properly signed
- Database queries use parameterized statements
- Input validation on all endpoints

## Troubleshooting

1. **Container won't start:** Check Docker logs with `docker-compose logs app`
2. **Port conflicts:** Ensure port 5000 is available
3. **Solving script fails:** Verify the application is running and accessible
4. **Database issues:** The SQLite database is created automatically on first run

## Challenge Author

This challenge is designed for FlagYard CTF platform and follows all required specifications for web application challenges.
