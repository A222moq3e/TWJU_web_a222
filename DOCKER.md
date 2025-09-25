docker build -t student-dashboard-ctf:latest .

docker rm -f student-app 2>/dev/null || true
docker run -d \
  --name student-app \
  --env-file ./.env \
  -p 10009:10003 \
  -v student-uploads:/app/uploads \
  student-dashboard-ctf:latest