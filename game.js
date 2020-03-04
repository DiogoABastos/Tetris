const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const rows = 20;
const cols = 10;
const square = 20;
let board = [];
let frames = 0;
let interval;
const empty = 'black';

const I = [
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
  ],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
];

const O = [
  [
    [1, 1],
    [1, 1]
  ]
];

const L = [
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0]
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
  ],
  [
    [0, 0, 0],
    [0, 0, 1],
    [1, 1, 1]
  ],
];

const Z = [
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0]
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0]
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1]
  ],
];

const T = [
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 0, 1]
  ],
  [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0]
  ],
];

const pieces = [
  [I, 'red'],
  [O, 'green'],
  [L, 'blue'],
  [Z, 'orange'],
  [T, 'purple']
];

const score = {
  current: 0,

  draw() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${this.current}`,65 , 20);
  }
}

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, square, square);
}

for (let r = 0; r < rows; r++) {
  board[r] = [];
  for (let c = 0; c < cols; c++) {
    board[r][c] = empty;
  }
}

function drawBoard() {

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      drawSquare(c * square, r * square, board[r][c]);
    }
  }
}

function Piece(type, color) {
  this.type = type;
  this.color = color;

  this.position = 0;
  this.active = this.type[this.position];

  this.x = 4;
  this.y = 0;

  this.draw = function() {
    for (let r = 0; r < this.active.length; r++) {
      for (let c = 0; c < this.active.length; c++) {
        if (this.active[r][c]) {
          drawSquare((this.x + c) * square, (this.y + r) * square, this.color);
        }
      }
    }
  }

  this.undraw = function() {
    for (let r = 0; r < this.active.length; r++) {
      for (let c = 0; c < this.active.length; c++) {
        if (this.active[r][c]) {
          drawSquare((this.x + c) * square, (this.y + r) * square, empty);
        }
      }
    }
  }

  this.moveDown = function() {
    if (!this.collide(0, 1, this.active)) {
      this.undraw();
      this.y++;
      this.draw();
    } else {
      this.lock();
      fullRow();
      if (this.y === 0) {
        alert('Game Over!');
        clearInterval(interval);
      }
      p = randomPiece();
    }
  }

  this.moveRight = function() {
    if (!this.collide(1, 0, this.active)) {
      this.undraw();
      this.x++;
      this.draw();
    }
  }

  this.moveLeft = function() {
    if (!this.collide(-1, 0, this.active)) {
      this.undraw();
      this.x--;
      this.draw();
    }
  }

  this.change = function() {
    if (!this.collide(0, 0, this.type[(this.position + 1) % this.type.length])) {
      this.undraw();
      let newPos = (this.position + 1) % this.type.length;
      this.position = newPos;
      this.active = this.type[newPos];
      this.draw();
    }
  }

  this.lock = function() {
    for (let r = 0; r < this.active.length; r++) {
      for (let c = 0; c < this.active.length; c++) {
        if (!this.active[r][c]) {
          continue;
        }

        board[this.y + r][this.x + c] = this.color;
        drawBoard();
      }
    }
  }

  this.collide = function(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece.length; c++) {
        if (!piece[r][c]) {
          continue;
        }

        let newX = (this.x + c + x);
        let newY = (this.y + r + y);

        let kick = 0;

        if (newX < 0 || newX >= cols || newY >= rows) {
          return true;
        }

        if (newY < 0) {
          continue;
        }

        if (board[newY][newX] !== empty) {
          return true;
        }
      }
    }

    return false;
  }
}

function fullRow() {
  for (let r = 0; r < rows; r++) {
    let filled = true;
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === empty) {
        filled = false;
      }
    }
    if (filled) {
      board.splice(r, 1);
      board.unshift([empty, empty, empty, empty, empty, empty, empty, empty, empty, empty]);
      drawBoard();
      score.current += 10;
      score.draw();
    }
  }
}

window.addEventListener('keyup', change);


document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return evt.touches ||
         evt.originalEvent.touches;
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
            p.moveLeft();
        } else {
            p.moveRight();
        }
    } else {
        if ( yDiff > 0 ) {
            p.change();
        } else {
            p.moveDown();
        }
    }

    xDown = null;
    yDown = null;
};


function change(e) {
  const left = 37;
  const up = 38;
  const right = 39;
  const down = 40;

  if (e.keyCode === left) {
    p.moveLeft();
  } else if (e.keyCode === up) {
    p.change();
  } else if (e.keyCode === right) {
    p.moveRight();
  } else if (e.keyCode === down) {
    p.moveDown();
  }
}

function nFrames(frames) {
  return (frames % 50) === 0;
}

function randomPiece() {
  const random = pieces[Math.floor(Math.random() * pieces.length)];
  return new Piece(random[0], random[1]);
}

let p = randomPiece();

function playGame() {
  if (nFrames(frames)) {
    p.moveDown();
  }
  score.draw();
  frames++;
}

function game() {
  drawBoard();
  interval = setInterval(playGame, 20);
}

game();
