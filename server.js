const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require('axios');
const path = require('path');

let displayValue = 0;
let public_ip;

app.use(favicon(__dirname + '/img/icon.ico'));
app.use("/", express.static(__dirname));

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

  socket.on('update', (data)=> {
    let val = data[0];
    let op = data[1];
    switch(op){
      case '+':
        displayValue += parseFloat(val);
        break;
      case '-':
        displayValue -= parseFloat(val);
        break;
      case '*':
        displayValue *= parseFloat(val);
        break;
      case '/':
        displayValue /= parseFloat(val);
        break;
      default:
        displayValue = val;
    }

    sendResponse();
  });

  socket.on('clear', ()=>{
    displayValue = 0;
    sendResponse();
  });

});

server.listen(3024, () => {
  (async () => {
    const url = 'https://checkip.amazonaws.com/';
    const response = await axios(url);
    public_ip = response.data.trim();
    
    console.log(`Host: ${public_ip}\nPort: 3024\nLink: ${public_ip}:3024`);
  })();
});
