@echo off
echo ================================================
echo     WhatsApp Agent - Starting...
echo ================================================
echo.
echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.
echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Dependencies not found. Installing...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
)

echo Starting WhatsApp Agent...
echo.
echo ================================================
echo     SCAN THE QR CODE WITH WHATSAPP
echo ================================================
echo.
node src/index.js

