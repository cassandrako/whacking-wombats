const SerialPort = require('serialport');

// List all available serial ports
SerialPort.list().then(ports => {
  ports.forEach(port => {
    console.log(`Port: ${port.path}`);
    console.log(`Manufacturer: ${port.manufacturer}`);
  });
}).catch(err => {
  console.error('Error listing ports:', err);
});

