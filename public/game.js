let whackerScore = 0;
let moleScore = 0;
let activeMoles = 0;
const maxMoles = 2;

const ws = new WebSocket('ws://localhost:3000');

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
  const holes = document.querySelectorAll('.hole');
  holes.forEach((hole, index) => {
    hole.classList.toggle('mole', gameState.molePositions[index]);
  });

  document.getElementById('whackerScore').textContent = `Whacker: ${gameState.whackerScore}`;
  document.getElementById('moleScore').textContent = `Mole: ${gameState.moleScore}`;
}

function startTimer(duration, display) {
  let timer = duration, seconds;
  setInterval(function () {
    seconds = parseInt(timer % 60, 10);
    display.textContent = seconds;

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
}

window.onload = function () {
  let thirtySeconds = 30,
      display = document.getElementById('timer');
  startTimer(thirtySeconds, display);
};
