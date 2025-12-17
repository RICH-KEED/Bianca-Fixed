# ⚡ Quick Start Guide

Get your WhatsApp Agent up and running in 5 minutes!

## 🎯 Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages.

## 🎯 Step 2: Start the Agent

```bash
npm start
```

## 🎯 Step 3: Scan QR Code

When you start the agent, you'll see a QR code in your terminal:

```
================================
📱 SCAN THIS QR CODE WITH WHATSAPP
================================

█████████████████████████████████
█████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄▀▄ ▀█ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀█▀ ▀█ █   █ ████
████ █▄▄▄█ █▀ █▀▀ ▀█▄▀█ █▄▄▄█ ████
...

================================
Open WhatsApp on your phone
Go to Settings > Linked Devices
Tap "Link a Device" and scan the QR code above
================================
```

**On your phone:**
1. Open WhatsApp
2. Tap the **⋮** (menu) button
3. Go to **"Linked Devices"**
4. Tap **"Link a Device"**
5. Scan the QR code shown in your terminal

## 🎯 Step 4: Wait for Connection

You'll see:
```
✅ Authentication successful!
✅ WhatsApp Agent is ready!
📱 Connected as: Your Name
📞 Phone: 1234567890

🚀 Agent is now ready to send and receive messages!

🌐 API Server running on http://localhost:3000
```

**That's it!** Your WhatsApp Agent is now running! 🎉

---

## 🚀 Send Your First Message

### Option 1: Using cURL

```bash
curl -X POST http://localhost:3000/send/message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "1234567890",
    "message": "Hello from WhatsApp Agent! 🚀"
  }'
```

Replace `1234567890` with the phone number you want to send to.

### Option 2: Using Python

```python
import requests

response = requests.post('http://localhost:3000/send/message', json={
    'phoneNumber': '1234567890',
    'message': 'Hello from WhatsApp Agent! 🚀'
})

print(response.json())
```

### Option 3: Open in Browser

Open your browser and visit:
```
http://localhost:3000/health
```

You should see:
```json
{
  "status": "ok",
  "ready": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 📸 Send Your First Image

```bash
curl -X POST http://localhost:3000/send/image \
  -F "phoneNumber=1234567890" \
  -F "caption=Check this out! 📸" \
  -F "image=@/path/to/your/image.jpg"
```

Replace `/path/to/your/image.jpg` with the actual path to an image file.

---

## 📢 Send Your First Broadcast

```bash
curl -X POST http://localhost:3000/broadcast/message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers": ["1234567890", "0987654321"],
    "message": "Hello everyone! This is a broadcast message 📢",
    "delay": 2000
  }'
```

---

## 🎮 Test All Features

Create a file called `test.py`:

```python
import requests
import time

BASE_URL = 'http://localhost:3000'
TEST_NUMBER = '1234567890'  # ⚠️ Replace with your test number

print("🚀 Testing WhatsApp Agent...\n")

# 1. Check health
print("1️⃣ Checking health...")
health = requests.get(f'{BASE_URL}/health').json()
print(f"   Status: {health['status']} ✅\n")

# 2. Check if ready
print("2️⃣ Checking WhatsApp status...")
status = requests.get(f'{BASE_URL}/status').json()
print(f"   Ready: {status['ready']} ✅\n")

# 3. Check if number is registered
print(f"3️⃣ Checking if {TEST_NUMBER} is on WhatsApp...")
check = requests.get(f'{BASE_URL}/check/{TEST_NUMBER}').json()
print(f"   Registered: {check['isRegistered']} ✅\n")

# 4. Send a message
print("4️⃣ Sending test message...")
response = requests.post(f'{BASE_URL}/send/message', json={
    'phoneNumber': TEST_NUMBER,
    'message': '🧪 Test message from WhatsApp Agent!'
}).json()
print(f"   Success: {response['success']} ✅\n")

# 5. Get chats
print("5️⃣ Getting chats...")
chats = requests.get(f'{BASE_URL}/chats').json()
print(f"   Total chats: {len(chats['chats'])} ✅\n")

print("✅ All tests passed! Your WhatsApp Agent is working perfectly!\n")
```

Run it:
```bash
python test.py
```

---

## 🛠️ Common Issues

### QR Code not showing?
- Your terminal might not support QR codes
- Try a different terminal (Windows Terminal, iTerm2, etc.)
- Or check the `.wwebjs_auth` folder for session data

### "Authentication failed"?
- Delete the `.wwebjs_auth` folder
- Run `npm start` again
- Scan the QR code again

### "Connection closed"?
- Check your internet connection
- Make sure WhatsApp Web isn't open in a browser
- Restart the agent: `npm start`

### Messages not sending?
- Verify the phone number format (include country code)
- Check if the number is registered: `curl http://localhost:3000/check/1234567890`
- Make sure the agent is ready: `curl http://localhost:3000/status`

---

## 📚 Next Steps

1. **Read the full documentation**: Check out `README.md` for complete feature list
2. **Explore API examples**: See `API_EXAMPLES.md` for all endpoints
3. **Customize message handlers**: Edit `src/index.js` to add auto-replies
4. **Build your integration**: Use the REST API in your app

---

## 🎯 Most Common Use Cases

### 1. Customer Support Bot
```javascript
// In src/index.js, add to the message handler:
agent.onMessage(async (message, contact) => {
  if (message.body.toLowerCase().includes('help')) {
    await message.reply('Hi! How can I help you today?\n\n1. Product info\n2. Pricing\n3. Support');
  }
});
```

### 2. Notification System
```python
# Send alerts from your app
import requests

def send_alert(user_phone, alert_message):
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': user_phone,
        'message': f'🔔 Alert: {alert_message}'
    })

# Use it
send_alert('1234567890', 'Your order has been shipped!')
```

### 3. Broadcast Marketing
```python
# Send promotions to customer list
import requests

customers = ['1234567890', '0987654321', '5555555555']
message = '''
🎉 Special Offer!
Get 50% off on all products today!
Use code: SAVE50
'''

requests.post('http://localhost:3000/broadcast/message', json={
    'phoneNumbers': customers,
    'message': message,
    'delay': 3000
})
```

---

## 🔥 Pro Tips

1. **Keep it running**: Use PM2 or similar to keep the agent running 24/7
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name whatsapp-agent
   ```

2. **Monitor logs**: Check what's happening
   ```bash
   pm2 logs whatsapp-agent
   ```

3. **Auto-restart**: The session persists, so you can restart without re-scanning
   ```bash
   pm2 restart whatsapp-agent
   ```

4. **Add authentication**: Protect your API endpoints in production
   ```javascript
   // In src/api.js, add middleware
   app.use((req, res, next) => {
     const apiKey = req.headers['x-api-key'];
     if (apiKey !== process.env.API_KEY) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     next();
   });
   ```

---

## ✅ You're All Set!

Your WhatsApp Agent is now running and ready to use. Start building amazing automation! 🚀

For questions or issues, check the full README.md or open an issue on GitHub.

**Happy automating!** 🎉

