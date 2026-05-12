const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const connect = require('./config/database-config.js')
const Chat = require('./models/chat.js');
const { ConnectionStates } = require('mongoose');

const app = express();
const server = createServer(app);
const io = new Server(server);



app.set('view engine','ejs');
app.use('/',express.static(__dirname + '/public'));
app.get('/chat/:roomId',async(req,res) =>{
  const chats = await Chat.find({roomId:req.params.roomId});
  res.render('index',{
    name:'Abhay',
    id:req.params.roomId,
    chats:chats
  });
})

io.on('connection', (socket) => {
  
   socket.on('join_room',(data) =>{
    console.log(data);
    socket.join(data.roomid)
      console.log('join one to one');
  })

  socket.on('msg_send',async (data)=>{
    // io.emit('msg_recieved',data) //to all connected to the socket
    // socket.emit('msg_recieved',data) // to the socket who sends the event
    // socket.broadcast.emit('msg_recieved',data) //all other than sender 
    console.log(data);
    const chat = await Chat.create({
      content:data.msg,
      user:data.username,
      roomId:data.roomid
    })


    io.to(data.roomid).emit('msg_rcvd',data);
    
  })


  socket.on('typing',(data)=>{
    socket.broadcast.to(data.roomid).emit('someone_typing',data);
  })

 


});


server.listen(3000,async ()=>{
    console.log(`Server started at port:3000`);
    await connect();
    console.log("Mongodb connected")
})