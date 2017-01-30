$(function(){
//player controller
  var leftPressed = false;
  var upPressed = false;
  var rightPressed = false;
  var downPressed = false;

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(e) {
    if(e.keyCode === 39) {
      rightPressed = true;
      console.log(rightPressed)
    } else if (e.keyCode === 38) {
      downPressed = true;
    } else if(e.keyCode === 37) {
      leftPressed = true;
    } else if(e.keyCode === 40) {
      upPressed = true;
    }
  }

  function keyUpHandler(e) {
    if(e.keyCode === 39) {
      rightPressed = false;
      console.log(rightPressed)
    } else if (e.keyCode === 38) {
      downPressed = false;
    } else if(e.keyCode === 37) {
      leftPressed = false;
    } else if(e.keyCode === 40) {
      upPressed = false;
    }
  }

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var x = canvas.width/2;
  var y = canvas.height-30;
  var dx = 2;
  var dy = -2;

  var ballRadius = 10;


  function randomNumber(min,max) {
    return Math.random()*(max-min)+min;
  }

  function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI*2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
  }

  function drawWalls(x) {

  }

  function drawWall(x,y,width,height) {
    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.fillStroke = "black";
    ctx.stroke();
    ctx.closePath();
  }


  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawWall(200,200,100,100);
      drawWall(500,400,50,50);
      drawWall(400,100,100,25);
      x += dx;
      y += dy;

      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
          dx = -dx;
      }
      if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
          dy = -dy;
      }


  }

  setInterval(draw, 10);



});
