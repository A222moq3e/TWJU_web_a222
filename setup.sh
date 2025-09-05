#!/bin/bash

echo "Setting up Student Dashboard CTF..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "Warning: PostgreSQL client not found. Make sure PostgreSQL is installed and running."
fi

echo "Installing dependencies..."
npm run setup

echo ""
echo "Next steps:"
echo "1. Create a PostgreSQL database:"
echo "   CREATE DATABASE student_dashboard_ctf;"
echo ""
echo "2. Create server/.env file with your database URL:"
echo "   DATABASE_URL=\"postgresql://username:password@localhost:5432/student_dashboard_ctf\""
echo ""
echo "3. Set up /etc/.env file (run as root):"
echo "   sudo ./setup-env.sh"
echo ""
echo "4. Create uploads directory:"
echo "   sudo mkdir -p /var/app/uploads"
echo "   sudo chmod 755 /var/app/uploads"
echo ""
echo "5. Run database setup:"
echo "   npm run db:push"
echo "   npm run db:seed"
echo ""
echo "6. Start the application:"
echo "   npm run dev"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:3001"
echo ""
echo "Test accounts:"
echo "  Admin: admin@site.local / admin123"
echo "  Student: john.doe@student.local / student123"
