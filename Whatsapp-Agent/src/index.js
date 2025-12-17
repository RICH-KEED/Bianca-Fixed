import WhatsAppAgent from './WhatsAppAgent.js';
import WhatsAppAPI from './api.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  console.log('🚀 WhatsApp Agent Starting...\n');
  
  // Create WhatsApp agent instance
  const agent = new WhatsAppAgent();
  
  // Setup message handler to log received messages
  agent.onMessage(async (message, contact) => {
    // Example: Auto-reply to specific messages
    // Uncomment to enable auto-reply
    /*
    if (message.body.toLowerCase() === 'ping') {
      await message.reply('pong! 🏓');
    }
    */
    
    // You can add your custom logic here
    // For example: Save to database, trigger webhooks, etc.
  });
  
  // Start WhatsApp client
  await agent.start();
  
  // Wait for client to be ready
  console.log('⏳ Waiting for WhatsApp to be ready...');
  await agent.waitForReady();
  
  // Create and start API server
  const api = new WhatsAppAPI(agent);
  await api.start(PORT);
  
  console.log('\n✅ WhatsApp Agent is fully operational!\n');
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down gracefully...');
    await api.stop();
    await agent.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n\n🛑 Shutting down gracefully...');
    await api.stop();
    await agent.stop();
    process.exit(0);
  });
}

// Run the application
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

