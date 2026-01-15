const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const paddleWidth = 10;
const paddleHeight = 80;

const player = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  score: 0
};

const ai = {
  x: canvas.width - paddleWidth - 10,
  y: canvas.height / 2 - paddleHeight / 2,
  score: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  speed: 5,
  dx: 5,
  dy: 5
};

document.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  player.y = e.clientY - rect.top - paddleHeight / 2;
});

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.shadowBlur = 15;
  ctx.shadowColor = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -ball.dx;
  ball.speed = 5;
}

function update() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // Player paddle collision
  if (
    ball.x - ball.radius < player.x + paddleWidth &&
    ball.y > player.y &&
    ball.y < player.y + paddleHeight
  ) {
    ball.dx = -ball.dx;
    ball.speed += 0.2;
  }

  // AI paddle collision
  if (
    ball.x + ball.radius > ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + paddleHeight
  ) {
    ball.dx = -ball.dx;
    ball.speed += 0.2;
  }

  // Score update
  if (ball.x - ball.radius < 0) {
    ai.score++;
    resetBall();
  }

  if (ball.x + ball.radius > canvas.width) {
    player.score++;
    resetBall();
  }

  // AI movement
  ai.y += (ball.y - (ai.y + paddleHeight / 2)) * 0.07;
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawRect(player.x, player.y, paddleWidth, paddleHeight, "#00ff88");
  drawRect(ai.x, ai.y, paddleWidth, paddleHeight, "#ff0066");

  drawBall(ball.x, ball.y, ball.radius, "#00e1ff");

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText(player.score, canvas.width / 4, 30);
  ctx.fillText(ai.score, (canvas.width / 4) * 3, 30);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
