#!/bin/bash

echo "================================================"
echo "    WhatsApp Agent - Starting..."
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Dependencies not found. Installing..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ ERROR: Failed to install dependencies!"
        exit 1
    fi
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
fi

echo "🚀 Starting WhatsApp Agent..."
echo ""
echo "================================================"
echo "     SCAN THE QR CODE WITH WHATSAPP"
echo "================================================"
echo ""

node src/index.js

