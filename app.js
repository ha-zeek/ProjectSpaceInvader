const grid = document.querySelector(".grid");
const displayResults = document.querySelector(".results");
let currentShipIndex = 350; //shooter default index(location)
let width = 20; //the width of the grid = 20 squares
let direction = 1; // 1 is right || -1 is left //number is equal to the amount of square.
let aliensRemoved = []; // empty array to store the removed aliens
let results = 0; //base score for killing/deleting aliens

// ADDING SQUARES INTO THE GRID // MAKING ARRAYS OUT OF THEM & ASSIGNING THEM //

for (let i = 0; i < 400; i++) {
  const square = document.createElement("div"); // 625 squares because 25x25 squares inside 500x500 grid
  grid.appendChild(square); // adding squares (div) inside the grid div
}

const squares = Array.from(document.querySelectorAll(".grid div")); // creating an array from the squares in the grid. & then selecting & assign them.

// MAKING ALIENS FLEET BY USING ARRAYS //

const alienFleet = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 60, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 70, 71,
]; // To choose which array would like to be occupied by the alien. 4 rows.

// CREATING A FUNCTION TO ADD/DRAW/REMOVE THE ALIENS INTO THE SQUARES ARRAY //
function draw() {
  for (let i = 0; i < alienFleet.length; i++)
    if (!aliensRemoved.includes(i)) {
      // this was later included so that it wont draw aliens that has been shot/removed //
      squares[alienFleet[i]].classList.add("invader");
    }
} // adding into the squares array, passing through the alienInvaders array & adding a class.

draw();

function remove() {
  for (let i = 0; i < alienFleet.length; i++)
    squares[alienFleet[i]].classList.remove("invader");
} // function to remove alien fleets

// MAKING AN ARRAY FOR EARTH ATMOSPHERE SO THE ALIEN CANT CROSS //

const earthAtmos = [
  380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394,
  395, 396, 397, 398, 399,
];
function earth() {
  for (let i = 0; i < earthAtmos.length; i++) {
    squares[earthAtmos[i]].classList.add("earth");
  }
}
earth();

// MAKING THE SPACESHIP & MAKING IT MOVE //
squares[currentShipIndex].classList.add("ship");

// Moving ship via arrow keys (event)
function moveShip(evt) {
  squares[currentShipIndex].classList.remove("ship"); // remove ship
  switch (evt.key) {
    case "ArrowLeft":
      if (currentShipIndex % width !== 0) currentShipIndex -= 1; //if the ship not located at the left edge, ship can move to the left.
      break;
    case "ArrowRight":
      if (currentShipIndex % width < width - 1) currentShipIndex += 1; // checking if shooter in right edge, so shooter can move
      break;
  }
  squares[currentShipIndex].classList.add("ship"); // add shooter again after moving
}

document.addEventListener("keydown", moveShip);

// MAKING ALIEN MOVEMENTS //
let goingRight = true; //going right as default
function moveInvaders() {
  const leftEdge = alienFleet[0] % width === 0;
  const rightEdge = alienFleet[alienFleet.length - 1] % width === width - 1; // defining the left & right edges
  remove(); // remove aliens

  if (rightEdge && goingRight) {
    //if alien at the right edge AND moving to the right. it moves down & left
    for (let i = 0; i < alienFleet.length; i++) {
      alienFleet[i] += width + 1; // goes down
      direction = -1; // moving to the left 1 by 1
      goingRight = false; // to the left
    }
  }
  if (leftEdge && !goingRight) {
    //if alien at the left edge AND moving to the left. it moves down & right
    for (let i = 0; i < alienFleet.length; i++) {
      alienFleet[i] += width - 1; // -1 so it stays to the leftedge after moving down
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienFleet.length; i++) {
    alienFleet[i] += direction;
  } // looping in each invader to assign in diff position

  draw(); // add aliens again

  // GAME ENDING SCENARIOS //
  if (squares[currentShipIndex].classList.contains("invader", "ship")) {
    // if the square in which shooter is located contains both shooter and invader, game over
    displayResults.innerHTML = "GAME OVER :( Try Again!";
    clearInterval(spaceInvaders);
    gameOver();
  }

  for (i = 0; i < earthAtmos.length; i++)
    if (squares[earthAtmos[i]].classList.contains("invader", "earth")) {
      displayResults.innerHTML = "GAME OVER :( Try Again!";
      clearInterval(spaceInvaders);
      gameOver();
    }

  for (let i = 0; i < alienFleet.length; i++)
    if (alienFleet[i] == squares.length) {
      displayResults.innerHTML = "GAME OVER :( Try Again!";
      clearInterval(spaceInvaders);
      gameOver();
    }

  if (aliensRemoved.length === alienFleet.length) {
    displayResults.innerHTML = `YOU WON! Your Score is ${results}`;
    clearInterval(spaceInvaders);
    gameWon();
  }
}

function start() {
  spaceInvaders = setInterval(moveInvaders, 500);
}
// for the aliens to move every 500ms

// SHOOTING MECHANISM //

function shoot(evt) {
  let laserId; // bullet travel 100ms
  let currentLaserIndex = currentShipIndex; // laser will be cmg from shooter, hence same index/location
  function moveLaser() {
    if (currentLaserIndex < width) {
      squares[currentLaserIndex].classList.remove("laser");
      return;
    } else {
      squares[currentLaserIndex].classList.remove("laser");
      currentLaserIndex -= width; //to shoot up
      squares[currentLaserIndex].classList.add("laser");
    }

    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom"); // if laser hits alien boom happens

      setTimeout(
        () => squares[currentLaserIndex].classList.remove("boom"),
        300
      ); // to remove boom after hitting alien
      clearInterval(laserId);

      // Removing alien permanently after laser hits it. //
      const alienRemoved = alienFleet.indexOf(currentLaserIndex); //the square of which the alien array and laser resides together
      aliensRemoved.push(alienRemoved); // removing from the array & store it
      results++;
      displayResults.innerHTML = "Score: " + results;
    }
  }

  switch (evt.key) {
    case "ArrowUp":
      laserId = setInterval(moveLaser, 100);
  } // event key. press arrow up = shoots laser
}

document.addEventListener("keydown", shoot);

// MAKING START GAME & GAMEOVER SCREEN/FUNCTIONS //
function startGame() {
  let startDiv = document.getElementById("start");
  let gameDiv = document.querySelector(".grid");
  let gameWon = document.getElementById("game-won");
  let gameOver = document.getElementById("game-over");
  startDiv.style.display = "none";
  gameDiv.style.display = "flex";
  gameWon.style.display = "none";
  gameOver.style.display = "none";
  start();
}

function gameWon() {
  let startDiv = document.getElementById("start");
  let gameDiv = document.querySelector(".grid");
  let gameWon = document.getElementById("game-won");
  let gameOver = document.getElementById("game-over");
  startDiv.style.display = "none";
  gameDiv.style.display = "none";
  gameWon.style.display = "block";
  gameOver.style.display = "none";
}

function gameOver() {
  let startDiv = document.getElementById("start");
  let gameDiv = document.querySelector(".grid");
  let gameWon = document.getElementById("game-won");
  let gameOver = document.getElementById("game-over");
  startDiv.style.display = "none";
  gameDiv.style.display = "none";
  gameWon.style.display = "none";
  gameOver.style.display = "block";
}

function restartGame() {
  location.reload();
}
