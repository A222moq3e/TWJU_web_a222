@echo off
echo Setting up server\.env file...

REM Create server\.env file
echo DATABASE_URL="postgresql://postgres:password@localhost:5432/student_dashboard_ctf" > server\.env
echo JWT_SECRET="supersecret_admin_signing_key" >> server\.env

echo Created server\.env file with JWT secret
echo Contents:
type server\.env
pause
