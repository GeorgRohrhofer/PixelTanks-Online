var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
const { isBooleanObject } = require('util/types');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var playername = "";

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

app.get('/join/:Name', function(request, response){
    if(request.params.Name != "favicon.ico")
        playername = request.params.Name;
    console.log(request.params.Name);
    response.sendFile(path.join(__dirname, 'index.html'));
})

server.listen(5000, function(){
    console.log('Starting server on Port 5000');
});

/*
setInterval(function(){
    io.sockets.emit('message', 'hi');
}, 1000);
*/

var players = {};
io.on('connection', function(socket){
    socket.on('new player', function(){
        result = Math.floor(Math.random()*10);
        switch(result){
            case 0:
                col = 'darkgreen';
                break;
            case 1:
                col = 'white';
                break;
            case 2:
                col = 'beige';
                break;
            case 3:
                col = 'darkblue';
                break;   
            case 4:
                col = 'blue';
                break;
            case 5:
                col = 'lightblue';
                break;
            case 6:
                col = 'red';
                break;
            case 7:
                col = 'pink';
                break; 
            case 8:
                col = 'black';
                break;
            case 9:
                col = 'grey';
                break;
        }

        players[socket.id] = {
            x : 300,
            y : 300,
            color: col,
            name: playername,
            canonx: 300,
            canony: 300
        };
    });
    socket.on('movement', function(data){
        var player = players[socket.id] || {};
        if(data.left){
            player.x -= 5;
        }
        if(data.up){
            player.y -= 5;
        }
        if(data.right){
            player.x += 5;
        }
        if(data.down){
            player.y += 5;
        }

        if(data.canonleft){
            player.canonx -= 5;
        }
        if(data.canonup){
            player.canony -= 5;
        }
        if(data.canonright){
            player.canonx += 5;
        }
        if(data.canondown){
            player.canony += 5;
        }
    });
    io.on('disconnect', function(){
        delete players[socket.id];
    });

    io.
});



setInterval(function(){
    io.sockets.emit('state', players);
}, 1000/60);