var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var playername = "";
var cooldown = 0;

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, 'lobby.html'));
})


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
            canony: 300,
            fire: false,
            points : 0,
            image: "tank_red.png"
        };
    });
    socket.on('movement', function(data){
        var player = players[socket.id] || {};
        if(data.left){
            if(player.x > 0)
                player.x -= 5;
        }
        if(data.up){
            if(player.y > 0)
                player.y -= 5;
        }
        if(data.right){
            if(player.x < 1840)
                player.x += 5;
        }
        if(data.down){
            if(player.y < 1020)
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

        if(data.shooting == true){
            player.fire = true;
        }
        if(data.shooting == false){
            player.fire = false;
        }
    });
    io.on('disconnect', function(){
        delete players[socket.id];
    });

    io.on('hit', function(playerid){
        players[playerid].points += 1;
        console.log(players[playerid].points);
    })

    io.on('got_hit', function(playerid){
        players[playerid].points = 0;
        console.log(players[playerid].points);
    })
});



setInterval(function(){
    io.sockets.emit('state', players);
}, 1000/60);