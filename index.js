const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);


app.use('/',express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  setInterval(() =>{
    socket.emit('from_server')
  },2000)

  socket.on('from_client',()=>{
    console.log("Event coming from client")
  })
});


server.listen(3000,()=>{
    console.log(`Server started at port:3000`)
})