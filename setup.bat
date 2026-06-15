@echo off
echo ========================================
echo   Gopal Kute Portfolio - MERN Stack
echo ========================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd backend && npm install && cd ..
echo.

echo Installing frontend dependencies...
cd frontend && npm install && cd ..
echo.

echo ========================================
echo Installation complete!
echo.
echo Run these in TWO separate terminals:
echo.
echo   Terminal 1: cd backend ^&^& npm start
echo   Terminal 2: cd frontend ^&^& npm start
echo.
echo Portfolio:  http://localhost:3000
echo Admin:      http://localhost:3000/admin/login
echo Login:      gopal / admin123
echo ========================================
pause
