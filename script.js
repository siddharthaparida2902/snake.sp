//Defining the HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const dashboard = document.getElementById("dashboard");
const score = document.getElementById("score");
const highScore = document.getElementById("highScore");

//Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let highscore = 0;
let food = GenerateFood();
let direction = "right";
let gameInterval;
let gameSpeed = 200;
let gameStarted = false;

//Drawing the board
function DrawBoard() {
  board.innerHTML = "";
  DrawSnake();
  DrawFood();
  // UpdateScores();
}

//Drawing the game elements (food & snake)
function DrawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

//Create the snake
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

//Set position of snake
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

//testing the draw function
// DrawBoard();

//Creating the food
function DrawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

//Generate food at random positions
function GenerateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * 20) + 1;
  return { x, y };
}

// Moving the snake
function SnakeMove() {
  //shallow copying the array
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
  }

  //Adding the head for snake
  snake.unshift(head);

  //for snake growing while eating food
  if (head.x === food.x && head.y === food.y) {
    food = GenerateFood();
    IncreaseGameSpeed();
    clearInterval(gameInterval); //Clearing the past interval
    gameInterval = setInterval(() => {
      SnakeMove();
      CheckCollision();
      DrawBoard();
    }, gameSpeed);
  } else {
    //Removal of snake div from the end --> to create an illusion for the snake to move forward
    snake.pop();
  }
}

//Increasing the game speed as the snake gets bigger
function IncreaseGameSpeed() {
  // console.log(gameSpeed);
  if (gameSpeed > 150) {
    gameSpeed -= 5;
  } else if (gameSpeed > 100) {
    gameSpeed -= 3;
  } else if (gameSpeed > 50) {
    gameSpeed -= 2;
  } else if (gameSpeed > 25) {
    gameSpeed -= 1;
  }
}

function CheckCollision() {
  const head = snake[0];
  //Checking collision with the wall
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    ResetGame();
  }

  //Checking snake body collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      ResetGame();
    }
  }
}

//Updating scores
function UpdateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

//Updating highscore
function UpdateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highscore) {
    highscore = currentScore;
    highScore.textContent = highscore.toString().padStart(3, "0");
  }
  highScore.style.display = "block";
}

//Testing snake moving
// setInterval(() => {
//   //Move first
//   SnakeMove();
//   //Show the update on the board
//   DrawBoard();
// }, 200)

//Start game function
function GameStart() {
  gameStarted = true; //keeping a track of running game
  instructionText.style.display = "none";
  dashboard.style.display = "none";
  gameInterval = setInterval(() => {
    SnakeMove();
    CheckCollision();
    DrawBoard();
  }, gameSpeed);
}

//Reseting game after 'CheckCollision = true'
function ResetGame() {
  UpdateHighScore();
  StopGame();
  snake = [{ x: 10, y: 10 }];
  food = GenerateFood();
  direction = "right";
  gameSpeed = 200;
  UpdateScore();
}

//Stoping the game
function StopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  dashboard.style.display = "block";
}

// KeyPress Event function
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "space") ||
    (!gameStarted && event.key === " ")
  ) {
    GameStart();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowRight":
        direction = "right";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);
