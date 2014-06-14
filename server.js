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
