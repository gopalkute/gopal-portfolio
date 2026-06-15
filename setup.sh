#!/bin/bash

echo "========================================"
echo "  Gopal Kute Portfolio - MERN Stack"
echo "========================================"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
  exit 1
fi

echo "✅ Node.js $(node -v) found"
echo ""

# Install backend deps
echo "📦 Installing backend dependencies..."
cd backend && npm install
echo ""

# Install frontend deps
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install
echo ""

echo "========================================"
echo "✅ Installation complete!"
echo ""
echo "To start the project:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && npm start"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm start"
echo ""
echo "  Portfolio:  http://localhost:3000"
echo "  Admin:      http://localhost:3000/admin/login"
echo "  Login:      gopal / admin123"
echo "========================================"
