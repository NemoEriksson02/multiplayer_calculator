const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let displayValue = 0;
const port = 3024;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  function sendResponse(){
    socket.broadcast.emit('response', displayValue);
    socket.emit('response', displayValue);
  }

  socket.emit('response', displayValue);

  socket.on('update', (type, value)=>{
    switch(type){
      case 'add':
        displayValue += parseFloat(value);
        break;
      case 'sub':
        displayValue -= parseFloat(value);
        break;
      case 'div':
        if (value != 0){
          displayValue /= parseFloat(value);
        }
        break;
      case 'mul':
        displayValue *= parseFloat(value);
        break;
      case 'CLS':
        displayValue = 0;
        break;
    }

    sendResponse();
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

