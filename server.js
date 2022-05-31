var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var playername = "";

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname, 'lobby.html'));
})

app.get('/:name', function(request, response){
    response.sendFile(path.join(__dirname, request.params.name));
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
                image = 'tank_green.gif'
                break;
            case 1:
                col = 'white';
                image = 'tank_white.gif';
                break;
            case 2:
                col = 'beige';
                image = 'tank_yellow.gif';
                break;
            case 3:
                col = 'darkblue';
                image = 'tank_blue.gif';
                break;   
            case 4:
                col = 'darkviolet';
                image = 'tank_violett.gif';
                break;
            case 5:
                col = 'lightblue';
                image = 'tank_lightblue.gif';
                break;
            case 6:
                col = 'red';
                image = 'tank_red.gif';
                break;
            case 7:
                col = 'pink';
                image = 'tank_pink.gif';
                break; 
            case 8:
                col = 'orange';
                image = 'tank_orange.gif';
                break;
            case 9:
                col = 'grey';
                image = 'tank_grey.gif';
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
            image: image,
            cooldown : 0
        };
    });
    socket.on('movement', function(data){
        var player = players[socket.id] || {};
        player.cooldown -=1;
        if(data.left){
            if(player.x > 0)
                player.x -= 7;
        }
        if(data.up){
            if(player.y > 0)
                player.y -= 7;
        }
        if(data.right){
            if(player.x < 1840)
                player.x += 7;
        }
        if(data.down){
            if(player.y < 1020)
                player.y += 7;
        }

        if(data.canonleft){
            player.canonx -= 12;
        }
        if(data.canonup){
            player.canony -= 12;
        }
        if(data.canonright){
            player.canonx += 12;
        }
        if(data.canondown){
            player.canony += 12;
        }

        if(data.shooting == true){
            if(player.cooldown < 1){
                player.fire = true;
                player.cooldown = 60;
            }
        }
        if(data.shooting == false){
            player.fire = false;
        }
    });
    io.on('disconnect', function(){
        console.log("player deleted");
        players[socket.id] = null;
    });

    io.on('hit', function(pl2){
        var player = players[socket.id] || {};
        player.points += 1;
        console.log(player.points);
    })

    io.on('got_hit', function(){
        var player = players[socket.id] || {};
        player.points = 0;
    })
});



setInterval(function(){
    io.sockets.emit('state', players);
}, 1000/60);