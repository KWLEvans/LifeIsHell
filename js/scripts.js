/////////////////GLOBAL VARIABLES
var wallArray = [];
var ballArray = [];
var bulletArray = [];
var points = 0;
var health = 10;

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
  height: 30,
  facing: "right"
};



///////////////FUNCTIONS
var Room = {
  generate: function() {
    points += 1;
    $('#points').text(points);
    wallArray = [];
    createBall(1);
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

function Wall(xPos,yPos, width, height) {
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

function Bullet(facing) {
  this.xPos = player.xPos + 15,
  this.yPos = player.yPos + 15,
  this.width = 5,
  this.height = 5,
  this.dx = 0,
  this.dy = 0,
  this.facing = facing,
  this.fire = function() {
    if (this.facing.match(/d/gi)) {
      this.dx = 5;
    } else if (this.facing.match(/a/gi)) {
      this.dx = -5;
    }
    if (this.facing.match(/w/gi)) {
      this.dy = -5;
    } else if (this.facing.match(/s/gi)) {
      this.dy = 5;
    }
  }
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
    var randomXPosition = randomNumberGrid(2,28 - (randomWidth/20));
    var randomYPosition = randomNumberGrid(2,28 - (randomHeight/20));
    wallArray.push(new Wall(randomXPosition, randomYPosition, randomWidth, randomHeight));
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

function createBullet(facing) {
  var newBullet = new Bullet(facing);
  newBullet.fire();
  bulletArray.push(newBullet)
  console.log(bulletArray);
}

function xCollisionDetection(player) {
  for (var i=0;i<wallArray.length;i++) {
    var currentWallX = wallArray[i].xPos;
    var currentWallY = wallArray[i].yPos;
    var currentWallWidth = wallArray[i].width;
    var currentWallHeight = wallArray[i].height;
    if ((player.xPos < 0 || player.xPos + player.width > 600) || (player.xPos + player.width > currentWallX && player.xPos < currentWallX + currentWallWidth)) {
      if (player.yPos + player.height > currentWallY + 5 && player.yPos < currentWallY + currentWallHeight - 5) {
        return true;
      } else if (player.xPos < 0 || player.xPos + player.width > 600) {
        return true;
      }
    }
  }
}

function xBallCollisionDetection(player) {
  for (var i=0;i<ballArray.length;i++) {
    var currentWallX = ballArray[i].xPos;
    var currentWallY = ballArray[i].yPos;
    var currentWallWidth = ballArray[i].width;
    var currentWallHeight = ballArray[i].height;
    if ((player.xPos < 0 || player.xPos + player.width > 600) || (player.xPos + player.width > currentWallX && player.xPos < currentWallX + currentWallWidth)) {
      if (player.yPos + player.height > currentWallY + 5 && player.yPos < currentWallY + currentWallHeight - 5) {
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
      if (player.xPos + player.width > currentWallX + 5 && player.xPos < currentWallX + currentWallWidth - 5) {
        return true;
      } else if (player.yPos < 0 || player.yPos + player.height > 600) {
        return true;
      }
    }
  }
}

function yBallCollisionDetection(player) {
  for (var i=0;i<ballArray.length;i++) {
    var currentWallX = ballArray[i].xPos;
    var currentWallY = ballArray[i].yPos;
    var currentWallWidth = ballArray[i].width;
    var currentWallHeight = ballArray[i].height;
    if ((player.yPos < 0 || player.yPos + player.height > 600) || (player.yPos + player.height > currentWallY && player.yPos < currentWallY + currentWallHeight)) {
      if (player.xPos + player.width > currentWallX + 5 && player.xPos < currentWallX + currentWallWidth - 5) {
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

function ballCollisionDetection(player) {
  if (yBallCollisionDetection(player) || xBallCollisionDetection(player)) {
    return true;
  }
}

function doorCollision(player) {
  if ((player.xPos + player.width > Door.xPos && player.xPos < Door.xPos + Door.width) && (player.yPos + player.height > Door.yPos && player.yPos < Door.yPos + Door.height)) {
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
  var aPressed = false;
  var sPressed = false;
  var dPressed = false;
  var wPressed = false;
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

  function drawBullet(xPos, yPos, width, height) {
    ctx.beginPath();
    ctx.rect(xPos, yPos, width, height);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }

  function drawBullets() {
    for (var i = 0; i < bulletArray.length; i++) {
      var currentBullet = bulletArray[i];
      drawBullet(currentBullet.xPos, currentBullet.yPos, currentBullet.width, currentBullet.height);
    }
  }

  function drawBall(xPos,yPos,width,height) {
    ctx.beginPath();
    ctx.rect(xPos, yPos, width, height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  function drawBalls() {
    for (var i=0; i< ballArray.length; i++) {
      var currentBall = ballArray[i];
      drawBall(currentBall.xPos, currentBall.yPos, currentBall.width, currentBall.height);
    };
  };

  //CONTROLLER Function
  function keyDownHandler(e) {
    console.log(e.keyCode);
    if(e.keyCode === 39) {
      rightPressed = true;
    } else if (e.keyCode === 40) {
      downPressed = true;
    } else if(e.keyCode === 37) {
      leftPressed = true;
    } else if(e.keyCode === 38) {
      upPressed = true;
    } else if(e.keyCode === 65) {
      aPressed = true;
    } else if(e.keyCode === 83) {
      sPressed = true;
    } else if(e.keyCode === 68) {
      dPressed = true;
    } else if(e.keyCode === 87) {
      wPressed = true;
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

  function moveBalls(){
    for(var i=0; i<ballArray.length; i++){
      ballArray[i].xPos += ballArray[i].dx;
      ballArray[i].yPos += ballArray[i].dy;

      if(xCollisionDetection(ballArray[i])) {
        ballArray[i].dx = -ballArray[i].dx;
      };

      if(yCollisionDetection(ballArray[i])){
        ballArray[i].dy = -ballArray[i].dy;
      };
    }
  }

  function moveBullets() {
    for(var i=0; i<bulletArray.length; i++){
      bulletArray[i].xPos += bulletArray[i].dx;
      bulletArray[i].yPos += bulletArray[i].dy;
    }
  }

///////////////// Call all programs
  Room.generate();




  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBalls();
    drawBullets();
    drawWalls();
    drawDoor();
    drawOutDoor();
    doorCollision(player);
    if (ballCollisionDetection(player)) {
      health -= 1;
      $('#health').text(health);
    }

    moveBullets();
    moveBalls();

    if(downPressed && rightPressed) {
      player.yPos += 5;
      player.xPos += 5;
      player.facing = "rightDown";
      if (collisionDetection(player)) {
        player.yPos -= 5;
        player.xPos -= 5;
      }
    } else if(downPressed && leftPressed) {
        player.yPos += 5;
        player.xPos -= 5;
        player.facing = "leftDown";
      if (collisionDetection(player)) {
        player.yPos -= 5;
        player.xPos += 5;
      }
    } else if(upPressed && rightPressed) {
        player.yPos -= 5;
        player.xPos += 5;
        player.facing = "rightUp";
      if (collisionDetection(player)) {
        player.yPos += 5;
        player.xPos -= 5;
      }
    } else if(upPressed && leftPressed) {
        player.yPos -= 5;
        player.xPos -= 5;
        player.facing = "leftUp";
      if (collisionDetection(player)) {
        player.yPos += 5;
        player.xPos += 5;
      }
    } else if(rightPressed) {
      player.xPos += 5;
      player.facing = "right";
      if (collisionDetection(player)) {
        player.xPos -= 5;
        //Decrement health
      }
    } else if(leftPressed) {
      player.xPos -= 5;
      player.facing = "left";
      if (collisionDetection(player)) {
        player.xPos += 5;
      }
    } else if(upPressed) {
      player.yPos -= 5;
      player.facing = "up";
      if (collisionDetection(player)) {
        player.yPos += 5;
      }
    } else if(downPressed) {
      player.yPos += 5;
      player.facing = "down";
      if (collisionDetection(player)) {
        player.yPos -= 5;
      }
    }

    if (aPressed && sPressed) {
      createBullet("as");
    } else if (aPressed && wPressed) {
      createBullet("aw");
    } else if (dPressed && wPressed) {
      createBullet("dw");
    } else if (dPressed && sPressed) {
      createBullet("ds");
    } else if (aPressed) {
      createBullet("a");
    } else if (wPressed) {
      createBullet("w");
    } else if (dPressed) {
      createBullet("d");
    } else if (sPressed) {
      createBullet("s");
    }
    aPressed = false;
    sPressed = false;
    dPressed = false;
    wPressed = false;
  }



  setInterval(draw, 10);
});
