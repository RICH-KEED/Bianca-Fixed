# 📁 WhatsApp Agent - Project Structure

Complete overview of the project organization and files.

```
Whatsapp-Agent/
│
├── 📂 src/                          # Source code directory
│   ├── WhatsAppAgent.js            # Core WhatsApp agent class
│   ├── api.js                      # REST API server with all endpoints
│   ├── index.js                    # Main entry point
│   └── examples.js                 # Programmatic usage examples
│
├── 📂 node_modules/                # Dependencies (auto-generated)
│
├── 📂 uploads/                     # Temporary upload directory (auto-created)
│
├── 📂 .wwebjs_auth/               # WhatsApp session data (auto-created)
│   └── session-whatsapp-agent/    # Encrypted session files
│
├── 📄 package.json                 # Project dependencies and scripts
├── 📄 package-lock.json           # Locked dependency versions
│
├── 📄 .gitignore                  # Git ignore rules
├── 📄 .env                        # Environment configuration
│
├── 📄 README.md                   # Main documentation
├── 📄 QUICKSTART.md              # Quick start guide
├── 📄 API_EXAMPLES.md            # Complete API examples
├── 📄 FEATURES.md                # Complete features list
├── 📄 USE_CASES.md               # Real-world use case examples
├── 📄 PROJECT_STRUCTURE.md       # This file
│
├── 📄 test-api.js                # API test suite
├── 📄 start.bat                  # Windows startup script
└── 📄 start.sh                   # Linux/Mac startup script
```

---

## 📝 File Descriptions

### Core Files

#### `src/WhatsAppAgent.js`
The heart of the application. Contains the `WhatsAppAgent` class with all functionality:

- **Authentication**: QR code login, session management
- **Messaging**: Send/receive text messages
- **Media**: Send images, documents, media from URLs
- **Broadcast**: Send to multiple contacts
- **Groups**: Create groups, send group messages
- **Location**: Send GPS coordinates
- **Contacts**: Send contact cards
- **Status**: Post WhatsApp status updates
- **Information**: Get chats, contacts, profile pictures
- **Utilities**: Phone number formatting, validation

**Key Methods:**
```javascript
- start()                    // Start the agent
- sendMessage()             // Send text message
- sendImage()               // Send image
- sendDocument()            // Send document
- broadcast()               // Broadcast to multiple contacts
- onMessage()               // Handle incoming messages
- getChats()                // Get all chats
- getContacts()             // Get all contacts
```

#### `src/api.js`
Express.js REST API server. Provides HTTP endpoints for all WhatsApp operations.

**Key Features:**
- RESTful API design
- Multipart form support for file uploads
- CORS enabled
- Error handling
- JSON responses
- File cleanup

**Endpoints:** 18 total endpoints covering all features

#### `src/index.js`
Main entry point. Initializes the WhatsApp agent and API server.

**Responsibilities:**
- Create WhatsApp agent instance
- Setup message handlers
- Start API server
- Handle graceful shutdown

#### `src/examples.js`
Comprehensive examples of programmatic usage.

**Includes:**
- All feature demonstrations
- Best practices
- Auto-reply examples
- Command system examples

---

### Configuration Files

#### `package.json`
Project metadata and dependencies.

**Scripts:**
```json
{
  "start": "node src/index.js",      // Start the agent
  "dev": "node --watch src/index.js", // Development mode with auto-reload
  "test": "node test-api.js",         // Run API tests
  "examples": "node src/examples.js"  // Run examples
}
```

**Dependencies:**
- `whatsapp-web.js` - WhatsApp Web API client
- `qrcode-terminal` - QR code display in terminal
- `express` - Web framework for API
- `multer` - File upload handling
- `mime-types` - MIME type detection
- `dotenv` - Environment variable management

#### `.env`
Environment configuration.

```env
PORT=3000                    # API server port
SESSION_NAME=whatsapp-session  # Session identifier
```

#### `.gitignore`
Prevents committing sensitive/generated files:
- `node_modules/`
- `.env`
- `.wwebjs_auth/`
- `uploads/`
- Log files

---

### Documentation Files

#### `README.md` (Main Documentation)
Complete project documentation including:
- Features overview
- Installation instructions
- Quick start guide
- API documentation
- Usage examples
- Troubleshooting

**Sections:**
1. Features
2. Prerequisites
3. Installation
4. Quick Start
5. API Usage
6. Programmatic Usage
7. Phone Number Format
8. Project Structure
9. Advanced Configuration
10. Important Notes
11. Security
12. Troubleshooting
13. API Reference

#### `QUICKSTART.md`
Get started in 5 minutes:
1. Install dependencies
2. Start the agent
3. Scan QR code
4. Send first message

Perfect for beginners!

#### `API_EXAMPLES.md`
Every API endpoint with:
- Request format
- Response format
- cURL examples
- Python examples
- JavaScript examples
- Use case scenarios

18 endpoints, fully documented!

#### `FEATURES.md`
Complete feature breakdown:
- Authentication
- Messaging
- Media handling
- Broadcasting
- Groups
- Location
- Contacts
- Status
- Information retrieval
- Automation
- Security
- Performance
- Developer features
- Supported media types
- Phone number formats

#### `USE_CASES.md`
Real-world business scenarios with complete code:
1. E-Commerce (orders, shipping, abandoned cart)
2. Education (class reminders, assignments)
3. Healthcare (appointments, test results)
4. Real Estate (property alerts)
5. Food Delivery (order tracking, specials)
6. Fitness (class schedules, renewals)
7. Corporate/HR (interviews, announcements)
8. Automotive (service reminders)
9. Coaching (progress reports)
10. Hospitality (bookings)
11. Events (tickets)
12. Customer Support Bot (complete implementation)

---

### Testing Files

#### `test-api.js`
Automated test suite for all API endpoints.

**Tests:**
1. Health check
2. Status check
3. Number verification
4. Send text message
5. Send image from URL
6. Send location
7. Get chats
8. Get contacts
9. Get profile picture
10. Broadcast message

**Features:**
- Colored console output
- Progress tracking
- Error reporting
- Pass/fail statistics

**Usage:**
```bash
npm test
```

---

### Startup Scripts

#### `start.bat` (Windows)
Automated startup for Windows:
- Checks Node.js installation
- Installs dependencies if needed
- Starts the agent
- Clear instructions

**Usage:**
```bash
start.bat
```

#### `start.sh` (Linux/Mac)
Automated startup for Unix systems:
- Same functionality as Windows version
- Bash shell script
- Color-coded output

**Usage:**
```bash
chmod +x start.sh
./start.sh
```

---

## 🔄 Data Flow

### Sending a Message

```
User Request
    ↓
REST API (api.js)
    ↓
WhatsAppAgent (WhatsAppAgent.js)
    ↓
whatsapp-web.js
    ↓
WhatsApp Server
    ↓
Recipient's Phone
```

### Receiving a Message

```
Sender's Phone
    ↓
WhatsApp Server
    ↓
whatsapp-web.js
    ↓
WhatsAppAgent Event Handler
    ↓
Custom Message Handler
    ↓
Your Business Logic
```

---

## 📊 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **whatsapp-web.js** - WhatsApp client

### Libraries
- **qrcode-terminal** - QR code display
- **multer** - File upload handling
- **mime-types** - MIME type detection
- **dotenv** - Environment configuration

### Browser Automation
- **Puppeteer** (via whatsapp-web.js) - Browser automation
- **Chromium** - Headless browser

---

## 🗂️ Auto-Generated Directories

### `.wwebjs_auth/`
Created automatically on first run.

**Contains:**
- Session data
- Authentication tokens
- Encrypted credentials
- Browser profile

**Important:**
- Don't delete unless you want to re-authenticate
- Don't commit to git (sensitive data)
- Backup for production use

### `uploads/`
Created when files are uploaded via API.

**Contains:**
- Temporarily uploaded images
- Temporarily uploaded documents
- Auto-cleaned after sending

### `node_modules/`
Created by `npm install`.

**Contains:**
- All project dependencies
- ~200MB in size
- Don't commit to git

---

## 🚀 Deployment Structure

### Development
```
Your Computer
├── Edit code
├── Test locally
└── View terminal QR code
```

### Production (Recommended)
```
Server (VPS/Cloud)
├── Node.js runtime
├── PM2 process manager
├── Nginx reverse proxy (optional)
└── SSL certificate (optional)
```

**Production Setup:**
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/index.js --name whatsapp-agent

# Auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 logs whatsapp-agent
pm2 monit
```

---

## 📦 Dependencies Overview

### Main Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| whatsapp-web.js | ^1.23.0 | WhatsApp Web API client |
| express | ^4.18.2 | Web framework for REST API |
| qrcode-terminal | ^0.12.0 | Display QR codes in terminal |
| multer | ^1.4.5 | Handle file uploads |
| mime-types | ^2.1.35 | Detect MIME types |
| dotenv | ^16.3.1 | Load environment variables |

### Indirect Dependencies
(Installed automatically)
- Puppeteer
- Chromium
- Express middleware
- And many more...

---

## 🔧 Configuration Options

### Environment Variables (`.env`)
```env
# Server Configuration
PORT=3000                          # API server port

# Session Configuration
SESSION_NAME=whatsapp-agent        # Session identifier

# Optional (for future use)
# API_KEY=your-secret-key          # API authentication
# WEBHOOK_URL=https://...          # Webhook notifications
# LOG_LEVEL=debug                  # Logging level
```

### Code Configuration

**Phone Number Default Country Code:**
```javascript
// In src/WhatsAppAgent.js
formatPhoneNumber(phoneNumber) {
  // Change '91' to your country code
  if (!cleaned.startsWith('91') && cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
}
```

**Broadcast Delay:**
```javascript
// Default: 1000ms (1 second)
await agent.broadcast(numbers, message, 2000); // 2 seconds
```

**API Port:**
```javascript
// In .env or pass to api.start()
const PORT = process.env.PORT || 3000;
```

---

## 📈 Scalability

### Single Instance
- Handles 1 WhatsApp account
- Unlimited messages (with delays)
- Suitable for small to medium businesses

### Multiple Instances
For large scale operations:
```
Instance 1 (Account 1) → Port 3000
Instance 2 (Account 2) → Port 3001
Instance 3 (Account 3) → Port 3002
...
```

Each instance needs:
- Different port
- Different session directory
- Different WhatsApp account

---

## 🛠️ Customization Points

### 1. Message Handlers
Edit `src/index.js` to customize message handling:
```javascript
agent.onMessage(async (message, contact) => {
  // Your custom logic here
});
```

### 2. API Endpoints
Add new endpoints in `src/api.js`:
```javascript
this.app.post('/custom/endpoint', async (req, res) => {
  // Your custom endpoint
});
```

### 3. Phone Number Format
Modify `formatPhoneNumber()` in `src/WhatsAppAgent.js`

### 4. Error Handling
Customize error responses throughout the code

---

## 📚 Learning Path

1. **Beginner**: Start with `QUICKSTART.md`
2. **Basic Usage**: Read `README.md`
3. **API Integration**: Study `API_EXAMPLES.md`
4. **Real Applications**: Check `USE_CASES.md`
5. **All Features**: Review `FEATURES.md`
6. **Advanced**: Dive into source code

---

## 🔍 Where to Find Things

**Need to...** | **Look in...**
---|---
Send a message? | `src/WhatsAppAgent.js` → `sendMessage()`
Add API endpoint? | `src/api.js` → `setupRoutes()`
Change auto-replies? | `src/index.js` → `agent.onMessage()`
See examples? | `src/examples.js` or `USE_CASES.md`
Test the API? | `test-api.js` or `API_EXAMPLES.md`
Learn features? | `FEATURES.md`
Quick start? | `QUICKSTART.md`
Troubleshoot? | `README.md` → Troubleshooting section

---

Made with ❤️ for WhatsApp automation

