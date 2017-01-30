/////////////////GLOBAL VARIABLES
var wallArray = []

///////////////FUNCTIONS
var Room = {
  generate: function() {
    wallArray = [];
    createWalls(3);
  }
}

function Wall(xPos,yPos,width,height) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = width;
  this.height = height;
}

function randomNumber(min,max) {
  return Math.floor(Math.random()*(max-min)+min);
};

function randomNumberGrid(min,max) {
  return randomNumber(min,max)*20;
}

function createWalls(numberOfWalls) {
  for (var i = 1; i<=numberOfWalls; i++) {
    var randomWidth = randomNumberGrid(1,10);
    var randomHeight = randomNumberGrid(1,10);
    var randomXPosition = randomNumberGrid(0,30-(randomWidth/20));
    var randomYPosition = randomNumberGrid(0,30-(randomHeight/20));
    wallArray.push(new Wall(randomXPosition, randomYPosition,randomWidth,randomHeight));
  };
};


////////////////DOCUMENT READY
$(function(){
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var x = canvas.width/2;
  var y = canvas.height-30;
  var dx = 2;
  var dy = -2;
  var ballRadius = 10;
  createWalls(3);



  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };


  function drawWalls() {
    for (var i=0; i< wallArray.length; i++) {
      var currentWall = wallArray[i];
      drawWall(currentWall.xPos, currentWall.yPos, currentWall.width, currentWall.height);
    };
  };

  function drawWall(xPos,yPos,width,height) {
    ctx.beginPath();
    ctx.rect(xPos,yPos,width,height);
    ctx.fillStroke = "black";
    ctx.stroke();
    ctx.closePath();
  };


/////////////////DRAW FUNCITON
  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawWalls();
      x += dx;
      y += dy;

      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
          dx = -dx;
      };
      if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
          dy = -dy;
      };


  };

  setInterval(draw, 10);

  $("#generateButton").click(function() {
    Room.generate();
  });

});
