# Student Dashboard CTF Challenge

A web application challenge built with Node.js, Express, React, and Prisma, sandboxed using redpwn/jail.

## Challenge Description

This is a student dashboard application where users can register, login, and manage their profiles. The challenge involves finding and exploiting vulnerabilities to obtain the flag.

## Setup

### Prerequisites

- Docker
- Docker Compose

### Running the Challenge

1. Build and run the container:
```bash
docker-compose up --build
```

2. The application will be available at `http://localhost:5000`

3. To run with a custom flag:
```bash
FLAG=FlagY{your_custom_flag} docker-compose up --build
```

### Using redpwn/jail

This challenge uses redpwn/jail for sandboxing. The configuration includes:

- **JAIL_PIDS**: 30 (maximum processes per connection)
- **JAIL_CPU**: 1000 (CPU milliseconds per wall second)
- **JAIL_MEM**: 50M (maximum memory per connection)
- **JAIL_TIME**: 30 (maximum wall seconds per connection)
- **JAIL_PORT**: 5000 (port to bind to)

## Solving the Challenge

### Automated Solver

Run the provided solving script:

```bash
pip install -r requirements.txt
python solve.py http://localhost:5000
```

### Manual Testing

1. Register a new user account
2. Login with your credentials
3. Explore the application for vulnerabilities
4. Look for ways to access the flag

## Files Structure

- `Dockerfile` - Multi-stage build with redpwn/jail
- `run.sh` - Entry point script for the jail
- `hook.sh` - Jail hook script for flag injection
- `solve.py` - Automated solving script
- `requirements.txt` - Python dependencies for solver
- `server/` - Backend Node.js application
- `web/` - Frontend React application

## Challenge Requirements Compliance

✅ **Dockerized**: Single container using redpwn/jail  
✅ **Sandboxed**: Uses redpwn/jail for command execution/file access  
✅ **No Internet**: Container has no external network access  
✅ **No Persistence**: Stateless application  
✅ **Dynamic Flag**: Flag passed as environment variable  
✅ **Port 5000**: Application runs on port 5000  
✅ **Source Code**: Full source code provided  
✅ **Solving Script**: Automated solver included  
✅ **Size Limit**: Under 200MB  
✅ **No External Dependencies**: Self-contained  

## Flag Format

The flag follows the pattern: `FlagY{<md5>}` for static flags or dynamic flags passed at runtime.

## Author

CTF Challenge Author