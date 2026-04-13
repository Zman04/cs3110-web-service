const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Message event handler
  ws.on('message', (message) => {
    // Convert the message buffer to a string so it displays correctly
    const textMessage = message.toString();
    console.log(`Received: ${textMessage}`);
    
    // Loop through all connected clients and broadcast
    wss.clients.forEach((client) => {
      // Check if the connection is fully open before trying to send
      if (client.readyState === WebSocket.OPEN) {
        client.send(textMessage);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});