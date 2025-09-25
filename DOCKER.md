docker build -t student-dashboard-ctf:latest .

docker run -d   --name student-app   --env-file ./.env   -p 10009:3000   -v student-uploads:/app/uploads   student-dashboard-ctf:latest