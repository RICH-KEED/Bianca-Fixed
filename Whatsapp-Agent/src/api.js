import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

class WhatsAppAPI {
  constructor(agent) {
    this.agent = agent;
    this.app = express();
    this.backendWebhookUrl = null;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupIncomingMessageHandler();
  }
  
  setupIncomingMessageHandler() {
    // Register handler for incoming messages
    this.agent.onMessage(async (message, contact) => {
      // Forward to backend webhook if configured
      if (this.backendWebhookUrl) {
        try {
          const payload = {
            from: contact.number,
            body: message.body,
            type: message.type,
            senderName: contact.pushname || contact.name || contact.number,
            timestamp: message.timestamp
          };
          
          console.log(`🔄 Forwarding message to backend: ${this.backendWebhookUrl}`);
          const response = await fetch(this.backendWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
          }
          
          console.log(`✅ Message forwarded successfully`);
        } catch (error) {
          console.error('Failed to forward message to backend:', error.message);
        }
      }
    });
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        ready: this.agent.isReady,
        timestamp: new Date().toISOString()
      });
    });

    // Get agent status
    this.app.get('/status', async (req, res) => {
      try {
        const info = this.agent.isReady ? await this.agent.getInfo() : null;
        res.json({
          ready: this.agent.isReady,
          state: await this.agent.getState(),
          info: info ? {
            name: info.pushname,
            phone: info.wid.user,
            platform: info.platform
          } : null
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // REGISTER WEBHOOK WITH BACKEND
    // ============================================
    this.app.post('/configure/webhook', (req, res) => {
      try {
        const { backendUrl } = req.body;
        if (backendUrl) {
          this.backendWebhookUrl = backendUrl;
          console.log(`✅ Backend webhook configured: ${backendUrl}`);
        }
        res.json({ success: true, webhookUrl: this.backendWebhookUrl });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // SEND MESSAGE
    // ============================================
    this.app.post('/send/message', async (req, res) => {
      try {
        const { phoneNumber, message } = req.body;
        
        if (!phoneNumber || !message) {
          return res.status(400).json({ error: 'phoneNumber and message are required' });
        }

        const result = await this.agent.sendMessage(phoneNumber, message);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // SEND IMAGE
    // ============================================
    this.app.post('/send/image', upload.single('image'), async (req, res) => {
      try {
        const { phoneNumber, caption } = req.body;
        
        if (!phoneNumber) {
          return res.status(400).json({ error: 'phoneNumber is required' });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'image file is required' });
        }

        const result = await this.agent.sendImage(phoneNumber, req.file.path, caption || '');
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // SEND IMAGE FROM URL
    // ============================================
    this.app.post('/send/image-url', async (req, res) => {
      try {
        const { phoneNumber, url, caption } = req.body;
        
        if (!phoneNumber || !url) {
          return res.status(400).json({ error: 'phoneNumber and url are required' });
        }

        const result = await this.agent.sendMediaFromUrl(phoneNumber, url, caption || '');
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // SEND DOCUMENT
    // ============================================
    this.app.post('/send/document', upload.single('document'), async (req, res) => {
      try {
        const { phoneNumber, caption } = req.body;
        
        if (!phoneNumber) {
          return res.status(400).json({ error: 'phoneNumber is required' });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'document file is required' });
        }

        const result = await this.agent.sendDocument(phoneNumber, req.file.path, caption || '');
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // BROADCAST MESSAGE
    // ============================================
    this.app.post('/broadcast/message', async (req, res) => {
      try {
        const { phoneNumbers, message, delay } = req.body;
        
        if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
          return res.status(400).json({ error: 'phoneNumbers array is required' });
        }

        if (!message) {
          return res.status(400).json({ error: 'message is required' });
        }

        const result = await this.agent.broadcast(phoneNumbers, message, delay || 1000);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // BROADCAST IMAGE
    // ============================================
    this.app.post('/broadcast/image', upload.single('image'), async (req, res) => {
      try {
        const { phoneNumbers, caption, delay } = req.body;
        
        // Parse phoneNumbers if it's a string
        let numbers = phoneNumbers;
        if (typeof phoneNumbers === 'string') {
          numbers = JSON.parse(phoneNumbers);
        }

        if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
          return res.status(400).json({ error: 'phoneNumbers array is required' });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'image file is required' });
        }

        const result = await this.agent.broadcastImage(numbers, req.file.path, caption || '', delay || 1000);
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // SEND LOCATION
    // ============================================
    this.app.post('/send/location', async (req, res) => {
      try {
        const { phoneNumber, latitude, longitude, description } = req.body;
        
        if (!phoneNumber || !latitude || !longitude) {
          return res.status(400).json({ error: 'phoneNumber, latitude, and longitude are required' });
        }

        const result = await this.agent.sendLocation(phoneNumber, latitude, longitude, description || '');
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // SEND CONTACT
    // ============================================
    this.app.post('/send/contact', async (req, res) => {
      try {
        const { phoneNumber, contactNumber, contactName } = req.body;
        
        if (!phoneNumber || !contactNumber) {
          return res.status(400).json({ error: 'phoneNumber and contactNumber are required' });
        }

        const result = await this.agent.sendContact(phoneNumber, contactNumber, contactName || '');
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // CREATE GROUP
    // ============================================
    this.app.post('/group/create', async (req, res) => {
      try {
        const { name, participants } = req.body;
        
        if (!name || !participants || !Array.isArray(participants)) {
          return res.status(400).json({ error: 'name and participants array are required' });
        }

        const result = await this.agent.createGroup(name, participants);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // SEND GROUP MESSAGE
    // ============================================
    this.app.post('/group/send', async (req, res) => {
      try {
        const { groupId, message } = req.body;
        
        if (!groupId || !message) {
          return res.status(400).json({ error: 'groupId and message are required' });
        }

        const result = await this.agent.sendGroupMessage(groupId, message);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // GET CHATS
    // ============================================
    this.app.get('/chats', async (req, res) => {
      try {
        const chats = await this.agent.getChats();
        const chatList = chats.map(chat => ({
          id: chat.id._serialized,
          name: chat.name,
          isGroup: chat.isGroup,
          unreadCount: chat.unreadCount,
          lastMessage: chat.lastMessage ? {
            body: chat.lastMessage.body,
            timestamp: chat.lastMessage.timestamp
          } : null
        }));
        res.json({ chats: chatList });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // GET CONTACTS
    // ============================================
    this.app.get('/contacts', async (req, res) => {
      try {
        const contacts = await this.agent.getContacts();
        const contactList = contacts.map(contact => ({
          id: contact.id._serialized,
          number: contact.number,
          name: contact.name || contact.pushname,
          isMyContact: contact.isMyContact
        }));
        res.json({ contacts: contactList });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // CHECK IF USER EXISTS
    // ============================================
    this.app.get('/check/:phoneNumber', async (req, res) => {
      try {
        const { phoneNumber } = req.params;
        const isRegistered = await this.agent.isRegisteredUser(phoneNumber);
        res.json({ phoneNumber, isRegistered });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // GET PROFILE PICTURE
    // ============================================
    this.app.get('/profile/:phoneNumber', async (req, res) => {
      try {
        const { phoneNumber } = req.params;
        const url = await this.agent.getProfilePicUrl(phoneNumber);
        res.json({ phoneNumber, profilePicUrl: url });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // POST STATUS
    // ============================================
    this.app.post('/status', async (req, res) => {
      try {
        const { text } = req.body;
        
        if (!text) {
          return res.status(400).json({ error: 'text is required' });
        }

        const result = await this.agent.sendStatus(text);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============================================
    // LOGOUT
    // ============================================
    this.app.post('/logout', async (req, res) => {
      try {
        await this.agent.stop();
        res.json({ success: true, message: 'Logged out successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  start(port = 3000) {
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
        console.log(`\n🌐 API Server running on http://localhost:${port}`);
        console.log('\n📚 Available Endpoints:');
        console.log('   GET  /health              - Health check');
        console.log('   GET  /status              - WhatsApp connection status');
        console.log('   POST /send/message        - Send text message');
        console.log('   POST /send/image          - Send image (multipart)');
        console.log('   POST /send/image-url      - Send image from URL');
        console.log('   POST /send/document       - Send document (multipart)');
        console.log('   POST /send/location       - Send location');
        console.log('   POST /send/contact        - Send contact card');
        console.log('   POST /broadcast/message   - Broadcast text to multiple numbers');
        console.log('   POST /broadcast/image     - Broadcast image to multiple numbers');
        console.log('   POST /group/create        - Create WhatsApp group');
        console.log('   POST /group/send          - Send message to group');
        console.log('   POST /status              - Post WhatsApp status');
        console.log('   GET  /chats               - Get all chats');
        console.log('   GET  /contacts            - Get all contacts');
        console.log('   GET  /check/:phoneNumber  - Check if number exists on WhatsApp');
        console.log('   GET  /profile/:phoneNumber - Get profile picture URL');
        console.log('   POST /logout              - Logout from WhatsApp\n');
        resolve(this.server);
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('🛑 API Server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export default WhatsAppAPI;

