# 🚀 WhatsApp Agent

A powerful WhatsApp automation agent built with Node.js and whatsapp-web.js. This agent allows you to send/receive messages, share images and documents, broadcast messages to multiple contacts, and much more!

## ✨ Features

### Core Features
- ✅ **QR Code Authentication** - Easy login via WhatsApp QR code
- 📨 **Send & Receive Messages** - Full two-way messaging capability
- 🖼️ **Send Images** - Share images with captions
- 📄 **Send Documents** - Share any type of document
- 📢 **Broadcast Messages** - Send messages to multiple contacts at once
- 📢 **Broadcast Media** - Send images/documents to multiple contacts
- 📍 **Send Location** - Share GPS coordinates
- 👤 **Send Contact Cards** - Share contact information
- 👥 **Group Management** - Create groups and send messages
- 📊 **Status/Story Updates** - Post WhatsApp status updates
- 🔍 **Contact Verification** - Check if number is registered on WhatsApp
- 🌐 **REST API** - Full REST API for easy integration
- 💾 **Persistent Sessions** - Stay logged in across restarts

### Advanced Features
- Message handlers for incoming messages
- Auto-reply capabilities
- Media download from received messages
- Get chats and contacts list
- Profile picture retrieval
- Group creation and messaging
- Command system support

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Active WhatsApp account

## 🔧 Installation

1. **Clone or download the repository**

```bash
cd Whatsapp-Agent
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
PORT=3000
SESSION_NAME=whatsapp-session
```

## 🚀 Quick Start

### Start the Agent

```bash
npm start
```

### First Time Setup

1. Run `npm start`
2. A QR code will appear in the terminal
3. Open WhatsApp on your phone
4. Go to **Settings > Linked Devices**
5. Tap **"Link a Device"**
6. Scan the QR code displayed in terminal
7. Wait for authentication (you'll see "✅ WhatsApp Agent is ready!")

That's it! Your agent is now running and ready to use.

## 📡 API Usage

The agent exposes a REST API on `http://localhost:3000` (or your configured port).

### Check Status

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "ready": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Send Text Message

```bash
POST /send/message
Content-Type: application/json

{
  "phoneNumber": "1234567890",
  "message": "Hello from WhatsApp Agent!"
}
```

### Send Image

```bash
POST /send/image
Content-Type: multipart/form-data

phoneNumber: 1234567890
caption: Check this out!
image: [file]
```

### Send Image from URL

```bash
POST /send/image-url
Content-Type: application/json

{
  "phoneNumber": "1234567890",
  "url": "https://example.com/image.jpg",
  "caption": "Image from URL"
}
```

### Send Document

```bash
POST /send/document
Content-Type: multipart/form-data

phoneNumber: 1234567890
caption: Important document
document: [file]
```

### Broadcast Message

```bash
POST /broadcast/message
Content-Type: application/json

{
  "phoneNumbers": ["1234567890", "0987654321"],
  "message": "Broadcast message to multiple contacts!",
  "delay": 2000
}
```

Response:
```json
{
  "total": 2,
  "successful": 2,
  "failed": 0,
  "results": [...]
}
```

### Broadcast Image

```bash
POST /broadcast/image
Content-Type: multipart/form-data

phoneNumbers: ["1234567890", "0987654321"]
caption: Check this out everyone!
delay: 2000
image: [file]
```

### Send Location

```bash
POST /send/location
Content-Type: application/json

{
  "phoneNumber": "1234567890",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "description": "New Delhi, India"
}
```

### Send Contact Card

```bash
POST /send/contact
Content-Type: application/json

{
  "phoneNumber": "1234567890",
  "contactNumber": "0987654321",
  "contactName": "John Doe"
}
```

### Create Group

```bash
POST /group/create
Content-Type: application/json

{
  "name": "My WhatsApp Group",
  "participants": ["1234567890", "0987654321"]
}
```

### Send Group Message

```bash
POST /group/send
Content-Type: application/json

{
  "groupId": "123456789@g.us",
  "message": "Hello group!"
}
```

### Post Status/Story

```bash
POST /status
Content-Type: application/json

{
  "text": "My WhatsApp status update! 🎉"
}
```

### Get All Chats

```bash
GET /chats
```

### Get All Contacts

```bash
GET /contacts
```

### Check if Number Exists

```bash
GET /check/1234567890
```

### Get Profile Picture

```bash
GET /profile/1234567890
```

## 🔥 Programmatic Usage

You can also use the WhatsApp agent directly in your Node.js code:

```javascript
import WhatsAppAgent from './src/WhatsAppAgent.js';

const agent = new WhatsAppAgent();

// Start the agent
await agent.start();
await agent.waitForReady();

// Send a message
await agent.sendMessage('1234567890', 'Hello!');

// Send an image
await agent.sendImage('1234567890', './image.jpg', 'Check this out!');

// Send a document
await agent.sendDocument('1234567890', './document.pdf', 'Important file');

// Broadcast to multiple contacts
await agent.broadcast(
  ['1234567890', '0987654321'], 
  'Broadcast message!',
  2000 // 2 second delay between messages
);

// Broadcast image
await agent.broadcastImage(
  ['1234567890', '0987654321'],
  './image.jpg',
  'Image for everyone!',
  2000
);

// Receive messages
agent.onMessage(async (message, contact) => {
  console.log(`Message from ${contact.name}: ${message.body}`);
  
  // Auto-reply
  if (message.body === 'hello') {
    await message.reply('Hi there! 👋');
  }
});
```

See `src/examples.js` for more detailed examples.

## 📱 Using with cURL

### Send a Message

```bash
curl -X POST http://localhost:3000/send/message \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"1234567890","message":"Hello from cURL!"}'
```

### Send an Image

```bash
curl -X POST http://localhost:3000/send/image \
  -F "phoneNumber=1234567890" \
  -F "caption=Amazing photo!" \
  -F "image=@/path/to/image.jpg"
```

### Broadcast Message

```bash
curl -X POST http://localhost:3000/broadcast/message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers":["1234567890","0987654321"],
    "message":"Broadcast test!",
    "delay":2000
  }'
```

## 🐍 Using with Python

```python
import requests

# Send a message
response = requests.post('http://localhost:3000/send/message', json={
    'phoneNumber': '1234567890',
    'message': 'Hello from Python!'
})
print(response.json())

# Send an image
with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {'phoneNumber': '1234567890', 'caption': 'Python image'}
    response = requests.post('http://localhost:3000/send/image', 
                           files=files, data=data)
    print(response.json())

# Broadcast
response = requests.post('http://localhost:3000/broadcast/message', json={
    'phoneNumbers': ['1234567890', '0987654321'],
    'message': 'Broadcast from Python!',
    'delay': 2000
})
print(response.json())
```

## 🔧 Phone Number Format

The agent automatically formats phone numbers, but for best results:

- **Include country code**: `911234567890` (India)
- **Without country code**: `1234567890` (will auto-add based on default)
- **With +**: `+911234567890`
- **With spaces/dashes**: `+91 123-456-7890` (will be cleaned)

**Note**: Update the `formatPhoneNumber()` method in `WhatsAppAgent.js` to change the default country code (currently set to India +91).

## 📁 Project Structure

```
Whatsapp-Agent/
├── src/
│   ├── WhatsAppAgent.js    # Core WhatsApp agent class
│   ├── api.js              # REST API server
│   ├── index.js            # Main entry point
│   └── examples.js         # Usage examples
├── uploads/                # Temporary upload directory
├── .wwebjs_auth/          # WhatsApp session data
├── package.json
├── .env                    # Environment configuration
├── .gitignore
└── README.md
```

## 🛠️ Advanced Configuration

### Custom Message Handler

```javascript
agent.onMessage(async (message, contact) => {
  // Save to database
  await saveToDatabase(message);
  
  // Trigger webhook
  await fetch('https://your-webhook.com', {
    method: 'POST',
    body: JSON.stringify({ message, contact })
  });
  
  // Download media
  if (message.hasMedia) {
    const media = await message.downloadMedia();
    // Save media file
  }
});
```

### Broadcast with Custom Delay

```javascript
// Send to 100 contacts with 3 second delay (to avoid spam detection)
await agent.broadcast(phoneNumbers, message, 3000);
```

### Send Media from URL

```javascript
await agent.sendMediaFromUrl(
  '1234567890',
  'https://example.com/image.jpg',
  'Caption here'
);
```

## ⚠️ Important Notes

1. **Rate Limiting**: WhatsApp may flag your account if you send too many messages too quickly. Use appropriate delays in broadcasts (recommended: 2-3 seconds between messages).

2. **Session Persistence**: Your session is saved in `.wwebjs_auth/`. Don't delete this folder or you'll need to scan QR code again.

3. **Phone Number Format**: The agent uses India's country code (+91) by default. Update `formatPhoneNumber()` in `WhatsAppAgent.js` for your region.

4. **File Size Limits**: WhatsApp has limits on file sizes (typically 16MB for images, 100MB for documents).

5. **Media Storage**: Uploaded files are temporarily stored in `uploads/` and deleted after sending.

## 🔒 Security Best Practices

- Don't commit `.env` file to version control
- Don't share `.wwebjs_auth/` directory (contains session data)
- Use environment variables for sensitive configuration
- Implement rate limiting on API endpoints for production
- Add authentication to API endpoints in production

## 🐛 Troubleshooting

### QR Code not appearing
- Make sure port 3000 (or your configured port) is not in use
- Check that your terminal supports QR code display
- Try running with `npm start` in a different terminal

### Authentication failed
- Delete `.wwebjs_auth/` directory and try again
- Make sure WhatsApp Web is not logged in on another browser
- Update the `whatsapp-web.js` package: `npm update whatsapp-web.js`

### Messages not sending
- Check if the phone number is registered on WhatsApp using `/check/:phoneNumber`
- Verify phone number format (include country code)
- Make sure the client is ready (check `/status` endpoint)

### Disconnected frequently
- This can happen due to network issues
- The agent will try to reconnect automatically
- Check your internet connection

## 📚 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/status` | WhatsApp connection status |
| POST | `/send/message` | Send text message |
| POST | `/send/image` | Send image (multipart) |
| POST | `/send/image-url` | Send image from URL |
| POST | `/send/document` | Send document (multipart) |
| POST | `/send/location` | Send location |
| POST | `/send/contact` | Send contact card |
| POST | `/broadcast/message` | Broadcast text message |
| POST | `/broadcast/image` | Broadcast image |
| POST | `/group/create` | Create WhatsApp group |
| POST | `/group/send` | Send message to group |
| POST | `/status` | Post WhatsApp status |
| GET | `/chats` | Get all chats |
| GET | `/contacts` | Get all contacts |
| GET | `/check/:phoneNumber` | Check if number exists |
| GET | `/profile/:phoneNumber` | Get profile picture URL |
| POST | `/logout` | Logout from WhatsApp |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Credits

Built with:
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - WhatsApp Web API client
- [express](https://expressjs.com/) - Web framework
- [qrcode-terminal](https://github.com/gtanner/qrcode-terminal) - QR code display

## 💡 Use Cases

- **Customer Support**: Automated customer service responses
- **Marketing**: Broadcast promotions and updates
- **Notifications**: Send alerts and reminders
- **Integration**: Connect WhatsApp to your existing systems
- **Automation**: Automate repetitive WhatsApp tasks
- **Chatbots**: Build interactive WhatsApp bots

## 🚀 Next Steps

1. Customize the message handlers in `src/index.js`
2. Build your own features on top of the agent
3. Integrate with your existing applications via the REST API
4. Add database integration to store messages
5. Implement webhooks for real-time message notifications

---

Made with ❤️ for WhatsApp automation

For questions or issues, please open an issue on GitHub.

