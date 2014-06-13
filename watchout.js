var width = 700;
var height = 450;
var numEnemies = 35;

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
    .attr('r', function(d) { return d.r; })
    .attr('fill', function(d) { return d.color; });
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

  svg.selectAll('circle.enemy')
    .data(this.data)
    .enter()
    .append('circle')
    .attr('class', 'enemy')
    .attr('r', function(d) {
      return d.r;
    });
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
  this.updateData();
  svg.selectAll('circle.enemy')
    .data(this.data)
    .transition()
    .duration(1500)
    .attr('cx', function(d) {
      return d.x;
    })
    .attr('cy', function(d) {
      return d.y;
    });
};

var enemies = new Enemies();

setInterval(enemies.reposition.bind(enemies), 2000);




