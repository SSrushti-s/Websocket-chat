import express from 'express'; 
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
  const data = JSON.parse(message.toString());

    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
        client.send(JSON.stringify(data));
        }
    });
    });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('WebSocket server is running');
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});