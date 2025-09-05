@echo off
echo Setting up Student Dashboard CTF...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

echo Installing dependencies...
call npm run setup

echo.
echo Next steps:
echo 1. Create a PostgreSQL database:
echo    CREATE DATABASE student_dashboard_ctf;
echo.
echo 2. Create server\.env file with your database URL:
echo    DATABASE_URL="postgresql://username:password@localhost:5432/student_dashboard_ctf"
echo.
echo 3. Set up C:\etc\.env file (run as Administrator):
echo    Copy ops\sample-etc-dot-env to C:\etc\.env
echo.
echo 4. Create uploads directory:
echo    mkdir C:\var\app\uploads
echo.
echo 5. Run database setup:
echo    npm run db:push
echo    npm run db:seed
echo.
echo 6. Start the application:
echo    npm run dev
echo.
echo The application will be available at:
echo   Frontend: http://localhost:3000
echo   Backend: http://localhost:3001
echo.
echo Test accounts:
echo   Admin: admin@site.local / admin123
echo   Student: john.doe@student.local / student123
pause
