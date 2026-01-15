const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let frames = 0;
const DEGREE = Math.PI / 180;

const sprite = new Image();
sprite.src = "https://i.imgur.com/5bT3Z5Z.png"; // bird + pipes sprite sheet

const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2
};

canvas.addEventListener("click", () => {
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      break;
    case state.game:
      bird.flap();
      break;
    case state.over:
      pipes.reset();
      bird.reset();
      state.current = state.getReady;
      break;
  }
});

const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  frame: 0,
  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, 276, 112, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  },

  flap() {
    this.speed = -this.jump;
  },

  update() {
    if (state.current === state.getReady) {
      this.y = 150;
      this.rotation = 0;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;

      if (this.speed >= this.jump) {
        this.rotation = 90 * DEGREE;
      } else {
        this.rotation = -25 * DEGREE;
      }
    }
  },

  reset() {
    this.speed = 0;
    this.y = 150;
  }
};

const pipes = {
  position: [],
  top: { sX: 553, sY: 0 },
  bottom: { sX: 502, sY: 0 },
  w: 53,
  h: 400,
  gap: 120,
  dx: 2,

  draw() {
    for (let p of this.position) {
      let topY = p.y;
      let bottomY = p.y + this.h + this.gap;

      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topY, this.w, this.h);
      ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomY, this.w, this.h);
    }
  },

  update() {
    if (state.current !== state.game) return;

    if (frames % 100 === 0) {
      this.position.push({
        x: canvas.width,
        y: -Math.floor(Math.random() * 200) - 100
      });
    }

    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.x -= this.dx;

      if (p.x + this.w <= 0) {
        this.position.shift();
      }
    }
  },

  reset() {
    this.position = [];
  }
};

function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  pipes.draw();
  bird.draw();
}

function update() {
  bird.update();
  pipes.update();
}

function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

loop();
