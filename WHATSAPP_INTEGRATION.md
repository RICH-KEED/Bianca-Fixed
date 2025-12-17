# 🚀 WhatsApp Agent Integration

## Overview

The WhatsApp agent provides **bi-directional** integration between your FastMode interface and WhatsApp. You can:

1. **FastMode → WhatsApp**: Send messages, images, flowcharts, and documents from FastMode to WhatsApp contacts
2. **WhatsApp → FastMode**: Receive WhatsApp messages and automatically process them with appropriate agents

---

## 🎯 Features

### Direction 1: FastMode → WhatsApp

Send content to WhatsApp contacts directly from FastMode:

- ✅ **Text Messages**: `"Send message to Abhi at +919876543221: Meeting at 5pm"`
- ✅ **Generated Images**: `"Create a Discord logo and send to Abhi on WhatsApp"`
- ✅ **Flowcharts**: `"Generate user auth flowchart and send to John"`
- ✅ **Case Studies**: `"Create project case study and share on WhatsApp"`
- ✅ **Charts/Plots**: `"Plot Q4 revenue and send to team on WhatsApp"`
- ✅ **AI Message Rewrite**: Edit messages with Gemini before sending
- ✅ **Preview Before Send**: Review all content before sending

### Direction 2: WhatsApp → FastMode

Process incoming WhatsApp messages automatically:

- ✅ **Auto-Route to Agents**: Messages are intelligently routed to appropriate agents
- ✅ **Automatic Response**: Agents process and respond via WhatsApp
- ✅ **Media Support**: Send back images, charts, flowcharts
- ✅ **Research Queries**: `"Research quantum computing"` → Get summary via WhatsApp
- ✅ **Image Generation**: `"Generate a cat image"` → Receive image via WhatsApp
- ✅ **Flowchart Creation**: `"Create signup flow"` → Get flowchart via WhatsApp

---

## 🔧 Setup Instructions

### 1. Install WhatsApp Agent Dependencies

```bash
cd Whatsapp-Agent
npm install
```

### 2. Start WhatsApp Service

```bash
cd Whatsapp-Agent
npm start
```

### 3. Scan QR Code

1. A QR code will appear in the terminal
2. Open WhatsApp on your phone
3. Go to **Settings > Linked Devices**
4. Tap **"Link a Device"**
5. Scan the QR code
6. Wait for "✅ WhatsApp Agent is ready!" message

### 4. Configure Webhook (for incoming messages)

The WhatsApp service automatically forwards incoming messages to:
```
http://localhost:5000/api/whatsapp/webhook
```

To configure a custom webhook URL:
```bash
curl -X POST http://localhost:3000/configure/webhook \
  -H "Content-Type: application/json" \
  -d '{"backendUrl": "http://localhost:5000/api/whatsapp/webhook"}'
```

---

## 📱 Usage Examples

### Example 1: Send Simple Message

**FastMode Input:**
```
Send message to Abhi at +919876543221: "Hey! Can we meet tomorrow at 3pm?"
```

**What Happens:**
1. Router detects WhatsApp agent needed
2. Extracts recipient: `+919876543221`
3. Extracts message: `"Hey! Can we meet tomorrow at 3pm?"`
4. Shows preview in FastMode UI
5. You can edit or rewrite with AI
6. Click "Send via WhatsApp" to send

---

### Example 2: Generate and Send Image

**FastMode Input:**
```
Create a professional logo for "TechStartup Inc" and send to John at +91234567890
```

**What Happens:**
1. Router detects: Image Agent + WhatsApp Agent
2. Image Agent generates logo
3. WhatsApp preview shows:
   - Recipient: John (+91234567890)
   - Preview of generated logo
   - Caption field
4. Click send → Image sent via WhatsApp with caption

---

### Example 3: Flowchart via WhatsApp

**FastMode Input:**
```
Generate user authentication flowchart and send to dev team on WhatsApp at +91987654321
```

**What Happens:**
1. Flowchart Agent creates authentication flow
2. Converts Mermaid diagram to image (PNG)
3. WhatsApp preview shows flowchart image
4. Send to dev team number

---

### Example 4: Incoming Message Processing

**WhatsApp Message (to bot):**
```
Research the latest trends in AI for 2024
```

**What Happens:**
1. WhatsApp service receives message
2. Forwards to backend webhook
3. Router routes to Research Agent
4. Research Agent finds information
5. Summary sent back via WhatsApp automatically

---

### Example 5: Incoming Image Request

**WhatsApp Message (to bot):**
```
Generate an image of a futuristic city at sunset
```

**What Happens:**
1. Message forwarded to backend
2. Routed to Image Agent
3. Image generated
4. Image file sent back via WhatsApp
5. User receives image directly in chat

---

## 🎨 UI Components

### WhatsApp Preview Card

When you request a WhatsApp send, you'll see:

```
┌─────────────────────────────────────┐
│ 📱 WhatsApp Message Preview         │
├─────────────────────────────────────┤
│ To: Abhi                            │
│     +919876543221                   │
├─────────────────────────────────────┤
│ Message:                            │
│ ┌───────────────────────────────┐   │
│ │ Hey! Can we meet tomorrow?    │   │
│ │                               │   │
│ └───────────────────────────────┘   │
├─────────────────────────────────────┤
│ [📤 Send via WhatsApp] [✨ Rewrite] │
└─────────────────────────────────────┘
```

### Features:
- ✏️ **Editable Message**: Edit text before sending
- ✨ **AI Rewrite**: Click "Rewrite" to improve message with Gemini
- 👤 **Recipient Info**: Shows name and number
- 📤 **Send Button**: Green button to send
- ⚠️ **Service Status**: Shows if WhatsApp service is running

---

## 🔌 API Endpoints

### Backend (Python Flask)

#### 1. Send WhatsApp Message
```http
POST /api/whatsapp/send
Content-Type: application/json

{
  "operation": "send_message",
  "phone_number": "+919876543221",
  "message": "Hello from FastMode!"
}
```

#### 2. Send WhatsApp Image
```http
POST /api/whatsapp/send
Content-Type: application/json

{
  "operation": "send_image",
  "phone_number": "+919876543221",
  "image_path": "outputs/images/logo.png",
  "caption": "Check out this logo!"
}
```

#### 3. Rewrite Message with AI
```http
POST /api/whatsapp/rewrite
Content-Type: application/json

{
  "message": "hey can we meet tmrw",
  "tone": "professional"
}

Response:
{
  "status": "success",
  "original": "hey can we meet tmrw",
  "rewritten": "Hello! Would you be available to meet tomorrow?",
  "tone": "professional"
}
```

#### 4. Incoming Message Webhook
```http
POST /api/whatsapp/webhook
Content-Type: application/json

{
  "from": "919876543221",
  "body": "Research quantum computing",
  "type": "text",
  "senderName": "Abhi",
  "timestamp": 1234567890
}
```

---

### WhatsApp Service (Node.js)

#### Health Check
```http
GET http://localhost:3000/health

Response:
{
  "status": "ok",
  "ready": true,
  "timestamp": "2024-12-17T..."
}
```

#### Configure Webhook
```http
POST http://localhost:3000/configure/webhook
Content-Type: application/json

{
  "backendUrl": "http://localhost:5000/api/whatsapp/webhook"
}
```

---

## 🔍 How It Works

### FastMode → WhatsApp Flow

```
User Input (FastMode)
    ↓
Router (Gemini)
    ↓
WhatsApp Agent (Python)
    ↓
WhatsApp Service (Node.js)
    ↓
WhatsApp Web API
    ↓
📱 Recipient's WhatsApp
```

### WhatsApp → FastMode Flow

```
📱 Incoming WhatsApp Message
    ↓
WhatsApp Web API
    ↓
WhatsApp Service (Node.js)
    ↓
Webhook → Backend (Flask)
    ↓
Router (Gemini)
    ↓
Appropriate Agent(s)
    ↓
Response via WhatsApp
```

---

## 🎯 Supported Operations

| Operation | FastMode → WhatsApp | WhatsApp → FastMode |
|-----------|---------------------|---------------------|
| Text Messages | ✅ | ✅ |
| Images | ✅ | ✅ |
| Documents | ✅ | ❌ |
| Flowcharts | ✅ | ✅ |
| Charts/Plots | ✅ | ✅ |
| Case Studies | ✅ | ❌ |
| Research | ✅ | ✅ |
| Brainstorming | ✅ | ✅ |

---

## 🛠️ Configuration

### Environment Variables

**.env** (Root directory)
```env
GEMINI_API_KEY=your_gemini_key
PERPLEXITY_API_KEY=your_perplexity_key
# ... other keys
```

**Whatsapp-Agent/.env**
```env
PORT=3000
SESSION_NAME=whatsapp-session
```

---

## 🚨 Troubleshooting

### Issue: "WhatsApp service is not ready"

**Solution:**
1. Check if WhatsApp service is running: `cd Whatsapp-Agent && npm start`
2. Scan QR code if prompted
3. Wait for "✅ WhatsApp Agent is ready!" message

### Issue: Messages not being received (WhatsApp → FastMode)

**Solution:**
1. Check webhook configuration
2. Ensure backend is running: `python test_server.py`
3. Check console logs for incoming webhook calls

### Issue: "Failed to send WhatsApp message"

**Solution:**
1. Verify phone number format (include country code: +91...)
2. Check if WhatsApp service is authenticated
3. Verify recipient has WhatsApp

### Issue: QR Code not appearing

**Solution:**
1. Delete `.wwebjs_auth` folder in Whatsapp-Agent directory
2. Restart WhatsApp service
3. New QR code should appear

---

## 📊 Phone Number Format

Always use international format:

✅ **Correct:**
- `+919876543221`
- `+14155552671`
- `919876543221`

❌ **Incorrect:**
- `9876543221` (missing country code)
- `+91-781-499-6201` (dashes not supported)
- `(781) 499-6201` (parentheses not supported)

---

## 🎓 Advanced Usage

### Broadcast Messages

```python
# Send to multiple contacts
Send "Project update: Deployment successful!" to +919876543221, +919876543210, +911234567890 on WhatsApp
```

### Conditional Sends

```python
# Generate and conditionally send
Create Q4 revenue chart. If profit > 1M, send to CEO on WhatsApp at +911234567890
```

### Chain Operations

```python
# Research, summarize, and send
Research "AI trends 2024", create summary document, and send to team lead on WhatsApp
```

---

## 🔒 Security Notes

1. **Session Storage**: WhatsApp session is stored in `.wwebjs_auth/` - keep this secure
2. **Phone Numbers**: Never expose phone numbers in public repositories
3. **Webhook**: Use HTTPS in production for webhook URLs
4. **Rate Limiting**: WhatsApp has rate limits - don't spam messages

---

## 📚 Related Documentation

- [WhatsApp Agent README](Whatsapp-Agent/README.md)
- [Main README](README.md)
- [Agents Documentation](agents.md)

---

## 🎉 Success! You're All Set!

Now you can:
1. ✅ Send messages from FastMode to WhatsApp
2. ✅ Generate and share images via WhatsApp
3. ✅ Receive and process incoming WhatsApp messages
4. ✅ Use AI to rewrite messages before sending
5. ✅ Share flowcharts, charts, and case studies

**Try it now:**
```
Send "Hello from my AI assistant!" to <your-number> on WhatsApp
```

Enjoy your WhatsApp-powered AI assistant! 🚀📱✨

