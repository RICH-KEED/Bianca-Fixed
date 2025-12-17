import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';

class WhatsAppAgent {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.messageHandlers = [];
    
    this.initializeClient();
  }

  initializeClient() {
    // Initialize WhatsApp client with local authentication
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'whatsapp-agent',
        dataPath: './.wwebjs_auth'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      },
      webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
      }
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // QR Code generation
    this.client.on('qr', (qr) => {
      console.log('\n================================');
      console.log('📱 SCAN THIS QR CODE WITH WHATSAPP');
      console.log('================================\n');
      qrcode.generate(qr, { small: true });
      console.log('\n================================');
      console.log('Open WhatsApp on your phone');
      console.log('Go to Settings > Linked Devices');
      console.log('Tap "Link a Device" and scan the QR code above');
      console.log('================================\n');
    });

    // Authentication success
    this.client.on('authenticated', () => {
      console.log('✅ Authentication successful!');
    });

    // Authentication failure
    this.client.on('auth_failure', (msg) => {
      console.error('❌ Authentication failed:', msg);
    });

    // Client is ready
    this.client.on('ready', async () => {
      console.log('✅ WhatsApp Agent is ready!');
      this.isReady = true;
      
      const info = this.client.info;
      console.log(`📱 Connected as: ${info.pushname}`);
      console.log(`📞 Phone: ${info.wid.user}`);
      console.log('\n🚀 Agent is now ready to send and receive messages!\n');
    });

    // Disconnected
    this.client.on('disconnected', (reason) => {
      console.log('❌ Client was disconnected:', reason);
      this.isReady = false;
    });

    // Receive messages
    this.client.on('message', async (message) => {
      await this.handleIncomingMessage(message);
    });

    // Message creation (sent messages)
    this.client.on('message_create', async (message) => {
      // Handle sent messages if needed
      if (message.fromMe) {
        console.log(`📤 Sent message to ${message.to}: ${message.body}`);
      }
    });
  }

  // Start the client
  async start() {
    console.log('🚀 Starting WhatsApp Agent...');
    await this.client.initialize();
  }

  // Stop the client
  async stop() {
    console.log('🛑 Stopping WhatsApp Agent...');
    await this.client.destroy();
    this.isReady = false;
  }

  // Wait for client to be ready
  async waitForReady(timeout = 60000) {
    const startTime = Date.now();
    while (!this.isReady) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Timeout waiting for WhatsApp client to be ready');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return true;
  }

  // ============================================
  // SEND SMS (TEXT MESSAGES)
  // ============================================
  
  async sendMessage(phoneNumber, message) {
    try {
      const chatId = this.formatPhoneNumber(phoneNumber);
      const chat = await this.client.getChatById(chatId);
      const result = await chat.sendMessage(message);
      console.log(`✅ Message sent to ${phoneNumber}`);
      return { success: true, messageId: result.id._serialized, data: result };
    } catch (error) {
      console.error(`❌ Failed to send message to ${phoneNumber}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // SEND IMAGES
  // ============================================
  
  async sendImage(phoneNumber, imagePath, caption = '') {
    try {
      const chatId = this.formatPhoneNumber(phoneNumber);
      const media = MessageMedia.fromFilePath(imagePath);
      const result = await this.client.sendMessage(chatId, media, { caption });
      console.log(`✅ Image sent to ${phoneNumber}`);
      return { success: true, messageId: result.id._serialized, data: result };
    } catch (error) {
      console.error(`❌ Failed to send image to ${phoneNumber}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // SEND DOCUMENTS
  // ============================================
  
  async sendDocument(phoneNumber, documentPath, caption = '') {
    try {
      const chatId = this.formatPhoneNumber(phoneNumber);
      const media = MessageMedia.fromFilePath(documentPath);
      const result = await this.client.sendMessage(chatId, media, { 
        caption,
        sendMediaAsDocument: true 
      });
      console.log(`✅ Document sent to ${phoneNumber}`);
      return { success: true, messageId: result.id._serialized, data: result };
    } catch (error) {
      console.error(`❌ Failed to send document to ${phoneNumber}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // SEND MEDIA FROM URL
  // ============================================
  
  async sendMediaFromUrl(phoneNumber, url, caption = '', options = {}) {
    try {
      const chatId = this.formatPhoneNumber(phoneNumber);
      const media = await MessageMedia.fromUrl(url, options);
      const result = await this.client.sendMessage(chatId, media, { caption });
      console.log(`✅ Media from URL sent to ${phoneNumber}`);
      return { success: true, messageId: result.id._serialized, data: result };
    } catch (error) {
      console.error(`❌ Failed to send media from URL to ${phoneNumber}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // BROADCAST MESSAGES
  // ============================================
  
  async broadcast(phoneNumbers, message, delay = 1000) {
    const results = [];
    console.log(`📢 Starting broadcast to ${phoneNumbers.length} contacts...`);
    
    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumber = phoneNumbers[i];
      console.log(`📤 Sending to ${phoneNumber} (${i + 1}/${phoneNumbers.length})...`);
      
      const result = await this.sendMessage(phoneNumber, message);
      results.push({
        phoneNumber,
        ...result
      });
      
      // Delay between messages to avoid spam detection
      if (i < phoneNumbers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    const successful = results.filter(r => r.success).length;
    console.log(`✅ Broadcast complete: ${successful}/${phoneNumbers.length} successful`);
    
    return {
      total: phoneNumbers.length,
      successful,
      failed: phoneNumbers.length - successful,
      results
    };
  }

  // ============================================
  // BROADCAST IMAGES
  // ============================================
  
  async broadcastImage(phoneNumbers, imagePath, caption = '', delay = 1000) {
    const results = [];
    console.log(`📢 Starting image broadcast to ${phoneNumbers.length} contacts...`);
    
    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumber = phoneNumbers[i];
      console.log(`📤 Sending image to ${phoneNumber} (${i + 1}/${phoneNumbers.length})...`);
      
      const result = await this.sendImage(phoneNumber, imagePath, caption);
      results.push({
        phoneNumber,
        ...result
      });
      
      if (i < phoneNumbers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    const successful = results.filter(r => r.success).length;
    console.log(`✅ Image broadcast complete: ${successful}/${phoneNumbers.length} successful`);
    
    return {
      total: phoneNumbers.length,
      successful,
      failed: phoneNumbers.length - successful,
      results
    };
  }

  // ============================================
  // RECEIVE MESSAGES - Add custom handlers
  // ============================================
  
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  async handleIncomingMessage(message) {
    // Log incoming message
    const contact = await message.getContact();
    console.log(`📨 Received from ${contact.pushname || contact.number}: ${message.body}`);
    
    // Call all registered handlers
    for (const handler of this.messageHandlers) {
      try {
        await handler(message, contact);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    }
  }

  // ============================================
  // GET CHATS
  // ============================================
  
  async getChats() {
    try {
      const chats = await this.client.getChats();
      return chats;
    } catch (error) {
      console.error('Failed to get chats:', error.message);
      return [];
    }
  }

  // ============================================
  // GET CONTACTS
  // ============================================
  
  async getContacts() {
    try {
      const contacts = await this.client.getContacts();
      return contacts;
    } catch (error) {
      console.error('Failed to get contacts:', error.message);
      return [];
    }
  }

  // ============================================
  // SEND LOCATION
  // ============================================
  
  async sendLocation(phoneNumber, latitude, longitude, description = '') {
    try {
      const chatId = this.formatPhoneNumber(phoneNumber);
      const location = {
        location: {
          lat: latitude,
          lng: longitude,
          description
        }
      };
      const result = await this.client.sendMessage(chatId, location);
      console.log(`✅ Location sent to ${phoneNumber}`);
      return { success: true, messageId: result.id._serialized, data: result };
    } catch (error) {
      console.error(`❌ Failed to send location to ${phoneNumber}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // SEND CONTACT CARD
  // ============================================
  
  async sendContact(phoneNumber, contactNumber, contactName) {
    try {
      const chatId = this.formatPhoneNumber(phoneNumber);
      const contactId = this.formatPhoneNumber(contactNumber);
      const contact = await this.client.getContactById(contactId);
      const result = await this.client.sendMessage(chatId, contact);
      console.log(`✅ Contact card sent to ${phoneNumber}`);
      return { success: true, messageId: result.id._serialized, data: result };
    } catch (error) {
      console.error(`❌ Failed to send contact to ${phoneNumber}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // GROUP OPERATIONS
  // ============================================
  
  async createGroup(name, participants) {
    try {
      const participantIds = participants.map(p => this.formatPhoneNumber(p));
      const result = await this.client.createGroup(name, participantIds);
      console.log(`✅ Group created: ${name}`);
      return { success: true, groupId: result.gid._serialized, data: result };
    } catch (error) {
      console.error(`❌ Failed to create group:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async sendGroupMessage(groupId, message) {
    try {
      const result = await this.client.sendMessage(groupId, message);
      console.log(`✅ Group message sent`);
      return { success: true, messageId: result.id._serialized, data: result };
    } catch (error) {
      console.error(`❌ Failed to send group message:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // STATUS/STORY
  // ============================================
  
  async sendStatus(text) {
    try {
      const result = await this.client.sendMessage('status@broadcast', text);
      console.log(`✅ Status posted`);
      return { success: true, data: result };
    } catch (error) {
      console.error(`❌ Failed to post status:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  formatPhoneNumber(phoneNumber) {
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present (assuming India +91, change as needed)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    
    // Format as WhatsApp chat ID
    return `${cleaned}@c.us`;
  }

  async getProfilePicUrl(phoneNumber) {
    try {
      const chatId = this.formatPhoneNumber(phoneNumber);
      const url = await this.client.getProfilePicUrl(chatId);
      return url;
    } catch (error) {
      console.error(`Failed to get profile picture:`, error.message);
      return null;
    }
  }

  async isRegisteredUser(phoneNumber) {
    try {
      const chatId = this.formatPhoneNumber(phoneNumber);
      const isRegistered = await this.client.isRegisteredUser(chatId);
      return isRegistered;
    } catch (error) {
      console.error(`Failed to check if user is registered:`, error.message);
      return false;
    }
  }

  getState() {
    return this.client.getState();
  }

  async getInfo() {
    return this.client.info;
  }
}

export default WhatsAppAgent;

