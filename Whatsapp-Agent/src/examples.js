/**
 * WhatsApp Agent - Usage Examples
 * 
 * This file contains examples of how to use the WhatsApp Agent programmatically
 * You can also use the REST API endpoints - see README.md for API documentation
 */

import WhatsAppAgent from './WhatsAppAgent.js';

async function examples() {
  // Create agent instance
  const agent = new WhatsAppAgent();
  
  // Start the agent
  await agent.start();
  
  // Wait for agent to be ready
  await agent.waitForReady();
  
  console.log('\n📝 Running examples...\n');
  
  // Example phone numbers (replace with actual numbers)
  const testNumber = '1234567890'; // Replace with actual number
  const testNumbers = ['1234567890', '0987654321']; // Replace with actual numbers
  
  // ============================================
  // 1. SEND TEXT MESSAGE
  // ============================================
  console.log('Example 1: Sending text message...');
  await agent.sendMessage(testNumber, 'Hello from WhatsApp Agent! 👋');
  
  // ============================================
  // 2. SEND IMAGE
  // ============================================
  console.log('Example 2: Sending image...');
  // await agent.sendImage(testNumber, './path/to/image.jpg', 'Check out this image!');
  
  // ============================================
  // 3. SEND IMAGE FROM URL
  // ============================================
  console.log('Example 3: Sending image from URL...');
  // await agent.sendMediaFromUrl(testNumber, 'https://example.com/image.jpg', 'Image from URL');
  
  // ============================================
  // 4. SEND DOCUMENT
  // ============================================
  console.log('Example 4: Sending document...');
  // await agent.sendDocument(testNumber, './path/to/document.pdf', 'Important document');
  
  // ============================================
  // 5. BROADCAST MESSAGE TO MULTIPLE CONTACTS
  // ============================================
  console.log('Example 5: Broadcasting message...');
  // await agent.broadcast(testNumbers, 'This is a broadcast message!', 2000); // 2 second delay
  
  // ============================================
  // 6. BROADCAST IMAGE TO MULTIPLE CONTACTS
  // ============================================
  console.log('Example 6: Broadcasting image...');
  // await agent.broadcastImage(testNumbers, './path/to/image.jpg', 'Broadcast image!', 2000);
  
  // ============================================
  // 7. SEND LOCATION
  // ============================================
  console.log('Example 7: Sending location...');
  // await agent.sendLocation(testNumber, 28.6139, 77.2090, 'New Delhi, India');
  
  // ============================================
  // 8. SEND CONTACT CARD
  // ============================================
  console.log('Example 8: Sending contact card...');
  // await agent.sendContact(testNumber, '1234567890', 'John Doe');
  
  // ============================================
  // 9. CREATE GROUP
  // ============================================
  console.log('Example 9: Creating group...');
  // const group = await agent.createGroup('My Test Group', testNumbers);
  // console.log('Group created:', group);
  
  // ============================================
  // 10. GET ALL CHATS
  // ============================================
  console.log('Example 10: Getting all chats...');
  const chats = await agent.getChats();
  console.log(`Found ${chats.length} chats`);
  
  // ============================================
  // 11. GET ALL CONTACTS
  // ============================================
  console.log('Example 11: Getting all contacts...');
  const contacts = await agent.getContacts();
  console.log(`Found ${contacts.length} contacts`);
  
  // ============================================
  // 12. CHECK IF NUMBER IS REGISTERED
  // ============================================
  console.log('Example 12: Checking if number is registered...');
  const isRegistered = await agent.isRegisteredUser(testNumber);
  console.log(`${testNumber} is ${isRegistered ? 'registered' : 'not registered'} on WhatsApp`);
  
  // ============================================
  // 13. GET PROFILE PICTURE URL
  // ============================================
  console.log('Example 13: Getting profile picture...');
  const profilePic = await agent.getProfilePicUrl(testNumber);
  console.log(`Profile picture URL:`, profilePic);
  
  // ============================================
  // 14. RECEIVE MESSAGES - Setup Handler
  // ============================================
  console.log('Example 14: Setting up message handler...');
  agent.onMessage(async (message, contact) => {
    console.log(`📨 Message from ${contact.pushname || contact.number}: ${message.body}`);
    
    // Example: Auto-reply to "hello"
    if (message.body.toLowerCase() === 'hello') {
      await message.reply('Hi there! 👋 How can I help you?');
    }
    
    // Example: Handle commands
    if (message.body.startsWith('/')) {
      const command = message.body.substring(1).toLowerCase();
      
      switch (command) {
        case 'help':
          await message.reply('Available commands:\n/help - Show this message\n/info - Get bot info\n/ping - Check if bot is alive');
          break;
        case 'info':
          await message.reply('WhatsApp Agent v1.0\nRunning and ready! ✅');
          break;
        case 'ping':
          await message.reply('Pong! 🏓');
          break;
        default:
          await message.reply('Unknown command. Type /help for available commands.');
      }
    }
    
    // Example: Download media from received messages
    if (message.hasMedia) {
      console.log('Message has media, downloading...');
      const media = await message.downloadMedia();
      console.log('Media downloaded:', media.mimetype);
      // You can save the media: fs.writeFileSync(`./downloads/${Date.now()}.${media.mimetype.split('/')[1]}`, media.data, 'base64');
    }
  });
  
  console.log('\n✅ Examples setup complete!');
  console.log('📱 The agent is now listening for messages...');
  console.log('💡 Try sending messages to your WhatsApp number to test the message handler!\n');
  
  // Keep the script running
  console.log('Press Ctrl+C to exit\n');
}

// Run examples
examples().catch(console.error);

