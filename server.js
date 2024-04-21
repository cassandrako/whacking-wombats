const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = {
  molePositions: [false, false, false, false, false, false],
  score: 0,
};

app.use(express.static('public'));

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Message received on server:', message);12
    const { role, action, hole } = JSON.parse(message);

    if (role === 'mole' && action === 'pop') {
      if (!gameState.molePositions[hole]) {
        gameState.molePositions[hole] = true;
        broadcastGameState();
        setTimeout(() => {
          gameState.molePositions[hole] = false;
          broadcastGameState();
        }, 400); // how long it stays up -- also build a cooldown so wombat cannot spam buttons
      }
    } else if (role === 'whacker' && action === 'whack') {
      if (gameState.molePositions[hole]) {
        gameState.score++;
        gameState.molePositions[hole] = false;
        broadcastGameState();
      }
    }
  });
});

function broadcastGameState() {
  const state = JSON.stringify({ type: 'update', gameState });
  console.log('Broadcasting game state:', state);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(state);
    }
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));