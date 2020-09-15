var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3000, function(){
      console.log('listening on *:3000');
});

app.get('/', function(req, res){
    res.sendFile(__dirname+'/bid.html');
});

var clientList = {};
var bidList = {};

io.sockets.on('connection', function(client) {

    client.on('subscribe', function(room) { 

    });

    client.on('unsubscribe', function(room) {  
        console.log('leaving room', room);
        client.leave(room); 
    })

    client.on('bid', function(data) {
        //console.log(client.id);
        var room = data.room;
        var bidValue = parseFloat(data.bidValue);
        var latestBid = bidList[room].length;

        io.sockets.in(room).emit('latestBid', data);

        if (!msgList.hasOwnProperty(room)) {
            bidList[room] = [];
        }

        if (bidValue > bidList[room][latestBid]) {
            bidList[room].push(bidValue);
        }

        
        console.log(bidList);
    });

});