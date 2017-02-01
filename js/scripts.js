/////////////////GLOBAL VARIABLES
var wallArray = [];
var ballArray = [];
var bulletArray = [];
var playerArray = [];
var itemArray = [];
var availablePickUpsArray = ["health", "bigShot", "splitShot"];
var points = 0;
var roomNumber = 0;
var leftPressed = false;
var upPressed = false;
var rightPressed = false;
var downPressed = false;
var aPressed = false;
var sPressed = false;
var dPressed = false;
var wPressed = false;

var bgImg = new Image();
bgImg.src = "img/carpet.jpg";

var medicineImg = new Image();
medicineImg.src = "img/medicine.png";

var bigShotImg = new Image();
bigShotImg.src = "img/bigshot.png";

var playerImg = new Image();
playerImg.src = "img/baby.jpg"

var ballImg = new Image();
ballImg.src = "img/antifreeze.png"

var bulletImg = new Image();
bulletImg.src = "img/pacifier.png"

var wallImg = new Image();
wallImg.src = "img/crib.jpg"


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
  return Math.floor(Math.random()*(max-min + 1)+min);
};

function randomNumberGrid(min,max) {
  return randomNumber(min,max)*20;
}

///////////////FUNCTIONS
var Room = {
  generate: function(player) {
    points += 1;
    roomNumber += 1;
    $('#points').text(points);
    bulletArray = [];
    wallArray = [];
    createBall(roomNumber/2);
    createWalls(3);
    createDoor();
    createOutDoor(player);
    createItem();
    if (roomNumber > 2) {
      playerImg.src = "img/child.gif"
      ballImg.src = "img/angrymom.png"
      bulletImg.src = "img/childdrawing.png"
      wallImg.src = "img/school.gif"
      bgImg.src = 'img/dirt.jpg'
      player.moveSpeed = 2
    }
    if (roomNumber > 4) {
      playerImg.src = "img/teenager.png"
      ballImg.src = "img/book.png"
      bulletImg.src = "img/lighter.png"
      wallImg.src = "img/tv.png"
      bgImg.src = 'img/grass.jpg'
      player.moveSpeed = 5
    }
    if (roomNumber > 6) {
      playerImg.src = "img/adult.gif"
      ballImg.src = "img/bill.png"
      bulletImg.src = "img/coffee.png"
      wallImg.src = "img/office.png"
      bgImg.src = 'img/asphalt.jpg'
      player.moveSpeed = 4
    }
    if (roomNumber > 8) {
      playerImg.src = "img/grandpa.png"
      ballImg.src = "img/grave.png"
      bulletImg.src = "img/candy.png"
      wallImg.src = "img/hospitalbed.png"
      bgImg.src = 'img/vinyl.jpg'
      player.moveSpeed = 1
    }
    if (roomNumber > 10) {
      $('.game').hide();
      $('#score').text(points);
      $('.gameOver').fadeIn();
    }
  }
}

function Player() {
  this.xPos = 10,
  this.yPos = 10,
  this.width = 30,
  this.height = 30,
  this.moveSpeed = 1,
  this.totalHealth = 600,
  this.currentHealth = this.totalHealth,
  this.upgrades = [];
  this.bulletSizeModifier = 5;
  this.bulletSplits = 1;
}

Player.prototype.draw = function(canvasContext){
  canvasContext.beginPath();
  canvasContext.rect(this.xPos, this.yPos, this.height, this.width );
  canvasContext.drawImage(playerImg, this.xPos, this.yPos, this.width, this.height);
  canvasContext.closePath();
}

Player.prototype.move = function() {
  if(downPressed && rightPressed) {
    this.yPos += this.moveSpeed;
    this.xPos += this.moveSpeed;
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos -= this.moveSpeed;
      this.xPos -= this.moveSpeed;
    }
  } else if(downPressed && leftPressed) {
      this.yPos += this.moveSpeed;
      this.xPos -= this.moveSpeed;
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos -= this.moveSpeed;
      this.xPos += this.moveSpeed;
    }
  } else if(upPressed && rightPressed) {
      this.yPos -= this.moveSpeed;
      this.xPos += this.moveSpeed;
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos += this.moveSpeed;
      this.xPos -= this.moveSpeed;
    }
  } else if(upPressed && leftPressed) {
      this.yPos -= this.moveSpeed;
      this.xPos -= this.moveSpeed;
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos += this.moveSpeed;
      this.xPos += this.moveSpeed;
    }
  } else if(rightPressed) {
    this.xPos += this.moveSpeed;
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.xPos -= this.moveSpeed;
    }
  } else if(leftPressed) {
    this.xPos -= this.moveSpeed;
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.xPos += this.moveSpeed;
    }
  } else if(upPressed) {
    this.yPos -= this.moveSpeed;
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos += this.moveSpeed;
    }
  } else if(downPressed) {
    this.yPos += this.moveSpeed;
    if (collisionDetectionLoop(playerArray,wallArray)) {
      this.yPos -= this.moveSpeed;
    }
  }
  //Item pick-up check
  for (var i = 0; i < itemArray.length; i++) {
    if (collisionDetection(itemArray[i], this).match(/[xy]+[^canvas]+/gi)) {
      var pickUp = itemArray.splice(i, 1);
      this.pickUp(pickUp[0]);
    }
  }
}

Player.prototype.pickUp = function(pickUp) {
  console.log("pick up method");
  console.log(pickUp);
  if (pickUp.type === "health") {
    if (this.totalHealth - this.currentHealth < 100) {
      this.currentHealth = this.totalHealth;
    } else {
    this.currentHealth += 100;
    }
  } else if (pickUp.type === "bigShot") {
    this.bulletSizeModifier += 2;
    if (!this.upgrades.includes("bigShot")) {
      this.upgrades.push("bigShot");
    }
  } else if (pickUp.type === "splitShot") {
    if (this.bulletSplits < 8) {
      this.bulletSplits += 1;
    }
    if (!this.upgrades.includes("splitShot")) {
      this.upgrades.push("splitShot");
    }
  } else if (pickUp.type === "ricochet") {
    if (!this.upgrades.includes("ricochet")) {
      this.upgrades.push("ricochet");
    }
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
  canvasContext.drawImage(wallImg, this.xPos, this.yPos, this.width, this.height);
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
  canvasContext.drawImage(ballImg, this.xPos, this.yPos, this.width, this.height);
  canvasContext.closePath();
}

function Bullet(player) {
  this.xPos = player.xPos + 15,
  this.yPos = player.yPos + 15,
  this.width = 5,
  this.height = 5,
  this.dx = 0,
  this.dy = 0,
  this.ricochet = false,
  this.timesBounced = 0
}

Bullet.prototype.setDirection = function() {
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

//Used to set trajectories for multiple bullets at once
function splitShot(bulletsArray) {
  var bulletTrajectories;
  if (dPressed) {
    bulletTrajectories = multiShotCases(10, "x", bulletsArray);
  } else if (aPressed) {
    bulletTrajectories = multiShotCases(-10, "x", bulletsArray);
  }
  if (wPressed) {
    bulletTrajectories = multiShotCases(-10, "y", bulletsArray);
  } else if (sPressed) {
    bulletTrajectories = multiShotCases(10, "y", bulletsArray);
  }
  aPressed = false;
  sPressed = false;
  dPressed = false;
  wPressed = false;
  return bulletTrajectories;
}

function multiShotCases(velocity, axis, bulletsArray) {
  var direction1 = "";
  var direction2 = "";
  if (axis === "x") {
    direction1 = "dx";
    direction2 = "dy";
  } else {
    //direction === y
    direction1 = "dy";
    direction2 = "dx";
  }

  if (bulletsArray.length >= 2) {
    //Right down
    bulletsArray[0][direction1] = velocity;
    bulletsArray[0][direction2] = velocity;
    //Right up
    bulletsArray[1][direction1] = velocity;
    bulletsArray[1][direction2] = -velocity;
  }
  if (bulletsArray.length === 3) {
    //Right
    bulletsArray[2][direction1] = velocity;
    bulletsArray[2][direction2] = 0;
  }
  if (bulletsArray.length >= 4) {
    //Left down
    bulletsArray[2][direction1] = -velocity;
    bulletsArray[2][direction2] = velocity;
    //Left up
    bulletsArray[3][direction1] = -velocity;
    bulletsArray[3][direction2] = -velocity;
  }
  if (bulletsArray.length >= 5) {
    //Right
    bulletsArray[4][direction1] = velocity;
  }
  if (bulletsArray.length >= 6) {
    //Left
    bulletsArray[5][direction1] = -velocity;
  }
  if (bulletsArray.length >= 7) {
    //Down
    bulletsArray[6][direction1] = 0;
    bulletsArray[6][direction2] = velocity;
  }
  if (bulletsArray.length === 8) {
    //Up
    bulletsArray[7][direction1] = 0;
    bulletsArray[7][direction2] = -velocity;
  }
  return bulletsArray;
}

Bullet.prototype.draw = function(canvasContext) {
  canvasContext.beginPath();
  canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
  canvasContext.drawImage(bulletImg, this.xPos, this.yPos, this.width, this.height);
  canvasContext.closePath();
}

function Item(xPos, yPos, type) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = 30;
  this.height = 30;
  this.dx = 0;
  this.dy = 0;
  this.img = "";
  this.type = type;
}

Item.prototype.draw = function(canvasContext) {
  var color;
  if (this.type === "health") {
    itemImg = medicineImg;
  } else if (this.type === "bigShot" || this.type === "splitShot" || this.type === "ricochet") {
    itemImg = bigShotImg;
  }
  canvasContext.beginPath();
  canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
  canvasContext.drawImage(itemImg, this.xPos, this.yPos, this.width, this.height);
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
    var randomBallX = randomNumberGrid(0, 29);
    var randomBallY = randomNumberGrid(0, 29);
    ballArray.push(new Ball(randomBallX, randomBallY, 20, 20, dx, dy));
  }
}


function createBullet(player) {
  if (aPressed || dPressed || sPressed || wPressed) {
    var newBulletsArray = [];
    for (var i = 0; i < player.bulletSplits; i++) {
      var newBullet = new Bullet(player);
      newBullet.height += player.bulletSizeModifier;
      newBullet.width += player.bulletSizeModifier;
      if (player.upgrades.includes("ricochet")) {
        newBullet.ricochet = true;
      }
      newBulletsArray.push(newBullet);
    }

    if (newBulletsArray.length === 1) {
      newBulletsArray[0].setDirection();
    } else {
      newBulletsArray = splitShot(newBulletsArray);
    }

    for (var i = 0; i < newBulletsArray.length; i++) {
      bulletArray.push(newBulletsArray[i]);
    }
    if (bulletArray.length>30) {
      bulletArray.splice(0, player.bulletSplits);
    }
  }
}

function createWalls(numberOfWalls) {
  for (var i = 1; i<=numberOfWalls; i++) {
    var randomWidth = randomNumberGrid(4,10);
    var randomHeight = randomNumberGrid(4,10);
    var randomXPosition = randomNumberGrid(2,28 - (randomWidth/20));
    var randomYPosition = randomNumberGrid(2,28 - (randomHeight/20));
    wallArray.push(new Wall(randomXPosition, randomYPosition, randomWidth, randomHeight));
  };
};

function createItem() {
  var spawnChance = randomNumber(1, 10);
  if (spawnChance > 6) {
    var randomXPosition = randomNumberGrid(1,29);
    var randomYPosition = randomNumberGrid(1,29);
    var randomItem = availablePickUpsArray[randomNumber(0, availablePickUpsArray.length - 1)];
    itemArray.push(new Item(randomXPosition, randomYPosition, randomItem));
    console.log(itemArray);
  }
  if (spawnChance === 10) {
    var randomXPosition = randomNumberGrid(1,29);
    var randomYPosition = randomNumberGrid(1,29);
    var randomItem = availablePickUpsArray[randomNumber(0, availablePickUpsArray.length - 1)];
    itemArray.push(new Item(randomXPosition, randomYPosition, randomItem));
    console.log(itemArray);
  }
}

function displayHealth(currentHealth, health){
  if (currentHealth > health * 0.2) {
    $("#health-danger").hide();
    $("#health").show();
    $("#health").css("width", health * (currentHealth/health))
  } else if( currentHealth < (health * 0.2) ){
    $("#health").hide();
    $("#health-danger").show();
    $("#health-danger").css("width", health * (currentHealth/health) )
  }
}

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
      $('#hardware').show();
      $('.game').fadeIn();
    }
    if (e.keyCode === 114) {
        location.reload();
    }
  });


  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var displayBgImg = function(){
    ctx.fillStyle = ctx.createPattern(bgImg, "repeat");
    ctx.fillRect(0, 0, 600, 600);
  }

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

  function drawItems() {
    for (var i = 0; i < itemArray.length; i++) {
      itemArray[i].draw(ctx);
    }
  }



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
          ballArray.splice(j, 1);
        };
      }
      if (bulletArray[i].ricochet === true) {
        for (var k = 0; k < wallArray.length; k++) {
          if(collisionDetection(bulletArray[i],wallArray[k])==='x' || collisionDetection(bulletArray[i],wallArray[k])==='canvasx') {
            bulletArray[i].dx = -bulletArray[i].dx;
            bulletArray[i].timesBounced++;
          };

          if(collisionDetection(bulletArray[i],wallArray[k])==='y' || collisionDetection(bulletArray[i],wallArray[k])==='canvasy'){
            bulletArray[i].dy = -bulletArray[i].dy;
            bulletArray[i].timesBounced++;
          };
        }
      }
      if (bulletArray[i].timesBounced > 50) {
        bulletArray.splice(i, 1);
      }
    }
  }

///////////////// Call all programs
  Room.generate(player1);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    displayBgImg();
    player1.draw(ctx);
    Door.draw(ctx);
    OutDoor.draw(ctx);
    drawBalls();
    drawBullets();
    drawWalls();
    drawItems();
    doorCollision(player1);
    if (collisionDetectionLoop(playerArray,ballArray)) {
      player1.currentHealth -= 2;
      if (player1.currentHealth < 0) {
        $('.game').hide();
        $('#score').text(points);
        $('.gameOver').fadeIn();
      }
    }
    displayHealth(player1.currentHealth, player1.totalHealth);
    createBullet(player1);
    moveBullets();
    moveBalls();
    player1.move();

  }
  setInterval(draw, 10);
});
