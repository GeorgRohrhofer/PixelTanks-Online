var socket = io();
socket.on('message', function(data){
    console.log(data);
});

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

document.addEventListener('close', function(event){
    socket.emit('disconnect');
});

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

    if (players == null){
        console.log('HE Behinderter! Es geht scho wieder nix... Floschn.');
        players?.sort((a, b) => (parseFloat(a.points) > parseFloat(b.points)));
    } else {
        console.log('Ui, hast du auch mal was hinbekommen? Aso Nein, das war - mal wieder - Leistung vom Georg');
        players?.sort((a, b) => (parseFloat(a.points) > parseFloat(b.points)));
    }

    for (var id in players) {
        var player = players[id];
        context.fillStyle = player.color;
        context.beginPath();
        context.rect(player.x, player.y, 80, 60);
        context.fill();

        context.fillStyle = player.color;
        context.lineWidth = 5;
        context.strokeStyle = player.color;
        context.beginPath();
        context.arc(player.canonx, player.canony, 50, 0, 2*Math.PI);
        context.stroke();
        context.beginPath();
        context.rect(player.canonx - 5, player.canony + 40, 10, 10);
        context.rect(player.canonx - 5, player.canony - 50, 10, 10);
        context.rect(player.canonx + 40, player.canony -5, 10, 10);
        context.rect(player.canonx - 50, player.canony -5, 10, 10);
        context.fill();

        context.beginPath();
        if(player.fire){
            context.fillStyle = "orange";
            context.arc(player.canonx, player.canony, 10,0,2*Math.PI);
            context.fill();
            context.fillStyle = player.color;
            console.log("BOOM");
        }
        
        movement.shooting = false;

        context.fillStyle = 'White';
        context.font = "20px Georgia";
        context.fillText(player.name, player.x, player.y+80);

        var li = document.createElement('li');
        li.appendChild(document.createTextNode(player.name + " - " + player.points));

        div.appendChild(li);
                    
    }
});