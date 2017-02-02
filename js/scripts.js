/////////////////GLOBAL VARIABLES
var wallArray = [];
var ballArray = [];
var bulletArray = [];
var playerArray = [];
var itemArray = [];
var availablePickUpsArray = ["health", "bigShot", "splitShot", "ricochet", "speedBoost"];
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
var gameReset = true;
var difficulties = "easy";
var time;
var shootSound = new Audio("sound/shoot.wav");
var enemyKilledSound = new Audio("sound/enemykilled.wav");

var bgImg = new Image();
bgImg.src = "img/carpet.jpg";

var medicineImg = new Image();
medicineImg.src = "img/medicine.png";

var bigShotImg = new Image();
bigShotImg.src = "img/bigshot.png";

var playerImg = new Image();
playerImg.src = "img/baby.jpg";

var ballImg = new Image();
ballImg.src = "img/antifreeze.png";

var bulletImg = new Image();
bulletImg.src = "img/pacifier.png";

var wallImg = new Image();
wallImg.src = "img/bear.png";

var ricochetImg = new Image();
ricochetImg.src = "img/ricochet.png";

var speedBoosterImg = new Image();
speedBoosterImg.src = "img/speedBooster.png";

var splitShotImg = new Image();
splitShotImg.src = "img/splitshot.png";


var Door = {
  xPos:600,
  yPos:300,
  height:50,
  width:50,
  dx: 0,
  dy: 0,
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
  dx: 0,
  dy: 0,
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

function randomPositiveOrNegative(number) {
  if (randomNumber(0,1)) {
    return number;
  } else {
    return number * -1;
  }
}

///////////////FUNCTIONS
var Room = {
  generate: function(player) {
    if (roomNumber > 0) {
      points += (2 * roomNumber);
    }
    roomNumber += 1;
    $('#points').text("Points: " + points);
    $('#age').text("Age: 0")
    bulletArray = [];
    wallArray = [];
    createWalls(3);
    createBall(roomNumber/2);
    createOutDoor(player);
    createDoor();
    createItem();
    if (roomNumber > 2) {
      playerImg.src = "img/child.gif";
      ballImg.src = "img/bully.png";
      bulletImg.src = "img/pizza.png";
      wallImg.src = "img/table.jpg";
      bgImg.src = 'img/cafeteriafloor.jpg';
      player.moveSpeed = 2;
      $("#age").text("Age: 6");
    }
    if (roomNumber > 4) {
      playerImg.src = "img/teenager.png";
      ballImg.src = "img/puberty.jpg";
      bulletImg.src = "img/playboy.jpg";
      wallImg.src = "img/tv.png";
      bgImg.src = 'img/bathroom.jpg';
      player.moveSpeed = 5;
      $("#age").text("Age: 17");
    }
    if (roomNumber > 6) {
      playerImg.src = "img/adult.gif";
      ballImg.src = "img/bill.png";
      bulletImg.src = "img/coffee.png";
      wallImg.src = "img/taxform.png";
      bgImg.src = 'img/marble.jpg';
      player.moveSpeed = 4;
      $("#age").text("Age: 42");
    }
    if (roomNumber > 8) {
      playerImg.src = "img/grandpa.png";
      ballImg.src = "img/grave.png";
      bulletImg.src = "img/candy.png";
      wallImg.src = "img/hospitalbed.png";
      bgImg.src = 'img/vinyl.jpg';
      player.moveSpeed = 1;
      $("#age").text("Age: 81");
    }
    if (roomNumber > 10) {
      gameReset = false;
      $('.game').hide();
      $('#hardware').hide();
      $('#score').text(points);
      $('.gameOver').fadeIn();
    }
  }
}

function Player(difficulties) {
  this.xPos = 10,
  this.yPos = 10,
  this.width = 30,
  this.height = 30,
  this.moveSpeed = 1,
  this.dx = this.moveSpeed;
  this.dy = this.moveSpeed;
  this.totalHealth = 600,
  this.currentHealth = this.totalHealth,
  this.upgrades = [];
  this.bulletSizeModifier = 5;
  this.difficulties = difficulties;
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
    if (collisionDetection(itemArray[i], this).match(/^[^canvas]+/gi)) {
      var pickUp = itemArray.splice(i, 1);
      this.pickUp(pickUp[0]);
      points += 3;
      $('#points').text("Points: " + points);
    }
  }
}

Player.prototype.pickUp = function(pickUp) {
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
  } else if (pickUp.type === "speedBoost") {
    this.moveSpeed = this.moveSpeed * 2;
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
  this.chaser = false;
}

Ball.prototype.draw = function(canvasContext) {
  canvasContext.beginPath();
  canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
  canvasContext.drawImage(ballImg, this.xPos, this.yPos, this.width, this.height);
  canvasContext.closePath();
}

Ball.prototype.chasePlayer = function(player) {
  if (player.xPos > this.xPos) {
    this.dx = 2;
  } else if (player.xPos === this.xPos) {
    this.dx = 0;
  } else {
    this.dx = -2;
  }
  if (player.yPos > this.yPos) {
    this.dy = 2;
  } else if (player.yPos === this.yPos) {
    this.dy = 0;
  } else {
    this.dy = -2;
  }
}

function Bullet(player) {
  this.xPos = player.xPos + (player.width/2),
  this.yPos = player.yPos + (player.width/2),
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
  } else if (this.type === "bigShot") {
    itemImg = bigShotImg;
  }else if (this.type === "ricochet") {
    itemImg = ricochetImg;
  }else if (this.type === "speedBoost") {
    itemImg = speedBoosterImg;
  }else if (this.type === "splitShot") {
    itemImg = splitShotImg;
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
  Door.dx = 0;
  Door.dy = 0;
  if (randomXOrY) {
    if (randomMinOrMax) {
      Door.xPos = -44;
      Door.yPos = randomNumberGrid(1, 27);
      Door.dx = 5;
    } else {
      Door.xPos = 594;
      Door.yPos = randomNumberGrid(1, 27);
      Door.dx = -5;
    }
  } else {
    if (randomMinOrMax) {
      Door.yPos = -44;
      Door.xPos = randomNumberGrid(1, 27);
      Door.dy = 5;
    } else {
      Door.yPos = 594;
      Door.xPos = randomNumberGrid(1, 27);
      Door.dy = -5;
    }
  }
}

function createOutDoor(player) {
  if (player.xPos + player.width + player.moveSpeed > 585) {
    player.xPos = 6;
    OutDoor.xPos = -44;
    OutDoor.yPos = player.yPos;
  } else if (player.xPos + player.moveSpeed < 15) {
    player.xPos = 600 - player.moveSpeed - player.width;
    OutDoor.xPos = 594;
    OutDoor.yPos = player.yPos;
  } else if (player.yPos + player.height + player.moveSpeed > 585) {
    player.yPos = 6;
    OutDoor.yPos = -44;
    OutDoor.xPos = player.xPos;
  } else if (player.yPos + player.moveSpeed < 15) {
    player.yPos = 600 - player.moveSpeed - player.height;
    OutDoor.yPos = 594;
    OutDoor.xPos = player.xPos;
  }
}


function createBall(numberOfBalls) {
  for (var i = 1; i<=numberOfBalls; i++) {
    var dx = randomPositiveOrNegative(2);
    var dy = randomPositiveOrNegative(2);
    var randomBallX = randomNumberGrid(0, 29);
    var randomBallY = randomNumberGrid(0, 29);
    var newBall = new Ball(randomBallX, randomBallY, 40, 40, dx, dy);

    if (creationCollision(newBall)) {
      i--;
    } else {
      if (randomNumber(1,5) === 5) {
        newBall.chaser = true;
        newBall.height = 20;
        newBall.width = 20;
      }
      ballArray.push(newBall);
    }
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
    shootSound.play();
  }


}

function createWalls(numberOfWalls) {
  for (var i = 1; i<=numberOfWalls; i++) {
    var randomWidth = randomNumberGrid(4,10);
    var randomHeight = randomNumberGrid(4,10);
    var randomXPosition = randomNumberGrid(2,28 - (randomWidth/20));
    var randomYPosition = randomNumberGrid(2,28 - (randomHeight/20));
    var newWall = new Wall(randomXPosition, randomYPosition, randomWidth, randomHeight);
    if (creationCollision(newWall)) {
      i--;
    } else {
      wallArray.push(newWall);
    }
  };
};

function createItem() {
  var spawnChance = randomNumber(1,10);
  var numberOfItems = 0;
  if (spawnChance === 10) {
    numberOfItems = 3;
  } else if (spawnChance >= 8) {
    numberOfItems = 2;
  } else if (spawnChance > 3) {
    numberOfItems = 1;
  }

  for (var i = 0; i < numberOfItems; i++) {
    var randomXPosition = randomNumberGrid(2,28);
    var randomYPosition = randomNumberGrid(2,28);
    var randomItem = availablePickUpsArray[randomNumber(0, availablePickUpsArray.length - 1)];
    var newItem = new Item(randomXPosition, randomYPosition, randomItem);
    if (creationCollision(newItem)) {
      i--;
    } else {
      itemArray.push(newItem);
    }
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

function playerDamage(player) {
  if(player.difficulties === "easy"){
    player.currentHealth -= 2;
  }else if (player.difficulties === "normal"){
    player.currentHealth -= 4;
  }else if([player.difficulties === "hard"]){
    player.currentHealth -= 7;
  }
}

//Collision


function collisionDetection(collider, object) {
  if (collider.xPos + collider.dx <= 0 || collider.xPos + collider.width + collider.dx >= 600) {
    return "canvasx";
  } else if (collider.yPos + collider.dy <= 0 || collider.yPos + collider.height + collider.dy >= 600) {
    return "canvasy";
  } else {
    var collisionType = "";
    var inXBounds = (collider.xPos + collider.width + collider.dx >= object.xPos + object.dx) && (collider.xPos + collider.dx <= object.xPos + object.width + object.dx);
    var inYBounds = (collider.yPos + collider.height + collider.dy >= object.yPos + object.dy) && (collider.yPos + collider.dy <= object.yPos + object.height + object.dy);

    if (inXBounds && inYBounds) {
      var leftCollision = (collider.xPos + collider.width + collider.dx) - (object.xPos + object.dx);
      var rightCollision = (object.xPos + object.width + object.dx) - (collider.xPos + collider.dx);
      var topCollision = (collider.yPos + collider.height + collider.dy) - (object.yPos + object.dy);
      var bottomCollision = (object.yPos + object.height + object.dy) - (collider.yPos + collider.dy);

      if ((Math.min(leftCollision, rightCollision) < 10) && Math.min(topCollision, bottomCollision) < 10) {
        if (Math.min(leftCollision, rightCollision) > Math.min(topCollision, bottomCollision)) {
          collisionType = "x";
        } else if (Math.min(leftCollision, rightCollision) < Math.min(topCollision, bottomCollision)) {
          collisionType = "y";
        } else {
          collisionType = "xy";
        }
      } else if (Math.min(leftCollision, rightCollision) < 10) {
        collisionType = "x";
      } else if (Math.min(topCollision, bottomCollision) < 10) {
        collisionType = "y";
      } else {
        collisionType = "inside";
      }
    }
    return collisionType;
  }
}

function collisionDetectionLoop(object1Array,object2Array) {
  for (var i=0;i<object1Array.length;i++) {
    for (var j=0;j<object2Array.length;j++) {
      if (collisionDetection(object1Array[i],object2Array[j])) {
        return collisionDetection(object1Array[i],object2Array[j]);
      }
    }
  }
}

function doorCollision(player) {
  if ((player.xPos + player.width > Door.xPos + Door.dx && player.xPos < Door.xPos + Door.width + Door.dx) && (player.yPos + player.height > Door.yPos + Door.dy && player.yPos < Door.yPos + Door.height + Door.dy)) {
    Room.generate(player);
  }
}

function creationCollision(createdObject) {
  for (var j = 0; j < wallArray.length; j++) {
    return collisionDetection(createdObject, wallArray[j]).match(/^[^canvas]+/i);
  }
}



////////////////DOCUMENT READY
$(function(){
  $('html').keypress(function(e) {
    if (e.keyCode === 32 && gameReset === true) {
      //Game Start
      $('.introduction').hide();
      $('#hardware').show();
      $('.game').fadeIn();
      time = 10000;
    }
    if (e.keyCode === 114) {
        //Reload
        gameReset = true;
        location.reload();
    }
  });


  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var displayBgImg = function(){
    ctx.fillStyle = ctx.createPattern(bgImg, "repeat");
    ctx.fillRect(0, 0, 600, 600);
  }

  //GET Difficulties
  $("#easy").click(function(){
    difficulties = "easy";
  });
  $("#normal").click(function(){
    difficulties = "normal"
  });
  $("#hard").click(function(){
    difficulties = "hard"
  });

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
      if (ballArray[i].chaser) {
        ballArray[i].chasePlayer(player1);
      }
      for (var j=0; j<wallArray.length; j++){
        if(collisionDetection(ballArray[i],wallArray[j]).match(/x+/i)) {
          ballArray[i].dx = -ballArray[i].dx;
        }

        if(collisionDetection(ballArray[i],wallArray[j]).match(/y+/i)){
          ballArray[i].dy = -ballArray[i].dy;
        }
      }
      if(collisionDetection(ballArray[i],player1).match(/^x+/i)) {
        ballArray[i].dx = -ballArray[i].dx;
        playerDamage(player1);
      }

      if(collisionDetection(ballArray[i],player1).match(/^x*y+/i)){
        ballArray[i].dy = -ballArray[i].dy;
        playerDamage(player1);
      }
    }
  }

  function moveBullets() {
    for(var i=0; i<bulletArray.length; i++){
      bulletArray[i].xPos += bulletArray[i].dx;
      bulletArray[i].yPos += bulletArray[i].dy;
      for(var j=0; j<ballArray.length; j++) {
        if(collisionDetection(bulletArray[i],ballArray[j]).match(/^[^canvas]+/i)) {
          points += 5;
          $('#points').text("Points: " + points);
          enemykilledSound.play();
          ballArray.splice(j, 1);
        };
      }
      if (bulletArray[i].ricochet === true) {
        for (var k = 0; k < wallArray.length; k++) {
          if(collisionDetection(bulletArray[i],wallArray[k]).match(/x+/i)) {
            bulletArray[i].dx = -bulletArray[i].dx;
            bulletArray[i].timesBounced++;
          }

          if(collisionDetection(bulletArray[i],wallArray[k]).match(/y+/i)){
            bulletArray[i].dy = -bulletArray[i].dy;
            bulletArray[i].timesBounced++;
          }
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

    if (player1.currentHealth < 0 || time < 0) {
      gameReset = false;
      $('.game').hide();
      $('#hardware').hide();
      $('#score').text(points);
      $('.gameOver').fadeIn();

    }

    displayHealth(player1.currentHealth, player1.totalHealth);
    createBullet(player1);
    moveBullets();
    moveBalls();
    player1.move();


    $("#time").text("Time: " + (time/100).toFixed(0));

    if(time < 500){
      $("#time").css("color", "darkred");
    }else if(time < 3000){
      $("#time").css("color", "tomato");
    }
    time--;

  }
  setInterval(draw, 10);
});
