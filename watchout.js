// start slingin' some d3 here.

var width = 700;
var height = 450;
var numEnemies = 50;

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height',height);

var enemies = [];

for (var i = 0; i < numEnemies; i++) {
  enemies.push({
    x: Math.floor(width*Math.random()),
    y: Math.floor(height*Math.random()),
    r: 10
  });
}


svg.selectAll('circle.enemy').data(enemies)
  .enter()
  .append('circle')
  .attr('cx', function (d) {
    return d.x;
  })
  .attr('cy', function (d) {
    return d.y;
  })
  .attr('r', function (d) {
    return d.r;
  });
