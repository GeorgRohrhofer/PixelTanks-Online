var socket = io();
socket.on('message', function(data){
    console.log(data);
});

var imageLoaded = false;
var img = new Image();

var movement = {
    up: false,
    down: false,
    left: false,
    right: false,
    canonup: false,
    canondown: false,
    canonleft: false,
    canonright: false,
    shooting: false,
}

var cr = 'rgb('+
      Math.floor(Math.random()*256)+','+
      Math.floor(Math.random()*256)+','+
      Math.floor(Math.random()*256)+')';

function LoadImage(src){
    img.src = src
}

document.addEventListener('keydown', function(event){
    //console.log(event.key);
    switch(event.key){
        case "a":
            movement.left = true;
            break;
        case "w":
            movement.up = true;
            break;
        case "d":
            movement.right = true;
            break;
        case "s":
            movement.down = true;
            break;
        case "ArrowLeft":
            movement.canonleft = true;
            break;
        case "ArrowUp":
            movement.canonup = true;
            break;
        case "ArrowRight":
            movement.canonright = true;
            break;
        case "ArrowDown":
            movement.canondown = true;
            break;
        case " ":
            movement.shooting = true;
            break;
    }
});

$(window).on("beforeunload", function() { 
    socket.emit("my_disconnect");
})

document.addEventListener('keyup', function(event){
    switch(event.key){
        case "a":
            movement.left = false;
            break;
        case "w":
            movement.up = false;
            break;
        case "d":
            movement.right = false;
            break;
        case "s":
            movement.down = false;
            break;
        case "ArrowLeft":
            movement.canonleft = false;
            break;
        case "ArrowUp":
            movement.canonup = false;
            break;
        case "ArrowRight":
            movement.canonright = false;
            break;
        case "ArrowDown":
            movement.canondown = false;
            break;
        case " ":
            movement.shooting = false;
            break;
    }
});

socket.emit('new player');

setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 1920;
canvas.height = 1080;
var context = canvas.getContext('2d');

socket.on('state', function(players){
    var div = document.getElementById('Leaderboard');
    div.innerHTML = '';
    context.clearRect(0, 0, 1920, 1080);

    //var player_array = [].slice.call(players).sort((a, b) => (parseFloat(a.points) > parseFloat(b.points)));

    //var resultArray = $.map(players, function(value, index) { return [value]; });
    //resultArray.sort().reverse();
    //console.log(resultArray);

    //console.log(players.length);

    for (var id in players) {
        //console.log("player");
        var player = players[id];
        
        context.fillStyle = player.color;

        //Fallback if Tanks are unable to Load
        context.beginPath();
        context.rect(player.x, player.y, 80, 60);
        context.fill();

        context.beginPath();
        if(player.image != null){
            LoadImage("../" + player.image)
            context.drawImage(img, player.x, player.y, 80,60);
        }
            
        context.fill();
        context.fillStyle = player.color;
        context.lineWidth = 5;
        context.strokeStyle = player.color;

        //crosshair
        context.beginPath();
        context.arc(player.canonx, player.canony, 50, 0, 2*Math.PI);
        context.stroke();

        context.beginPath();
        context.arc(player.canonx, player.canony, 40, 0, 2*Math.PI);
        context.stroke();

        context.beginPath();
        context.rect(player.canonx - 3, player.canony + 30, 6, 30);
        context.rect(player.canonx - 3, player.canony - 60, 6, 30);
        context.rect(player.canonx + 30, player.canony -3, 30, 6);
        context.rect(player.canonx - 60, player.canony -3, 30, 6);
        context.fill();

        context.beginPath();
        context.arc(player.canonx, player.canony, 5, 0, 2*Math.PI);
        context.fill();

        context.beginPath();
        if(player.fire){
            context.fillStyle = "orange";
            context.arc(player.canonx, player.canony, 10,0,2*Math.PI);
            context.fill();
            context.fillStyle = player.color;
            console.log("BOOM");

            for (var id2 in players) {
                var pl2 = players[id2];
                console.log(pl2.name);
                if(player.canonx > pl2.x && player.canonx < pl2.x+80 && player.canony > pl2.y && player.canony < pl2.y+60){
                    socket.emit('hit');
                    console.log("HELp");
                    socket.emit('got_hit', id2);
                }
            }
        }
        
        movement.shooting = false;

        context.fillStyle = 'White';
        context.font = "20px Georgia";
        context.fillText(player.name, player.x, player.y+80);

                    
    }
    /*
    console.log(players);

    var resultArray = players || {};
    resultArray.sort((a, b) => (parseFloat(a.points) > parseFloat(b.points)));

    for (var id in resultArray) {
        var player = resultArray[id];
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(player.name + " - " + player.points));

        div.appendChild(li);
    }
    */
});