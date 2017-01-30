/////////////////GLOBAL VARIABLES
var wallArray = [];
var ballArray = [];
var points = 0;

var Door = {
  xPos:600,
  yPos:300,
  height:50,
  width:50
};

var OutDoor = {
  xPos: -45,
  yPos: 30,
  height: 50,
  width: 50
}


var player = {
  xPos: 10,
  yPos: 10,
  width: 30,
  height: 30
};



///////////////FUNCTIONS
var Room = {
  generate: function() {
    points += 1;
    $('#points').text(points);
    wallArray = [];
    createWalls(3);
    createDoor();
    if (player.xPos + player.width > 595) {
      player.xPos = 0;
      OutDoor.xPos = -45;
      OutDoor.yPos = player.yPos;
    } else if (player.xPos < 5) {
      player.xPos = 570;
      OutDoor.xPos = 595;
      OutDoor.yPos = player.yPos;
    } else if (player.yPos + player.height > 595) {
      player.yPos = 0;
      OutDoor.yPos = -45;
      OutDoor.xPos = player.xPos;
    } else if (player.yPos < 5) {
      player.yPos = 570;
      OutDoor.yPos = 595;
      OutDoor.xPos = player.xPos;
    }
  }
}

function Wall(xPos,yPos,width,height) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = width;
  this.height = height;
}

function Ball(xPos,yPos,width,height, dx, dy) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = width;
  this.height = height;
  this.dx = dx;
  this.dy = dy;
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
    var randomXPosition = randomNumberGrid(2,28-(randomWidth/20));
    var randomYPosition = randomNumberGrid(2,28-(randomHeight/20));
    wallArray.push(new Wall(randomXPosition, randomYPosition,randomWidth,randomHeight));
  };
};


function createDoor() {
  var randomXOrY = randomNumber(0,2);
  var randomMinOrMax = randomNumber(0,2);

  if (randomXOrY) {
    if (randomMinOrMax) {
      Door.xPos = -45;
      Door.yPos = randomNumberGrid(1, 29);
    } else {
      Door.xPos = 595;
      Door.yPos = randomNumberGrid(1, 29);
    }
  } else {
    if (randomMinOrMax) {
      Door.yPos = -45;
      Door.xPos = randomNumberGrid(1, 29);
    } else {
      Door.yPos = 595;
      Door.xPos = randomNumberGrid(1, 29);
    }
  }
}

function xCollisionDetection(player) {
  for (var i=0;i<wallArray.length;i++) {
    var currentWallX = wallArray[i].xPos;
    var currentWallY = wallArray[i].yPos;
    var currentWallWidth = wallArray[i].width;
    var currentWallHeight = wallArray[i].height;
    if ((player.xPos < 0 || player.xPos + player.width > 600) || (player.xPos + player.width > currentWallX && player.xPos < currentWallX + currentWallWidth)) {

      if (player.yPos + player.height > currentWallY && player.yPos < currentWallY + currentWallHeight) {
        return true;
      } else if (player.xPos < 0 || player.xPos + player.width > 600) {
        return true;
      }
    }
  }
}

function yCollisionDetection(player) {
  for (var i=0;i<wallArray.length;i++) {
    var currentWallX = wallArray[i].xPos;
    var currentWallY = wallArray[i].yPos;
    var currentWallWidth = wallArray[i].width;
    var currentWallHeight = wallArray[i].height;
    if ((player.yPos < 0 || player.yPos + player.height > 600) || (player.yPos + player.height > currentWallY && player.yPos < currentWallY + currentWallHeight)) {
      if (player.xPos + player.width > currentWallX && player.xPos < currentWallX + currentWallWidth) {
        return true;
      } else if (player.yPos < 0 || player.yPos + player.height > 600) {
        return true;
      }
    }
  }
}

function collisionDetection(player) {
  if (yCollisionDetection(player) || xCollisionDetection(player)) {
    return true;
  }
}

function doorCollision(player) {
  if ((player.xPos + player.width > Door.xPos && player.xPos < Door.xPos + Door.width) && (player.yPos + player.height > Door.yPos && player.yPos < Door.yPos + Door.height)) {
    console.log("collision");
    Room.generate();
  }
}



function createBall(numberOfBalls) {
  var dx = 2;
  var dy = -2
  for (var i = 1; i<=numberOfBalls; i++) {
    var randomBallWidth = randomNumberGrid(1,1);
    var randomBallHeight = randomNumberGrid(1,1);
    var randomBallX = randomNumberGrid(0, 30-(randomBallWidth/20));
    var randomBallY = randomNumberGrid(0, 30-(randomBallHeight/20));
    ballArray.push(new Ball(randomBallX, randomBallY, randomBallWidth, randomBallHeight, dx, dy));

  }
}



////////////////DOCUMENT READY
$(function(){
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");


//player controller
  var leftPressed = false;
  var upPressed = false;
  var rightPressed = false;
  var downPressed = false;
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  //player controller ends


  function drawPlayer(){
    ctx.beginPath();
    ctx.rect(player.xPos, player.yPos, player.height, player.width );
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  function drawDoor() {
    ctx.beginPath();
    ctx.rect(Door.xPos, Door.yPos, Door.width, Door.height);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
  }

  function drawOutDoor() {
    ctx.beginPath();
    ctx.rect(OutDoor.xPos, OutDoor.yPos, OutDoor.height, OutDoor.width);
    ctx.fillStyle = "darkred";
    ctx.fill();
    ctx.closePath();
  }


  //CONTROLLER Function
  function keyDownHandler(e) {
    if(e.keyCode === 39) {
      rightPressed = true;
    } else if (e.keyCode === 40) {
      downPressed = true;
    } else if(e.keyCode === 37) {
      leftPressed = true;
    } else if(e.keyCode === 38) {
      upPressed = true;
    }
  }

  function keyUpHandler(e) {
    if(e.keyCode === 39) {
      rightPressed = false;
    } else if (e.keyCode === 40) {
      downPressed = false;
    } else if(e.keyCode === 37) {
      leftPressed = false;
    } else if(e.keyCode === 38) {
      upPressed = false;
    }
  }
  //Controller Function Ends

  function drawBalls() {
    for (var i=0; i< ballArray.length; i++) {
      var currentBall = ballArray[i];
      drawBall(currentBall.xPos, currentBall.yPos, currentBall.width, currentBall.height);
    };
  };


  function drawBall(xPos,yPos,width,height) {
    ctx.beginPath();
    ctx.rect(xPos, yPos, width, height);
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

  // function collisionDetection(player) {
  //   for (var i=0;i<wallArray.length;i++) {
  //     var currentWallX = wallArray[i].xPos;
  //     var currentWallY = wallArray[i].yPos;
  //     var currentWallWidth = wallArray[i].width;
  //     var currentWallHeight = wallArray[i].height;
  //     if ((player.xPos + player.width > currentWallX && player.xPos < currentWallX+currentWallWidth) && (player.yPos + player.height > currentWallY && player.yPos < currentWallY+currentWallHeight) || (player.xPos < 0 || player.xPos + player.width > 600 || player.yPos < 0 || player.yPos + player.height > 600)) {
  //       console.log('inside wall');
  //       return true;
  //     }
  //   }
  // }


  var moveBalls = function(){
    for(var i=0; i<ballArray.length; i++){
      ballArray[i].xPos += ballArray[i].dx;
      ballArray[i].yPos += ballArray[i].dy;

      console.log(ballArray[i])

      if(xCollisionDetection(ballArray[i])) {
        ballArray[i].dx = -ballArray[i].dx;
      };

      if(yCollisionDetection(ballArray[i])){
        ballArray[i].dy = -ballArray[i].dy;
      };
    }
  }

///////////////// Call all programs
// <<<<<<< HEAD
  Room.generate();
  createBall(10);



  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBalls();
    drawWalls();
    drawDoor();
    drawOutDoor();
    doorCollision(player);


    moveBalls();


    if(rightPressed) {
      player.xPos += 5;
      if (collisionDetection(player)) {
        player.xPos -= 5;
        //Decrement health
      }
    } else if(leftPressed) {
      player.xPos -= 5;
      if (collisionDetection(player)) {
        player.xPos += 5;
      }
    } else if(upPressed) {
      player.yPos -= 5;
      if (collisionDetection(player)) {
        player.yPos += 5;
      }
    } else if(downPressed) {
      player.yPos += 5;
      if (collisionDetection(player)) {
        player.yPos -= 5;
      }
    }
  }


  setInterval(draw, 10);

  $("#generateButton").click(function() {
    Room.generate();
  });

});
