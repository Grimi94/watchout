var socket = io('http://localhost:3141');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});


var width = 700;
var height = 450;
var numEnemies = 35;

// var highScore = 0;
var currentScore = 0;
// var collisions = 0;

socket.on('restart', function (data) {
  console.log('Restart');
  currentScore = 0;
  d3.select('.current span').text(currentScore);
});

socket.on('currentScore', function (data) {
  currentScore = data.currentScore;
  console.log(currentScore);
  d3.select('.current span').text(currentScore);
});

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

// Player class
var Player = function(){
  this.data = {
    x: Math.floor(width/2),
    y: Math.floor(height/2),
    r: 10,
    color: 'blue'
  };
  svg.selectAll('circle.player')
    .data([this.data])
    .enter()
    .append('circle')
    .call(this.getOnDrag())
    .attr('class', 'player')
    .attr('r', function(d) { return d.r; });
  this.move(width/2, height/2);
};

Player.prototype.getOnDrag = function() {
  return d3.behavior.drag()
  .on('drag', function() {
    var newX = this.data.x + d3.event.dx;
    var newY = this.data.y + d3.event.dy;
    if(0 < newX && newX < width && 0 < newY && newY < height){
      this.move(newX, newY);
    }
  }.bind(this));
};

Player.prototype.move = function (x, y) {
  this.data.x = x;
  this.data.y = y;
  svg.selectAll('circle.player')
    .data([this.data])
    .attr('cx', function(d) { return d.x;})
    .attr('cy', function(d) { return d.y;});
};

var player = new Player();

// Enemies: An object of Enemies handles all enemies (black dots).
var Enemies = function () {
  this.data = [];
  this.updateData();
  this.alreadyCollided = false;
  svg.selectAll('image.enemy')
    .data(this.data)
    .enter()
    .append('image')
    .attr('height', 20)
    .attr('width', 20)
    .attr('xlink:href', 'icon_20459.svg')
    .attr('class', 'enemy');
  this.reposition();
};

Enemies.prototype.updateData = function () {
  for (var i = 0; i < numEnemies; i++) {
    this.data[i] = {
      x: Math.floor(width*Math.random()),
      y: Math.floor(height*Math.random()),
      r: 10
    };
  }
};

Enemies.prototype.reposition = function () {
  var that = this;
  this.updateData();
  svg.selectAll('image.enemy')
    .data(this.data)
    .transition()
    .duration(2000)
    .tween('custom', function() {
      return function (t) {
        var enemy = d3.select(this);
        var enemyX = enemy.attr('x');
        var enemyY = enemy.attr('y');
        var enemyR = 20;
        var localPlayer = d3.selectAll('circle.player');
        var localPlayerX = localPlayer.attr('cx');
        var localPlayerY = localPlayer.attr('cy');
        var localPlayerR = 10;
        var distance = Math.sqrt(Math.pow(enemyY - localPlayerY,2) +
                                  Math.pow(enemyX - localPlayerX,2));

        if (!that.alreadyCollided && distance <= (parseInt(enemyR) + parseInt(localPlayerR))) {
          that.alreadyCollided = true;
          // if (currentScore > highScore) {
          //   highScore = currentScore;
          // }
          // d3.select('.high span').text(highScore);
          // currentScore = 0;
          // d3.select('.current span').text(currentScore);
          // collisions++;
          // d3.select('.collisions span').text(collisions);
          socket.emit('restart');
        }

        if (t === 1) {
          that.alreadyCollided = false;
        }

      }.bind(this);
    })
    .attr('x', function(d) {
      return d.x;
    })
    .attr('y', function(d) {
      return d.y;
    });
};

var enemies = new Enemies();

setInterval(enemies.reposition.bind(enemies), 2000);

setInterval(function () {
  currentScore++;
  d3.select('.current span').text(currentScore);
}, 50);
