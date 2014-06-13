var width = 700;
var height = 450;
var numEnemies = 35;

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

var enemies = [];

var updateEnemiesData = function () {
  for (var i = 0; i < numEnemies; i++) {
    enemies[i] = {
      x: Math.floor(width*Math.random()),
      y: Math.floor(height*Math.random()),
      r: 10
    };
  }
};

var playerData = {
  x: Math.floor(width/2),
  y: Math.floor(height/2),
  r: 10,
  color: 'blue'
};

var update = function() {
  updateEnemiesData();
  svg.selectAll('circle.enemy')
    .data(enemies)
    .transition()
    .duration(1500)
    .attr('cx', function(d) {
      return d.x;
    })
    .attr('cy', function(d) {
      return d.y;
    });
};


updateEnemiesData();
svg.selectAll('circle.enemy')
  .data(enemies)
  .enter()
  .append('circle')
  .attr('class', 'enemy')
  .attr('r', function(d) {
    return d.r;
  });

var drag = d3.behavior.drag()
  .on('drag', function() {
    movePlayer(playerData.x + d3.event.dx, playerData.y + d3.event.dy);
  });

var movePlayer = function (x, y) {
  playerData.x = x;
  playerData.y = y;
  svg.selectAll('circle.player')
    .data([playerData])
    .attr('cx', function(d) { return d.x;})
    .attr('cy', function(d) { return d.y;});
};

svg.selectAll('circle.player')
  .data([playerData])
  .enter()
  .append('circle')
  .call(drag)
  .attr('class', 'player')
  .attr('r', function(d) { return d.r; })
  .attr('fill', function(d) { return d.color; });

movePlayer(width/2, height/2);

update();


setInterval(update, 2000);




