/* globals
    createCanvas, background, point, keyIsDown
    stroke, width, height, strokeWeight
    UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, get,
    fill, rect, textSize, textAlign, image, text, loadImage, 
    CENTER, collidePointRect, collideLineRect, colorMode, 
    HSB, createButton, frameRate, createElement, loadSound, soundFormats, mouseX, mouseY, stokeWeight
    // Custom Classes
    Bike,
*/

let bikes = [];
let gameOver = true;
let rate;
let button;
let title;
let teleport;
let crash;
let tpSound;
let backgroundMusic;
let music;
let sound;
let musicOff;
let slash;
let soundOff;
let buttonSound;
let noTeleports;

function preload() {
  title = loadImage(
    "https://cdn.glitch.com/fafe8181-f2a8-472d-9f67-a537c4bcff6d%2Ftitle.png?v=1596054805359"
  );
  music = loadImage(
    "https://cdn.glitch.com/fafe8181-f2a8-472d-9f67-a537c4bcff6d%2Fmusic.png?v=1596046245016"
  );
  sound = loadImage(
    "https://cdn.glitch.com/fafe8181-f2a8-472d-9f67-a537c4bcff6d%2Fsound-on-solid.png?v=1596046249712"
  );
  slash = loadImage(
    "https://cdn.glitch.com/fafe8181-f2a8-472d-9f67-a537c4bcff6d%2Fslash.png?v=1596050112318"
  );
  teleport = loadImage(
    "https://cdn.glitch.com/fafe8181-f2a8-472d-9f67-a537c4bcff6d%2Fthumbnails%2Fteleport.png?1595958766095"
  );
  crash = loadSound(
    "https://cdn.glitch.com/71ff5187-838d-4eed-b035-7d27ffd20c6c%2Fcrash.wav?v=1596044627809"
  );
  noTeleports = loadSound(
    "https://cdn.glitch.com/fafe8181-f2a8-472d-9f67-a537c4bcff6d%2Fnoammo.wav?v=1596045212715"
  );
  tpSound = loadSound(
    "https://cdn.glitch.com/71ff5187-838d-4eed-b035-7d27ffd20c6c%2Fteleport.mp3?v=1596042910075"
  );
  backgroundMusic = loadSound(
    "https://cdn.glitch.com/71ff5187-838d-4eed-b035-7d27ffd20c6c%2Fbackground%20music.wav?v=1596046936527"
  );
  buttonSound = loadSound(
    "https://cdn.glitch.com/fafe8181-f2a8-472d-9f67-a537c4bcff6d%2Fbutton.wav?v=1596053663530"
  );
}

function setup() {
  musicOff = false;
  soundOff = false;
  backgroundMusic.setVolume(0.15);
  backgroundMusic.loop();
  noTeleports.setVolume(0.2);
  buttonSound.setVolume(0.8);
  crash.setVolume(0.9);
  colorMode(HSB);
  createCanvas(650, 500);
  background(185, 60, 90);
  textSize(24);
  textAlign(CENTER);

  fill(0);
  rect(30, 75, 400, 400);
  bikes = [
    new Bike(45, 90, "RIGHT", [180, 95, 95]),
    new Bike(width - 235, height - 40, "LEFT", [30, 95, 95])
  ];

  button = createButton("Start");
  button.position(200, 275);
  button.mousePressed(() => {
    gameOver = false;
    buttonSound.play();
    fill(0);
    rect(30, 75, 400, 400);
    rate = 60;
    bikes.forEach(bike => bike.reset());
    button.hide();
  });
  image(title, 25, 5, 405, 70);
  image(music, 550, 25, 30, 30);
  image(sound, 600, 25, 30, 30);
}

function draw() {
  displayInfo();
  if (gameOver == true) return;

  frameRate(rate);

  checkWin();

  bikes.forEach(bike => bike.draw());
  bikes.forEach(bike => bike.update());
}

function checkWin() {
  if (bikes[0].notBlack() && bikes[1].notBlack()) {
    crash.play();
    fill(255);
    text("GAME OVER", 220, 230);
    text("Draw", 220, 260);
    gameOver = true;
    button.show();
    return;
  }

  if (bikes[0].notBlack() == true) {
    crash.play();
    fill(255);
    text("GAME OVER", 220, 230);
    text("Bike 2 Wins", 220, 260);
    gameOver = true;
    button.show();
    return;
  }

  if (bikes[1].notBlack() == true) {
    crash.play();
    fill(255);
    text("GAME OVER", 220, 230);
    text("Bike 1 Wins", 220, 260);
    gameOver = true;
    button.show();
    return;
  }
}

function displayInfo() {
  fill(255);
  rect(440, 75, 200, 400);

  fill(0);
  text("PLAYER 1:", 510, 100);
  for (let i = 0; i < bikes[0].numberOfTeleports; i++) {
    image(teleport, 450 + i * 60, 130, 40, 50);
  }

  text("PLAYER 2:", 510, 300);

  for (let i = 0; i < bikes[1].numberOfTeleports; i++) {
    image(teleport, 450 + i * 60, 330, 40, 50);
  }
}

function keyPressed(e) {
  if (keyIsDown(87)) {
    bikes[0].setDir("UP");
  } else if (keyIsDown(83)) {
    bikes[0].setDir("DOWN");
  } else if (keyIsDown(65)) {
    bikes[0].setDir("LEFT");
  } else if (keyIsDown(68)) {
    bikes[0].setDir("RIGHT");
  }

  // SPACEBAR Key
  if (keyIsDown(32)) {
    if (bikes[0].numberOfTeleports > 0) {
      tpSound.play();
    } else {
      noTeleports.play();
    }
    bikes[0].teleport();
  }

  // SHIFT Key
  if (keyIsDown(16)) {
    if (bikes[1].numberOfTeleports > 0) {
      tpSound.play();
    } else {
      noTeleports.play();
    }
    bikes[1].teleport();
  }

  if (keyIsDown(13)) {
    // ENTER key
    rate = 10;
    setTimeout(() => {
      rate = 60;
    }, 5000);
  }

  if (keyIsDown(UP_ARROW)) {
    bikes[1].setDir("UP");
  } else if (keyIsDown(DOWN_ARROW)) {
    bikes[1].setDir("DOWN");
  } else if (keyIsDown(LEFT_ARROW)) {
    bikes[1].setDir("LEFT");
  } else if (keyIsDown(RIGHT_ARROW)) {
    bikes[1].setDir("RIGHT");
  }
}

function mousePressed() {
  if (
    musicOff == false &&
    mouseX > 550 &&
    mouseX < 580 &&
    mouseY > 25 &&
    mouseY < 55
  ) {
    buttonSound.play();
    backgroundMusic.setVolume(0);
    musicOff = true;
    image(slash, 555, 17, 27, 45);
    image(music, 550, 25, 30, 30);
  } else if (
    musicOff == true &&
    mouseX > 550 &&
    mouseX < 580 &&
    mouseY > 25 &&
    mouseY < 55
  ) {
    buttonSound.play();
    backgroundMusic.setVolume(0.15);
    musicOff = false;
    fill(185, 60, 90);
    strokeWeight(0);
    rect(550, 17, 34, 45);
    image(music, 550, 25, 30, 30);
  }

  if (
    soundOff == false &&
    mouseX > 600 &&
    mouseX < 630 &&
    mouseY > 25 &&
    mouseY < 55
  ) {
    buttonSound.play();
    tpSound.setVolume(0);
    crash.setVolume(0);
    noTeleports.setVolume(0);
    buttonSound.setVolume(0);
    soundOff = true;
    image(slash, 602, 17, 27, 45);
    image(sound, 600, 25, 30, 30);
  } else if (
    soundOff == true &&
    mouseX > 600 &&
    mouseX < 630 &&
    mouseY > 25 &&
    mouseY < 55
  ) {
    buttonSound.play();
    crash.setVolume(0.8);
    tpSound.setVolume(1);
    noTeleports.setVolume(0.2);
    buttonSound.setVolume(0.8);
    soundOff = false;
    fill(185, 60, 90);
    strokeWeight(0);
    rect(600, 17, 34, 45);
    image(sound, 600, 25, 30, 30);
  }
}
