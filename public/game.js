const ws = new WebSocket('ws://localhost:3000');
app.use(express.static('public'));

ws.onopen = () => {
  console.log('Connected to the server');
};

ws.onmessage = (event) => {
  console.log('Message from server:', event.data);
  const message = JSON.parse(event.data);
  if (message.type === 'update') {
    updateGameBoard(message.gameState);
  }
};

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const moleKeys = ['1', '2', '3', '4', '5', '6'];
  const whackerKeys = ['a', 's', 'd', 'f', 'g', 'h'];
  let holeIndex = moleKeys.indexOf(key);
  let action = holeIndex !== -1 ? 'pop' : 'whack';
  holeIndex = holeIndex === -1 ? whackerKeys.indexOf(key) : holeIndex;

  if (holeIndex !== -1) {
    const message = JSON.stringify({
      role: action === 'pop' ? 'mole' : 'whacker',
      action: action,
      hole: holeIndex
    });
    console.log('Sending message:', message);
    ws.send(message);
  }
});

function updateGameBoard(gameState) {
  console.log('Updating game board:', gameState);
  const holes = document.querySelectorAll('.hole');
  holes.forEach((hole, index) => {
    if (gameState.molePositions[index]) {
      hole.classList.add('mole');
    } else {
      hole.classList.remove('mole');
    }
  });
}