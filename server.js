const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require('axios');

let displayValue = 0;
let public_ip;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  function sendResponse(){
    socket.broadcast.emit('response', displayValue);
    socket.emit('response', displayValue);
  }

  socket.emit('response', displayValue);
  socket.emit('server_ip', public_ip);

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

server.listen(3024, () => {
  console.log(`Listening on port 3024`);

  (async () => {
    const url = 'https://checkip.amazonaws.com/';
    const response = await axios(url);
    public_ip = response.data.trim();
  })();
});
