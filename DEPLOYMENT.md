# Deployment Guide

## Server Configuration Changes

The application has been configured to work on both localhost and server environments.

### Key Changes Made:

1. **Frontend (Vite)**: Now listens on `0.0.0.0:3000` instead of `localhost:3000`
2. **Backend (Express)**: Now listens on `0.0.0.0:3001` instead of `localhost:3001`
3. **Environment Variables**: Added support for `VITE_API_URL` and `HOST` environment variables

## Local Development

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Server Deployment

### 1. Environment Variables

Create a `.env` file in the server directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/student_dashboard_ctf"
HOST=0.0.0.0
PORT=3001
```

### 2. Frontend Environment

For production builds, set the API URL:

```bash
# Option 1: Environment variable
export VITE_API_URL=http://your-server-ip:3001

# Option 2: Create web/.env.production
echo "VITE_API_URL=http://your-server-ip:3001" > web/.env.production
```

### 3. Build and Deploy

```bash
# Build frontend
npm run build

# Start backend
npm start
```

### 4. Firewall Configuration

Make sure ports 3000 and 3001 are open:

```bash
# Ubuntu/Debian
sudo ufw allow 3000
sudo ufw allow 3001

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

### 5. Process Management (PM2)

Install PM2 for process management:

```bash
npm install -g pm2

# Start both services
pm2 start "npm run start" --name "ctf-backend"
pm2 start "npm run web" --name "ctf-frontend"

# Save PM2 configuration
pm2 save
pm2 startup
```

### 6. Nginx Reverse Proxy (Optional)

Create `/etc/nginx/sites-available/ctf-app`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/ctf-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Troubleshooting

### Check if services are listening on all interfaces:

```bash
netstat -tlnp | grep :3000
netstat -tlnp | grep :3001
```

Should show `0.0.0.0:3000` and `0.0.0.0:3001` instead of `127.0.0.1:3000`.

### Check firewall status:

```bash
# Ubuntu/Debian
sudo ufw status

# CentOS/RHEL
sudo firewall-cmd --list-ports
```

### Test connectivity:

```bash
# From another machine
curl http://your-server-ip:3000
curl http://your-server-ip:3001/health
```
