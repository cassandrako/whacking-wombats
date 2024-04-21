const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// "COM3" for windows, const port = new SerialPort('/dev/tty.usbmodem14101', { baudRate: 9600 }); if mac
const port = new SerialPort('COM3', { baudRate: 9600 });

const parser = port.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', data => {
    console.log('Button pressed on pin:', data.trim());
    // Broadcast the button press to all connected WebSocket clients
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'buttonPress', pin: data.trim() }));
        }
    });
});

