import express from 'express';
import http from 'http';
import { setupWebSocket } from './utils/websocket.js';

const app = express();
const server = http.createServer(app);

// Set up WebSocket on the same server
setupWebSocket(server);

// Define your API routes here
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Start the server on port 8000
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
