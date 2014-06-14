var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3141);

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


var currentScore = 0;

setInterval(function () {
  currentScore++;
}, 50);


var data = [];
setInterval(function () {
  for (var i = 0; i < 35; i++) {
    data[i] = {
      x: Math.floor(700*Math.random()),
      y: Math.floor(450*Math.random()),
      r: 10
    };
  }
  io.sockets.emit('updateData', { positions: data });
}, 2000);

io.on('connection', function (socket) {
  socket.join('collider');

  currentScore = 0;
  socket.to('collider').emit('restart');

  socket.on('restart', function (data) {

    currentScore = 0;
    socket.to('collider').emit('restart');
    socket.emit('restart');

  });

  setInterval(function () {
    socket.to('collider').emit('currentScore', {
      currentScore: currentScore
    });
  }, 500);


});
