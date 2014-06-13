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
var update = function(){
  updateEnemiesData();

  svg.selectAll('circle')
    .data(enemies)
    .transition()
    .duration(800)
    .attr('cx', function (d) {
      return d.x;
    })
    .attr('cy', function (d) {
      return d.y;
    })
    .attr('r', function (d) {
      return d.r;
    });
};


updateEnemiesData();
svg.selectAll('circle')
  .data(enemies)
  .enter()
  .append('circle');
update();


setInterval(update, 2000);




