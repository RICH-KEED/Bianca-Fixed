# 🔧 WhatsApp Agent - Complete Installation Guide

Step-by-step installation instructions for all platforms.

---

## 📋 Prerequisites

Before installing, make sure you have:

### 1. Node.js (Required)
- **Version**: 18.x or higher
- **Download**: https://nodejs.org/

**Check if installed:**
```bash
node --version
# Should show v18.x.x or higher
```

**Check npm:**
```bash
npm --version
# Should show 8.x.x or higher
```

### 2. WhatsApp Account (Required)
- Active phone number
- WhatsApp installed on your phone
- Not currently using WhatsApp Web (will be disconnected)

### 3. System Requirements
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: 500MB free space
- **Internet**: Stable connection
- **OS**: Windows 10+, macOS 10.13+, or Linux

---

## 🪟 Windows Installation

### Method 1: Quick Install (Recommended)

1. **Download or Clone the Project**
   ```bash
   # If you have Git
   git clone <repository-url>
   cd Whatsapp-Agent
   
   # Or download and extract ZIP
   ```

2. **Double-click `start.bat`**
   - This will automatically:
     - Check Node.js installation
     - Install dependencies
     - Start the application

3. **Scan QR Code**
   - QR code will appear in the terminal
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices
   - Scan the QR code

### Method 2: Manual Install

1. **Open Command Prompt or PowerShell**
   ```bash
   # Navigate to project directory
   cd path\to\Whatsapp-Agent
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   This will take 2-3 minutes. You'll see:
   ```
   added 200+ packages in 2m
   ```

3. **Start the Application**
   ```bash
   npm start
   ```

4. **Scan QR Code**
   - Follow the on-screen instructions

### Windows Troubleshooting

**"node is not recognized"**
```bash
# Node.js not installed or not in PATH
# Download from: https://nodejs.org/
# Make sure to check "Add to PATH" during installation
```

**"Cannot find module"**
```bash
# Dependencies not installed
npm install
```

**PowerShell Execution Policy Error**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🍎 macOS Installation

### Method 1: Quick Install (Recommended)

1. **Open Terminal**
   - Press `Cmd + Space`
   - Type "Terminal"
   - Press Enter

2. **Navigate to Project**
   ```bash
   cd ~/Downloads/Whatsapp-Agent
   # Or wherever you downloaded it
   ```

3. **Make Script Executable**
   ```bash
   chmod +x start.sh
   ```

4. **Run Script**
   ```bash
   ./start.sh
   ```

### Method 2: Manual Install

1. **Install Node.js (if not installed)**
   ```bash
   # Using Homebrew (recommended)
   brew install node
   
   # Or download from: https://nodejs.org/
   ```

2. **Navigate to Project**
   ```bash
   cd ~/Downloads/Whatsapp-Agent
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Application**
   ```bash
   npm start
   ```

### macOS Troubleshooting

**"command not found: node"**
```bash
# Install Node.js with Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

**"permission denied"**
```bash
# Fix permissions
sudo chown -R $USER:$USER .
chmod +x start.sh
```

---

## 🐧 Linux Installation

### Ubuntu/Debian

1. **Install Node.js**
   ```bash
   # Update package list
   sudo apt update
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Verify installation
   node --version
   npm --version
   ```

2. **Navigate to Project**
   ```bash
   cd ~/Downloads/Whatsapp-Agent
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Install Chromium Dependencies** (if needed)
   ```bash
   sudo apt-get install -y \
     gconf-service \
     libasound2 \
     libatk1.0-0 \
     libcups2 \
     libdbus-1-3 \
     libgconf-2-4 \
     libgtk-3-0 \
     libnspr4 \
     libnss3 \
     libx11-xcb1 \
     libxcomposite1 \
     libxdamage1 \
     libxrandr2 \
     fonts-liberation \
     libappindicator1 \
     libnss3 \
     xdg-utils
   ```

5. **Start Application**
   ```bash
   npm start
   ```

### CentOS/RHEL/Fedora

1. **Install Node.js**
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   ```

2. **Follow Ubuntu steps 2-5 above**

### Arch Linux

1. **Install Node.js**
   ```bash
   sudo pacman -S nodejs npm
   ```

2. **Follow Ubuntu steps 2-5 above**

### Linux Troubleshooting

**Puppeteer/Chromium Issues**
```bash
# Install missing dependencies
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

---

## 🐳 Docker Installation (Optional)

Coming soon! Docker support will be added in future versions.

---

## ☁️ Cloud Server Installation (VPS/AWS/Azure/GCP)

### 1. Connect to Server
```bash
ssh user@your-server-ip
```

### 2. Install Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install -y git
```

### 3. Clone Project
```bash
cd /opt
sudo git clone <repository-url> whatsapp-agent
cd whatsapp-agent
sudo chown -R $USER:$USER .
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 6. Start with PM2
```bash
pm2 start src/index.js --name whatsapp-agent
```

### 7. Setup Auto-Restart
```bash
pm2 startup
pm2 save
```

### 8. QR Code Authentication

**Problem**: Can't see QR code on headless server!

**Solution 1**: Use Screen/Tmux
```bash
# Install screen
sudo apt-get install screen

# Start screen session
screen -S whatsapp

# Start application
npm start

# Detach: Ctrl+A then D
# Reattach: screen -r whatsapp
```

**Solution 2**: View logs in real-time
```bash
pm2 logs whatsapp-agent
# QR code will appear in logs
```

**Solution 3**: Scan on local, transfer session
1. Run locally first
2. Scan QR code
3. Copy `.wwebjs_auth/` folder to server
4. Start on server (already authenticated!)

### 9. Setup Firewall
```bash
# Allow API port (3000)
sudo ufw allow 3000/tcp
sudo ufw enable
```

### 10. Setup Nginx (Optional - for HTTPS)
```bash
# Install Nginx
sudo apt-get install nginx

# Create config
sudo nano /etc/nginx/sites-available/whatsapp-agent
```

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
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/whatsapp-agent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 11. Setup SSL (Optional - Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🔍 Verify Installation

After installation, verify everything is working:

### 1. Check Health
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "ready": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Check Status
```bash
curl http://localhost:3000/status
```

### 3. Run Test Suite
```bash
npm test
```

---

## 📦 Update Installation

To update to the latest version:

```bash
# Stop the application
# Ctrl+C or: pm2 stop whatsapp-agent

# Pull latest changes
git pull

# Update dependencies
npm install

# Restart
npm start
# or: pm2 restart whatsapp-agent
```

---

## 🗑️ Uninstallation

To completely remove the application:

### Remove Files
```bash
cd /path/to/Whatsapp-Agent
cd ..
rm -rf Whatsapp-Agent
```

### Remove PM2 Process (if used)
```bash
pm2 delete whatsapp-agent
pm2 save
```

### Remove Node.js (optional)
```bash
# Ubuntu/Debian
sudo apt-get remove nodejs npm

# macOS
brew uninstall node

# Windows
# Use "Add or Remove Programs"
```

---

## 🆘 Common Installation Issues

### Issue 1: npm install fails

**Error:**
```
npm ERR! code EACCES
npm ERR! syscall access
```

**Solution:**
```bash
# Fix npm permissions (Linux/Mac)
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER .

# Or use sudo (not recommended)
sudo npm install --unsafe-perm=true --allow-root
```

### Issue 2: Puppeteer download fails

**Error:**
```
ERROR: Failed to download Chromium
```

**Solution:**
```bash
# Set puppeteer skip download (for now)
export PUPPETEER_SKIP_DOWNLOAD=true
npm install

# Or install with specific Chromium path
npm install --unsafe-perm=true
```

### Issue 3: Port already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
# Linux/Mac:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in .env
PORT=3001
```

### Issue 4: QR Code not appearing

**Solutions:**
1. Use a terminal that supports QR codes (Windows Terminal, iTerm2)
2. Check logs: `pm2 logs whatsapp-agent`
3. The session might already exist (delete `.wwebjs_auth/` to rescan)

### Issue 5: Memory issues

**Error:**
```
FATAL ERROR: ... Allocation failed
```

**Solution:**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm start

# Or add to start script
node --max-old-space-size=4096 src/index.js
```

---

## ✅ Post-Installation Checklist

- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] Application starts without errors
- [ ] QR code appears in terminal
- [ ] QR code scanned successfully
- [ ] WhatsApp connected
- [ ] API responds to `/health` endpoint
- [ ] Test message sent successfully
- [ ] `.env` file configured
- [ ] Session persists after restart

---

## 🎓 Next Steps

After successful installation:

1. **Read Quick Start**: `QUICKSTART.md`
2. **Try Examples**: `npm run examples`
3. **Test API**: `npm test`
4. **Read Documentation**: `README.md`
5. **Explore Use Cases**: `USE_CASES.md`
6. **Build Your Integration!**

---

## 📞 Need Help?

If you're stuck:

1. Check the error message carefully
2. Read the troubleshooting section above
3. Check `README.md` for more troubleshooting
4. Search for similar issues on GitHub
5. Open a new issue with:
   - Your OS and version
   - Node.js version
   - Error message
   - Steps to reproduce

---

Made with ❤️ for WhatsApp automation

Happy Installing! 🚀

