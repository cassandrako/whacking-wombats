const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const WebSocket = require('ws');

const port = new SerialPort('COM5', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));
const ws = new WebSocket('ws://localhost:3000');

parser.on('data', data => {
    console.log("Received from Arduino:", data.trim());
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(data.trim()); 
        console.log("Sent to WebSocket:", data.trim()); 
    }
});

ws.on('open', () => console.log('Connected to WebSocket server'));
