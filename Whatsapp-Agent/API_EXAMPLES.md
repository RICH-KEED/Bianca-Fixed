# 📡 WhatsApp Agent - API Examples

Complete examples for all API endpoints with request/response samples.

## Base URL
```
http://localhost:3000
```

---

## 1️⃣ Health Check

### Request
```http
GET /health
```

### Response
```json
{
  "status": "ok",
  "ready": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### cURL
```bash
curl http://localhost:3000/health
```

---

## 2️⃣ Get Status

### Request
```http
GET /status
```

### Response
```json
{
  "ready": true,
  "state": "CONNECTED",
  "info": {
    "name": "Your Name",
    "phone": "1234567890",
    "platform": "android"
  }
}
```

### cURL
```bash
curl http://localhost:3000/status
```

---

## 3️⃣ Send Text Message

### Request
```http
POST /send/message
Content-Type: application/json

{
  "phoneNumber": "1234567890",
  "message": "Hello! This is a test message from WhatsApp Agent 🚀"
}
```

### Response
```json
{
  "success": true,
  "messageId": "true_1234567890@c.us_3EB0XXXXXX",
  "data": { ... }
}
```

### cURL
```bash
curl -X POST http://localhost:3000/send/message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "1234567890",
    "message": "Hello from cURL!"
  }'
```

### Python
```python
import requests

response = requests.post('http://localhost:3000/send/message', json={
    'phoneNumber': '1234567890',
    'message': 'Hello from Python! 🐍'
})
print(response.json())
```

### JavaScript (Node.js)
```javascript
const response = await fetch('http://localhost:3000/send/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '1234567890',
    message: 'Hello from Node.js!'
  })
});
const data = await response.json();
console.log(data);
```

---

## 4️⃣ Send Image (Upload)

### Request
```http
POST /send/image
Content-Type: multipart/form-data

phoneNumber: 1234567890
caption: Check out this amazing image! 📸
image: [binary file data]
```

### Response
```json
{
  "success": true,
  "messageId": "true_1234567890@c.us_3EB0XXXXXX",
  "data": { ... }
}
```

### cURL
```bash
curl -X POST http://localhost:3000/send/image \
  -F "phoneNumber=1234567890" \
  -F "caption=Amazing photo! 📸" \
  -F "image=@/path/to/your/image.jpg"
```

### Python
```python
import requests

with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {
        'phoneNumber': '1234567890',
        'caption': 'Check this out! 📸'
    }
    response = requests.post(
        'http://localhost:3000/send/image',
        files=files,
        data=data
    )
    print(response.json())
```

### JavaScript (with FormData)
```javascript
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('phoneNumber', '1234567890');
form.append('caption', 'Check this out! 📸');
form.append('image', fs.createReadStream('image.jpg'));

const response = await fetch('http://localhost:3000/send/image', {
  method: 'POST',
  body: form
});
const data = await response.json();
console.log(data);
```

---

## 5️⃣ Send Image from URL

### Request
```http
POST /send/image-url
Content-Type: application/json

{
  "phoneNumber": "1234567890",
  "url": "https://picsum.photos/800/600",
  "caption": "Random image from URL 🌐"
}
```

### Response
```json
{
  "success": true,
  "messageId": "true_1234567890@c.us_3EB0XXXXXX",
  "data": { ... }
}
```

### cURL
```bash
curl -X POST http://localhost:3000/send/image-url \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "1234567890",
    "url": "https://picsum.photos/800/600",
    "caption": "Image from URL"
  }'
```

---

## 6️⃣ Send Document

### Request
```http
POST /send/document
Content-Type: multipart/form-data

phoneNumber: 1234567890
caption: Important document 📄
document: [binary file data]
```

### Response
```json
{
  "success": true,
  "messageId": "true_1234567890@c.us_3EB0XXXXXX",
  "data": { ... }
}
```

### cURL
```bash
curl -X POST http://localhost:3000/send/document \
  -F "phoneNumber=1234567890" \
  -F "caption=Please review this document" \
  -F "document=@/path/to/document.pdf"
```

### Python
```python
import requests

with open('document.pdf', 'rb') as f:
    files = {'document': f}
    data = {
        'phoneNumber': '1234567890',
        'caption': 'Important PDF'
    }
    response = requests.post(
        'http://localhost:3000/send/document',
        files=files,
        data=data
    )
    print(response.json())
```

---

## 7️⃣ Broadcast Message

### Request
```http
POST /broadcast/message
Content-Type: application/json

{
  "phoneNumbers": [
    "1234567890",
    "0987654321",
    "5555555555"
  ],
  "message": "🎉 Special announcement for everyone!\n\nThis is a broadcast message.",
  "delay": 2000
}
```

### Response
```json
{
  "total": 3,
  "successful": 3,
  "failed": 0,
  "results": [
    {
      "phoneNumber": "1234567890",
      "success": true,
      "messageId": "true_1234567890@c.us_3EB0XXXXXX"
    },
    {
      "phoneNumber": "0987654321",
      "success": true,
      "messageId": "true_0987654321@c.us_3EB0YYYYYY"
    },
    {
      "phoneNumber": "5555555555",
      "success": true,
      "messageId": "true_5555555555@c.us_3EB0ZZZZZZ"
    }
  ]
}
```

### cURL
```bash
curl -X POST http://localhost:3000/broadcast/message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumbers": ["1234567890", "0987654321"],
    "message": "Broadcast message!",
    "delay": 2000
  }'
```

### Python
```python
import requests

response = requests.post('http://localhost:3000/broadcast/message', json={
    'phoneNumbers': ['1234567890', '0987654321', '5555555555'],
    'message': '🎉 Special announcement!',
    'delay': 3000  # 3 seconds delay between messages
})
print(response.json())
```

---

## 8️⃣ Broadcast Image

### Request
```http
POST /broadcast/image
Content-Type: multipart/form-data

phoneNumbers: ["1234567890", "0987654321"]
caption: Special offer for everyone! 🎁
delay: 2000
image: [binary file data]
```

### Response
```json
{
  "total": 2,
  "successful": 2,
  "failed": 0,
  "results": [ ... ]
}
```

### cURL
```bash
curl -X POST http://localhost:3000/broadcast/image \
  -F 'phoneNumbers=["1234567890", "0987654321"]' \
  -F "caption=Special offer! 🎁" \
  -F "delay=2000" \
  -F "image=@/path/to/image.jpg"
```

---

## 9️⃣ Send Location

### Request
```http
POST /send/location
Content-Type: application/json

{
  "phoneNumber": "1234567890",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "description": "New Delhi, India 🇮🇳"
}
```

### Response
```json
{
  "success": true,
  "messageId": "true_1234567890@c.us_3EB0XXXXXX",
  "data": { ... }
}
```

### cURL
```bash
curl -X POST http://localhost:3000/send/location \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "1234567890",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "description": "New Delhi, India"
  }'
```

### Popular Locations
```javascript
// New York City
{ latitude: 40.7128, longitude: -74.0060, description: "New York City, USA" }

// London
{ latitude: 51.5074, longitude: -0.1278, description: "London, UK" }

// Tokyo
{ latitude: 35.6762, longitude: 139.6503, description: "Tokyo, Japan" }

// Paris
{ latitude: 48.8566, longitude: 2.3522, description: "Paris, France" }

// Mumbai
{ latitude: 19.0760, longitude: 72.8777, description: "Mumbai, India" }
```

---

## 🔟 Send Contact Card

### Request
```http
POST /send/contact
Content-Type: application/json

{
  "phoneNumber": "1234567890",
  "contactNumber": "0987654321",
  "contactName": "John Doe"
}
```

### Response
```json
{
  "success": true,
  "messageId": "true_1234567890@c.us_3EB0XXXXXX",
  "data": { ... }
}
```

### cURL
```bash
curl -X POST http://localhost:3000/send/contact \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "1234567890",
    "contactNumber": "0987654321",
    "contactName": "John Doe"
  }'
```

---

## 1️⃣1️⃣ Create WhatsApp Group

### Request
```http
POST /group/create
Content-Type: application/json

{
  "name": "My Awesome Group 🎉",
  "participants": [
    "1234567890",
    "0987654321",
    "5555555555"
  ]
}
```

### Response
```json
{
  "success": true,
  "groupId": "123456789-1234567890@g.us",
  "data": { ... }
}
```

### cURL
```bash
curl -X POST http://localhost:3000/group/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Group",
    "participants": ["1234567890", "0987654321"]
  }'
```

---

## 1️⃣2️⃣ Send Group Message

### Request
```http
POST /group/send
Content-Type: application/json

{
  "groupId": "123456789-1234567890@g.us",
  "message": "Hello everyone in the group! 👋"
}
```

### Response
```json
{
  "success": true,
  "messageId": "true_123456789-1234567890@g.us_3EB0XXXXXX",
  "data": { ... }
}
```

### cURL
```bash
curl -X POST http://localhost:3000/group/send \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "123456789-1234567890@g.us",
    "message": "Hello group!"
  }'
```

---

## 1️⃣3️⃣ Post WhatsApp Status

### Request
```http
POST /status
Content-Type: application/json

{
  "text": "Having a great day! 🌟 #WhatsAppStatus"
}
```

### Response
```json
{
  "success": true,
  "data": { ... }
}
```

### cURL
```bash
curl -X POST http://localhost:3000/status \
  -H "Content-Type: application/json" \
  -d '{
    "text": "My WhatsApp status update!"
  }'
```

---

## 1️⃣4️⃣ Get All Chats

### Request
```http
GET /chats
```

### Response
```json
{
  "chats": [
    {
      "id": "1234567890@c.us",
      "name": "John Doe",
      "isGroup": false,
      "unreadCount": 2,
      "lastMessage": {
        "body": "Hey, how are you?",
        "timestamp": 1234567890
      }
    },
    {
      "id": "123456789-1234567890@g.us",
      "name": "Family Group",
      "isGroup": true,
      "unreadCount": 0,
      "lastMessage": {
        "body": "See you tomorrow!",
        "timestamp": 1234567890
      }
    }
  ]
}
```

### cURL
```bash
curl http://localhost:3000/chats
```

---

## 1️⃣5️⃣ Get All Contacts

### Request
```http
GET /contacts
```

### Response
```json
{
  "contacts": [
    {
      "id": "1234567890@c.us",
      "number": "1234567890",
      "name": "John Doe",
      "isMyContact": true
    },
    {
      "id": "0987654321@c.us",
      "number": "0987654321",
      "name": "Jane Smith",
      "isMyContact": true
    }
  ]
}
```

### cURL
```bash
curl http://localhost:3000/contacts
```

---

## 1️⃣6️⃣ Check if Number is Registered

### Request
```http
GET /check/1234567890
```

### Response
```json
{
  "phoneNumber": "1234567890",
  "isRegistered": true
}
```

### cURL
```bash
curl http://localhost:3000/check/1234567890
```

### Python
```python
import requests

response = requests.get('http://localhost:3000/check/1234567890')
print(response.json())
```

---

## 1️⃣7️⃣ Get Profile Picture URL

### Request
```http
GET /profile/1234567890
```

### Response
```json
{
  "phoneNumber": "1234567890",
  "profilePicUrl": "https://pps.whatsapp.net/v/t61..."
}
```

### cURL
```bash
curl http://localhost:3000/profile/1234567890
```

---

## 1️⃣8️⃣ Logout

### Request
```http
POST /logout
```

### Response
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### cURL
```bash
curl -X POST http://localhost:3000/logout
```

---

## 💡 Pro Tips

### 1. Batch Operations
Send multiple messages efficiently:
```python
import requests
import time

numbers = ['1234567890', '0987654321', '5555555555']
message = "Important announcement!"

for number in numbers:
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': number,
        'message': message
    })
    time.sleep(2)  # 2 second delay to avoid spam detection
```

### 2. Error Handling
Always handle errors properly:
```python
import requests

try:
    response = requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': '1234567890',
        'message': 'Hello!'
    })
    response.raise_for_status()
    data = response.json()
    
    if data['success']:
        print(f"✅ Message sent! ID: {data['messageId']}")
    else:
        print(f"❌ Failed: {data['error']}")
except requests.exceptions.RequestException as e:
    print(f"❌ Request failed: {e}")
```

### 3. Using Environment Variables
```bash
# .env file
WHATSAPP_API_URL=http://localhost:3000
DEFAULT_PHONE=1234567890
```

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_url = os.getenv('WHATSAPP_API_URL')
phone = os.getenv('DEFAULT_PHONE')

response = requests.post(f'{api_url}/send/message', json={
    'phoneNumber': phone,
    'message': 'Hello!'
})
```

---

## 🔄 Complete Workflow Example

```python
import requests
import time

BASE_URL = 'http://localhost:3000'

# 1. Check health
health = requests.get(f'{BASE_URL}/health').json()
print(f"Health: {health['status']}")

# 2. Check status
status = requests.get(f'{BASE_URL}/status').json()
if not status['ready']:
    print("WhatsApp not ready!")
    exit()

# 3. Check if number is registered
phone = '1234567890'
check = requests.get(f'{BASE_URL}/check/{phone}').json()
if not check['isRegistered']:
    print(f"{phone} is not on WhatsApp!")
    exit()

# 4. Send a message
msg_response = requests.post(f'{BASE_URL}/send/message', json={
    'phoneNumber': phone,
    'message': 'Hello! This is an automated message.'
}).json()

if msg_response['success']:
    print(f"✅ Message sent! ID: {msg_response['messageId']}")
else:
    print(f"❌ Failed: {msg_response['error']}")

# 5. Send an image
time.sleep(2)  # Wait 2 seconds
with open('promo.jpg', 'rb') as f:
    img_response = requests.post(
        f'{BASE_URL}/send/image',
        files={'image': f},
        data={'phoneNumber': phone, 'caption': 'Special offer!'}
    ).json()

if img_response['success']:
    print("✅ Image sent!")

# 6. Broadcast to multiple contacts
time.sleep(2)
broadcast_response = requests.post(f'{BASE_URL}/broadcast/message', json={
    'phoneNumbers': ['1234567890', '0987654321'],
    'message': 'Broadcast announcement!',
    'delay': 3000
}).json()

print(f"📢 Broadcast: {broadcast_response['successful']}/{broadcast_response['total']} successful")
```

---

## 📱 Testing with Postman

1. Import the API into Postman
2. Create a new environment with:
   - `base_url`: `http://localhost:3000`
   - `phone_number`: Your test phone number
3. Use `{{base_url}}` and `{{phone_number}}` in your requests

---

Made with ❤️ for WhatsApp automation

