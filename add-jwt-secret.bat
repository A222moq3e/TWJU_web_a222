@echo off
echo JWT_SECRET="supersecret_admin_signing_key" >> server\.env
echo Added JWT_SECRET to server\.env
type server\.env
pause
