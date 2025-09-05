@echo off
echo Setting up C:\etc\.env file...

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Please run as Administrator
    pause
    exit /b 1
)

REM Create C:\etc directory if it doesn't exist
if not exist "C:\etc" mkdir "C:\etc"

REM Copy the sample file
if exist "ops\sample-etc-dot-env" (
    copy "ops\sample-etc-dot-env" "C:\etc\.env" >nul
    echo Successfully created C:\etc\.env
    echo Contents:
    type "C:\etc\.env"
) else (
    echo Error: ops\sample-etc-dot-env not found
    pause
    exit /b 1
)

pause
