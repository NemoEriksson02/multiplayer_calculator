const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require('axios');

let displayValue = 0;
let public_ip;

app.use(favicon(__dirname + '/img/icon.ico'));

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
    socket.on('clear', ()=>{
      displayValue = 0;
      sendResponse();
    })

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
