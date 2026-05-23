const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const messageHistory = [];

wss.on('connection', (ws, req) => {
  // Get the real IP passed from Nginx
  const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`New client connected from ${userIP}`);
  
  messageHistory.forEach((pastMessage) => ws.send(pastMessage));

  ws.on('message', (message) => {
    const textMessage = message.toString();
    const formattedMessage = `[${userIP}]: ${textMessage}`;
    
    messageHistory.push(formattedMessage);
    if (messageHistory.length > 10) messageHistory.shift();
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(formattedMessage);
      }
    });
  });
});

console.log('WebSocket server running on port 8080');
