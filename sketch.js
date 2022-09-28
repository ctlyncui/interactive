let paddleX = 200;
let paddleY = 490;

let bg;
let bgg;

//continuous background
let bgSpeed = 1.0;
let bgY = 0;
let bggY = -1000; // 500 x 1000 in size

//assets
  //ball
let ballX = 250;
let ballY = 250;
let speedX = 0;
let speedY = 0;
let ballW = 10; //width
let hue = 0;

  //aim
let ufo;
let ufoX = 600;
let ufoY = 600;
let ufoW = 50;

//sounds
let game_over;
let ship_caught;
let space_bounce;

//keep track of hits & bounces
let ufos = 0;
let bounces = 0;

function preload(){
  //load continuous background
  bg = loadImage('assignment2_assets/starfield.png');
  bgg = loadImage('assignment2_assets/starfield.png');

  //load the ufo
  ufo = loadImage('assignment2_assets/ufo.png');

  //load the audios
  game_over = loadSound('assignment2_assets/game_over.wav');
  ship_caught = loadSound('assignment2_assets/ship_caught.wav');
  space_bounce = loadSound('assignment2_assets/space_bounce.wav');
}

function setup(){
  createCanvas(500,500);
  noStroke();
}

function draw(){
  background(0);

  //continuous background
  imageMode(CORNER);
  image(bg,0,bgY);
  image(bgg,0,bggY);

  bgY += bgSpeed;
  bggY += bgSpeed;

  if (bgY >= 1000){
    bgY = -1000;
    console.log('first bg cycle');
  }
  if (bggY >= 1000){
    bggY = -1000;
    console.log('second bg cycle');
  }

  //create the borders
  fill(128);
  rect(0,0,width,10);
  rect(0,0,10,height);
  rect(width-10,0,10,height);

  //create the paddle
  fill(255);
  rect(paddleX,paddleY,100,10);  //width 100 height 10

  if(keyIsDown(65)){ //A
    paddleX-=3;
  }
  if(keyIsDown(68)){ //D
    paddleX+=3;
  }
  
  //locking point to not go off the screen
  if(paddleX<10){
    paddleX = 10;
  }
  if(paddleX>390){
    paddleX = 390;
  }

  //aiming ufo
  imageMode(CENTER);
  image(ufo,ufoX,ufoY); //off screen when not played

  //bouncing ball
    //change color gradually
  colorMode(HSB);
  hue = (hue+2)%360;
  fill(hue,100,100,20);
    //position in the middle
  circle(ballX,ballY,ballW*2);

  colorMode(RGB);

  //move at assigned speed
  ballX += speedX;
  ballY += speedY;

  //when the ball hits walls
  if (ballX + ballW > width - 10 || ballX - ballW < 10) {
      speedX *= -1; //reverse when hits left or right border
      playSound(space_bounce);
      bounces += 1;
  } else if (ballY - ballW < 10) {
      speedY *= -1; //reverse when hits top border
      playSound(space_bounce);
      bounces += 1;
  }

  //when the ball hits the paddle, counts bounces
  if (ballX > paddleX && ballX < (paddleX + 100) && ballY + ballW > paddleY) {
      ballY = paddleY - ballW;
      playSound(space_bounce);
      speedY *= -1;
      bounces += 1;

      speedX = map(ballX, paddleX, paddleX + 100, -5, 5);

      speedX = constrain(speedX * 1.05, -5, 5);
      speedY = constrain(speedY * 1.05, -5, 5);
  }

  //when the ball hits the ufo
  if (dist(ufoX,ufoY,ballX,ballY)<ufoW+ballW){
      playSound(ship_caught);
      while(dist(ufoX,ufoY,ballX,ballY)<ufoW+ballW){
        reset();
      }
      ufos +=1;
  }

  //game over
  if (ballY - ballW > height){
    playSound(game_over);
    speedX = 0;
    speedY = 0;

    ballX = 250;
    ballY = 250;

    ufoX = 600;
    ufoY = 600;

    ufos = 0;
    bounces = 0;
  }

  //display the score on the top left corner
  fill(255);
  text(`Bounces: ${bounces} UFOs: ${ufos}`, 15, 10);
}

function playSound(song){
  song.play();
}

function mousePressed(){
  //only trigger if the game is not currently being played
  if(speedX == 0 && speedY == 0){
    speedX = Math.floor(Math.random() * 5) + 1;
    speedY = Math.floor(Math.random() * 5) + 1;
    //ufo picks a random spot when start
    reset();
  }
}

function reset(){
  ufoX = random(10+ufoW, width-10-ufoW);
  ufoY = random(10+ufoW, height-200-ufoW);
    //not overlap with border, within 200 of the bottom
}
