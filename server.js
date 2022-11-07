const express = require('express');
const app = express();
const http = require('http');
const { SocketAddress } = require('net');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let displayValue = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  function sendResponse(){
    socket.broadcast.emit('response', displayValue);
    socket.emit('response', displayValue);
  }

  socket.emit('response', displayValue);

  socket.on('add', (data)=>{
    displayValue += parseFloat(data);
    sendResponse();
  });
  
  socket.on('sub', (data)=>{
    displayValue -= parseFloat(data);
    sendResponse();
  });
  
  socket.on('mul', (data)=>{
    displayValue *= parseFloat(data);
    sendResponse();
  });
  
  socket.on('div', (data)=>{
    if (parseFloat(data)!=0){
      displayValue /= parseFloat(data);
    }
    sendResponse();
  });

  socket.on('CLS', ()=>{
    displayValue = 0;
    sendResponse();
  })
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});

