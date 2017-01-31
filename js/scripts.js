/////////////////GLOBAL VARIABLES
var wallArray = [];
var ballArray = [];
var bulletArray = [];
var playerArray = [];
var points = 0;
var health = 600;
var currentHealth = health;
var leftPressed = false;
var upPressed = false;
var rightPressed = false;
var downPressed = false;
var aPressed = false;
var sPressed = false;
var dPressed = false;
var wPressed = false;



var Door = {
  xPos:600,
  yPos:300,
  height:50,
  width:50,
  draw: function(canvasContext) {
    canvasContext.beginPath();
    canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
    canvasContext.fillStyle = "green";
    canvasContext.fill();
    canvasContext.closePath();
  }
};

var OutDoor = {
  xPos: -45,
  yPos: 30,
  height: 50,
  width: 50,
  draw: function(canvasContext) {
    canvasContext.beginPath();
    canvasContext.rect(this.xPos, this.yPos, this.height, this.width);
    canvasContext.fillStyle = "darkred";
    canvasContext.fill();
    canvasContext.closePath();
  }
}


function randomNumber(min,max) {
  return Math.floor(Math.random()*(max-min)+min);
};

function randomNumberGrid(min,max) {
  return randomNumber(min,max)*20;
}

///////////////FUNCTIONS
var Room = {
  generate: function(player) {
    points += 1;
    $('#points').text(points);
    wallArray = [];
    createBall(1);
    createWalls(3);
    createDoor();
    createOutDoor(player);
  }
}

function Player() {
  this.xPos = 10,
  this.yPos = 10,
  this.width = 30,
  this.height = 30,
  this.facing = "right"
}

Player.prototype.draw = function(canvasContext){
  canvasContext.beginPath();
  canvasContext.rect(this.xPos, this.yPos, this.height, this.width );
  canvasContext.fillStyle = "red";
  canvasContext.fill();
  canvasContext.closePath();
}

Player.prototype.move = function() {
  if(downPressed && rightPressed) {
    this.yPos += 5;
    this.xPos += 5;
    this.facing = "rightDown";
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos -= 5;
      this.xPos -= 5;
    }
  } else if(downPressed && leftPressed) {
      this.yPos += 5;
      this.xPos -= 5;
      this.facing = "leftDown";
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos -= 5;
      this.xPos += 5;
    }
  } else if(upPressed && rightPressed) {
      this.yPos -= 5;
      this.xPos += 5;
      this.facing = "rightUp";
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos += 5;
      this.xPos -= 5;
    }
  } else if(upPressed && leftPressed) {
      this.yPos -= 5;
      this.xPos -= 5;
      this.facing = "leftUp";
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos += 5;
      this.xPos += 5;
    }
  } else if(rightPressed) {
    this.xPos += 5;
    this.facing = "right";
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.xPos -= 5;
    }
  } else if(leftPressed) {
    this.xPos -= 5;
    this.facing = "left";
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.xPos += 5;
    }
  } else if(upPressed) {
    this.yPos -= 5;
    this.facing = "up";
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos += 5;
    }
  } else if(downPressed) {
    this.yPos += 5;
    this.facing = "down";
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos -= 5;
    }
  }
}

function displayHealth(currentHealth, health){
   $("#health").css("width", health * (currentHealth/health) )
   if( currentHealth < (health * 0.2) ){
     $("#health").hide();
     $("#health-danger").css("width", health * (currentHealth/health) )
   }
}


function Wall(xPos,yPos, width, height) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = width;
  this.height = height;
  this.dx = 0;
  this.dy = 0;
}

Wall.prototype.draw = function(canvasContext) {
  canvasContext.beginPath();
  canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
  canvasContext.fillStroke = "black";
  canvasContext.stroke();
  canvasContext.closePath();
};


function Ball(xPos,yPos,width,height, dx, dy) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = width;
  this.height = height;
  this.dx = dx;
  this.dy = dy;
}

Ball.prototype.draw = function(canvasContext) {
  canvasContext.beginPath();
  canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
  canvasContext.fillStyle = "#0095DD";
  canvasContext.fill();
  canvasContext.closePath();
}

function Bullet(player) {
  this.xPos = player.xPos + 15,
  this.yPos = player.yPos + 15,
  this.width = 5,
  this.height = 5,
  this.dx = 0,
  this.dy = 0
}

Bullet.prototype.fire = function() {
  if (dPressed) {
    this.dx = 10;
  } else if (aPressed) {
    this.dx = -10;
  }
  if (wPressed) {
    this.dy = -10;
  } else if (sPressed) {
    this.dy = 10;
  }
  aPressed = false;
  sPressed = false;
  dPressed = false;
  wPressed = false;
}

Bullet.prototype.draw = function(canvasContext) {
  canvasContext.beginPath();
  canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
  canvasContext.fillStyle = "black";
  canvasContext.fill();
  canvasContext.closePath();
}


//Creation Function
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

function createOutDoor(player) {
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


function createBullet(player) {
  if (aPressed || dPressed || sPressed || wPressed) {
    var newBullet = new Bullet(player);
    newBullet.fire();
    if (bulletArray.length>80) {
      bulletArray.splice(0, 1);
    }
    bulletArray.push(newBullet);
  }
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


//Collision

function collisionDetectionLoop(object1Array,object2Array) {
  for (var i=0;i<object1Array.length;i++) {
    for (var j=0;j<object2Array.length;j++) {
      if (collisionDetection(object1Array[i],object2Array[j])) {
        return collisionDetection(object1Array[i],object2Array[j]);
      }
    }
  }
}


function collisionDetection(player,object) {
  var collisionType = "";
  if ((player.xPos < 0 || player.xPos + player.width > 600) || (player.xPos + player.width > object.xPos && player.xPos < object.xPos + object.width)) {
    if (player.yPos + player.height > object.yPos + 5 && player.yPos < object.yPos + object.height - 5) {
      collisionType += 'x';
    } else if (player.xPos < 0 || player.xPos + player.width > 600) {
      collisionType += 'canvasx';
    }
  }

  if ((player.yPos < 0 || player.yPos + player.height > 600) || (player.yPos + player.height > object.yPos && player.yPos < object.yPos + object.height)) {
    if (player.xPos + player.width > object.xPos + 5 && player.xPos < object.xPos + object.width - 5) {
      collisionType += 'y';
    } else if (player.yPos < 0 || player.yPos + player.height > 600) {
      collisionType += 'canvasy';
    }
  }
  return collisionType;
}


function doorCollision(player) {
  if ((player.xPos + player.width > Door.xPos && player.xPos < Door.xPos + Door.width) && (player.yPos + player.height > Door.yPos && player.yPos < Door.yPos + Door.height)) {
    Room.generate(player);
  }
}




////////////////DOCUMENT READY
$(function(){
  $('html').keypress(function(e) {
    if (e.keyCode === 32) {
      $('.introduction').hide();
      $('.game').show();
    }
    if (e.keyCode === 114) {
        location.reload();
    }
  });

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  // var floorImg = new Image();
  // floorImg.src = "img/floor.png";
  // floorImg.onload = function(){
  //   // create pattern
  //    var ptrn = ctx.createPattern(floorImg, 'repeat'); // Create a pattern with this image, and set it to "repeat".
  //    ctx.fillStyle = ptrn;
  //    ctx.fillRect(0, 0, canvas.width, canvas.height); // context.fillRect(x, y, width, height);
  // }
  //

  var player1 = new Player();
  playerArray.push(player1);

//player controller

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
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
  //player controller ends


  function drawBullets() {
    for (var i = 0; i < bulletArray.length; i++) {
      bulletArray[i].draw(ctx);
    }
  }


  function drawBalls() {
    for (var i=0; i< ballArray.length; i++) {
      ballArray[i].draw(ctx);
    };
  };

  function drawWalls() {
    for (var i=0; i< wallArray.length; i++) {
      wallArray[i].draw(ctx);
    };
  };



  function moveBalls(){
    for(var i=0; i<ballArray.length; i++){
      ballArray[i].xPos += ballArray[i].dx;
      ballArray[i].yPos += ballArray[i].dy;
      for (var j=0; j<wallArray.length; j++){
        if(collisionDetection(ballArray[i],wallArray[j])==='x' || collisionDetection(ballArray[i],wallArray[j])==='canvasx') {
          ballArray[i].dx = -ballArray[i].dx;
        };

        if(collisionDetection(ballArray[i],wallArray[j])==='y' || collisionDetection(ballArray[i],wallArray[j])==='canvasy'){
          ballArray[i].dy = -ballArray[i].dy;
        };
      }
    }
  }

  function moveBullets() {
    for(var i=0; i<bulletArray.length; i++){
      bulletArray[i].xPos += bulletArray[i].dx;
      bulletArray[i].yPos += bulletArray[i].dy;
      for( var j=0; j<ballArray.length; j++) {
        if(collisionDetection(bulletArray[i],ballArray[j])==='xy') {
          console.log("bullet/ball collision");
          console.log(ballArray);
          ballArray.splice(j, 1);
          console.log(ballArray);
        };
      }
    }
  }

///////////////// Call all programs
  Room.generate(player1);




  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player1.draw(ctx);
    Door.draw(ctx);
    OutDoor.draw(ctx);
    drawBalls();
    drawBullets();
    drawWalls();
    doorCollision(player1);
    if (collisionDetectionLoop(playerArray,ballArray)) {
      currentHealth -= 2;
      displayHealth(currentHealth, health);
    }
    createBullet(player1);
    moveBullets();
    moveBalls();
    player1.move();




  }
  setInterval(draw, 10);
});
