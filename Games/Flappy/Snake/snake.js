const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const grid = 20;
let snake = [{ x: 160, y: 160 }];
let dx = grid;
let dy = 0;
let food = randomFood();
let score = 0;

document.addEventListener("keydown", keyPress);

function keyPress(e) {
  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0; dy = -grid;
  }
  if (e.key === "ArrowDown" && dy === 0) {
    dx = 0; dy = grid;
  }
  if (e.key === "ArrowLeft" && dx === 0) {
    dx = -grid; dy = 0;
  }
  if (e.key === "ArrowRight" && dx === 0) {
    dx = grid; dy = 0;
  }
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * grid,
    y: Math.floor(Math.random() * 20) * grid
  };
}

function update() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wrap around edges
  head.x = (head.x + canvas.width) % canvas.width;
  head.y = (head.y + canvas.height) % canvas.height;

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
    score++;
  } else {
    snake.pop();
  }

  // Collision with self
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      snake = [{ x: 160, y: 160 }];
      dx = grid;
      dy = 0;
      score = 0;
    }
  }
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let s of snake) {
    ctx.fillStyle = "#00ff88";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ff88";
    ctx.fillRect(s.x, s.y, grid - 2, grid - 2);
  }

  // Draw food
  ctx.fillStyle = "#ff0066";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#ff0066";
  ctx.fillRect(food.x, food.y, grid - 2, grid - 2);
}

function loop() {
  update();
  draw();
  setTimeout(loop, 100);
}

loop();
