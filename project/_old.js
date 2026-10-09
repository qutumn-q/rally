'use strict';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const car = {
    x: 100,
    y: 500,
    angle: 0,
    speed: 0,
};

const checkpoints = [
    { x: 600, y: 100, width: 100, height: 100 },
    { x: 600, y: 400, width: 100, height: 100 },
    { x: 100, y: 400, width: 100, height: 100 },
];

function LapTime() {
    const startTime = Date.now();
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = elapsedTime % 1000;
    return `${seconds}.${milliseconds}`;
}

let nextCheckpoint = 0;

const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

const walls = [
    { x: 0, y: 0, width: canvas.width, height: 10 }, // top wall
    { x: 0, y: canvas.height - 10, width: canvas.width, height: 10 }, // bottom wall
    { x: 0, y: 0, width: 10, height: canvas.height }, // left wall
    { x: canvas.width - 10, y: 0, width: 10, height: canvas.height }, // right wall
];

function drawCar(car) {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.fillStyle = 'crimson';
    ctx.fillRect(-20, -10, 40, 20);
    ctx.fillStyle = 'white';
    ctx.fillRect(8, -8, 8, 16);
    ctx.restore();
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCar(car);
    walls.forEach(wall => {
        ctx.fillStyle = 'gray';
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });

    checkpoints.forEach((checkpoint, index) => {
        ctx.fillStyle = index === nextCheckpoint ? 'green' : 'red';
        ctx.fillRect(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
    });

    if (checkCheckpoint(car, [checkpoints[nextCheckpoint]])) {
        nextCheckpoint = (nextCheckpoint + 1) % checkpoints.length;
    }

    ctx.fillStyle = 'yellow';
    for (const p of getCarCorners(car)) {
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    ctx.fillStyle = 'white';
    ctx.font = '20px Sans-serif';
    ctx.fillText('Time:' + LapTime(), 10, 30);
}
}

function getCarCorners(car) {
    const cosA = Math.cos(car.angle);
    const sinA = Math.sin(car.angle);
    return [
        { x: car.x + (-20 * cosA - -10 * sinA), y: car.y + (-20 * sinA + -10 * cosA) }, // top-left
        { x: car.x + (20 * cosA - -10 * sinA), y: car.y + (20 * sinA + -10 * cosA) }, // top-right
        { x: car.x + (20 * cosA - 10 * sinA), y: car.y + (20 * sinA + 10 * cosA) }, // bottom-right
        { x: car.x + (-20 * cosA - 10 * sinA), y: car.y + (-20 * sinA + 10 * cosA) }, // bottom-left
    ];
}

function checkCheckpoint(car, checkpoints) {
    const corners = getCarCorners(car);

    for (const checkpoint of checkpoints) {
        for (const p of corners) {
            if (p.x > checkpoint.x && p.x < checkpoint.x + checkpoint.width &&
                p.y > checkpoint.y && p.y < checkpoint.y + checkpoint.height) {
                return true;
            }
        }
    }
    return false;
}

function checkCollision(car, walls) {
    const corners = getCarCorners(car);

    for (const wall of walls) {
        for (const p of corners) {
            if (p.x > wall.x && p.x < wall.x + wall.width &&
                p.y > wall.y && p.y < wall.y + wall.height) {
                return true;
            }
        }
    }
    return false;
}

function update() {
    const prevAngle = car.angle;

    if (keys['ArrowLeft']) car.angle -= 0.05;
    if (keys['ArrowRight']) car.angle += 0.05;

    // якщо поворот призвів до зіткнення, скасувати його
    if (checkCollision(car, walls)) {
        car.angle = prevAngle;
    }

    if (keys['ArrowUp']) car.speed += 0.15;
    if (keys['ArrowDown']) car.speed -= 0.15;
    car.speed *= 0.97;

    const dx = Math.cos(car.angle) * car.speed;
    const dy = Math.sin(car.angle) * car.speed;

    car.x += dx;
    if (checkCollision(car, walls)) {
        car.x -= dx;
        car.speed *= -0.5;
    }

    car.y += dy;
    if (checkCollision(car, walls)) {
        car.y -= dy;
        car.speed *= -0.5;
    }

    if (car.x < 0) car.x = canvas.width;
    if (car.x > canvas.width) car.x = 0;
    if (car.y < 0) car.y = canvas.height;
    if (car.y > canvas.height) car.y = 0;
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();