let canvas = document.getElementById("pongGame");
canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let context = canvas.getContext("2d");

let paddleWidth = 75, paddleHeight = 15;
let player = { x: canvas.width / 2 - paddleWidth / 2, y: canvas.height - paddleHeight, width: paddleWidth, height: paddleHeight, dx: 5};

let ball = { x: canvas.width / 2, y: player.y - 10, radius: 10, speed: 2, dx: 5, dy: -5 };

let isGameOver = false;

function drawRestartButton() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Game Over! Click to restart", canvas.width/2, canvas.height/2);
}

let score = 0;

function drawScore() {
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: "+score, 8, 20);
}

let brickRowCount = 7;
let brickColumnCount = 50;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
function initBricks() {
  for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}
initBricks();

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "#0095DD";
                context.fill();
                context.closePath();
            }
        }
    }
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(ball.x > b.x && ball.x < b.x+brickWidth && ball.y > b.y && ball.y < b.y+brickHeight) {
                    ball.dy *= -1;
                    b.status = 0;
                    score++;
                }
            }
        }
    }
}

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

let trail = [];

function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
    
    trail.push({x: x, y: y});
    
    if (trail.length > 20) {
        trail.shift();
    }
    
    for (let i = 0; i < trail.length; i++) {
        context.fillStyle = 'rgba(211, 211, 211, ' + (i / trail.length) + ')';
        context.beginPath();
        context.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    }
}

function movePaddle() {
    if(rightArrow && player.x + player.width < canvas.width) {
        player.x += player.dx;
    } else if(leftArrow && player.x > 0) {
        player.x -= player.dx;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if(ball.y + ball.radius > canvas.height) {
        isGameOver = true;

        ball.x = canvas.width / 2;
        ball.y = player.y - ball.radius;
        ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = -5;
    }

    if(ball.y - ball.radius < 0) {
        ball.dy *= -1; 
    }
    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1; 
    }

    if(ball.y + ball.radius > player.y && ball.x > player.x && ball.x < player.x + player.width) {
        ball.dy *= -1;
    }
}

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(player.x, player.y, player.width, player.height, '#7FFF00');
    drawCircle(ball.x, ball.y, ball.radius, '#D3D3D3');
    drawBricks();
    drawScore();
    collisionDetection();

    if (isGameOver) {
        drawRestartButton();
        return;
    }

    movePaddle();
    moveBall();
}

canvas.addEventListener('click', function() {
    if (isGameOver) {
      isGameOver = false;
      ball.x = canvas.width / 2;
      ball.y = player.y - ball.radius;
      ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
      ball.dy = -4;
      score = 0;
      initBricks();
    }
  });

setInterval(update, 1000/60);

let rightArrow = false, leftArrow = false;
document.addEventListener("keydown", function(event) {
    switch(event.keyCode) {
        case 37:
            leftArrow = true;
            break;
        case 39:
            rightArrow = true;
            break;
    }
});
document.addEventListener("keyup", function(event) {
    switch(event.keyCode) {
        case 37:
            leftArrow = false;
            break;
        case 39:
            rightArrow = false;
            break;
    }
});
