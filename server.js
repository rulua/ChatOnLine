var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
users=[];
connections=[];
server.listen(process.env.PORT || 3000);
console.log('Server running...');
app.get('/',function(request,response){
  response.sendFile(__dirname+'/index.html')
});


io.sockets.on('connection',function(socket){
  connections.push(socket);
  users.push(socket.username);
  console.log('connection: %s sockets connected',connections.length)

  //disconnection
  socket.on('disconnect',function(data){
    users.splice(users.indexOf(socket),1);
    updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('disconnection: %s scokets connected',connections.length)
  });
  //send message
  socket.on('send message',function(data){
    console.log(data);
    io.emit('new message',{msg: data,user: socket.username});
  });

  socket.on('new user',function(data,callback){
    callback(true);
    socket.username=data;
    users.push(socket.username);
  //  alert("name+"socket.username);
    updateUsernames(users);
  });

  function updateUsernames(users){
    io.emit('get users',users);
  }
});
