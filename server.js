var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3000, function(){
      console.log('listening on *:3000');
});

app.get('/', function(req, res){
    res.sendFile(__dirname+'/client.html');
});

var clientList = {};
var msgList = {};

io.sockets.on('connection', function(client){

    client.on('subscribe', function(room) { 
        console.log('joining room', room);
        client.join(room);

        if (!clientList.hasOwnProperty(room)) {
            clientList[room] = [];
        }

        clientList[room].push(client.id);

        console.log(clientList)

        if (msgList.hasOwnProperty(room)) {
            // send previous message
            io.sockets.in(room).emit('prvMessage', {room: room, messages: msgList[room]});
        }
        
    })
    
    client.on('unsubscribe', function(room) {  
        console.log('leaving room', room);
        client.leave(room); 
    })

    client.on('send', function(data) {
        console.log('sending message');
        //console.log(client.id);
        io.sockets.in(data.room).emit('message', data);

        if (!msgList.hasOwnProperty(data.room)) {
            msgList[data.room] = [];
        }

        msgList[data.room].push(data.message);

        console.log(msgList);
    });
});