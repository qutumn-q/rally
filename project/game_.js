'use strict';
//consts----------------------------------------------------------------------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const car = { x: canvas.width / 2, y: canvas.height / 2, angle: 0, speed: 0 };

const keys = {};
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

const walls = [
    { x: 0, y: 0, width: canvas.width, height: 10 }, // top wall
    { x: 0, y: canvas.height - 10, width: canvas.width, height: 10 }, // bottom wall
    { x: 0, y: 0, width: 10, height: canvas.height }, // left wall
    { x: canvas.width - 10, y: 0, width: 10, height: canvas.height }, // right wall
];

const checkpoints = [
    { x: 600, y: 100, width: 100, height: 100, checked: false },
    { x: 600, y: 400, width: 100, height: 100, checked: false },
    { x: 100, y: 400, width: 100, height: 100, checked: false },
];
let nextCheckpoint = 0;
//Lap times-----------------------------------------------------------------------
let startTime = null;  // коло ще не почалося
let lapTime = 0;       // фінальний час, секунди
let lapFinished = false;

//main functions----------------------------------------------------------------
function update() {
    const prevAngle = car.angle;
    if (keys['ArrowLeft']) { car.angle -= 0.05; }
    if (keys['ArrowRight']) { car.angle += 0.05; }
    if (checkCollision(car, walls)) { car.angle = prevAngle; }

    if (keys['ArrowUp']) { car.speed += 0.15; }
    if (keys['ArrowDown']) { car.speed -= 0.15; }
    car.speed *= 0.97;

    const dx = car.speed * Math.cos(car.angle);
    const dy = car.speed * Math.sin(car.angle);
    car.x += dx;
    if (checkCollision(car, walls)) { car.x -= dx; }
    car.y += dy;
    if (checkCollision(car, walls)) { car.y -= dy; }

    if (car.x < 0) car.x = canvas.width;
    if (car.x > canvas.width) car.x = 0;
    if (car.y < 0) car.y = canvas.height;
    if (car.y > canvas.height) car.y = 0;

    // Чекпоінти: тільки один блок, і тільки поки коло не завершене
    if (!lapFinished && checkCheckpoint(car, [checkpoints[nextCheckpoint]])) {
        checkpoints[nextCheckpoint].checked = true;

        if (nextCheckpoint === 0) {
            startTime = performance.now();
        }

        nextCheckpoint++;

        if (nextCheckpoint === checkpoints.length) {
            lapTime = (performance.now() - startTime) / 1000;
            lapFinished = true;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCar(car);
    drawCheckpoints();
    drawWalls();
    drawCarLights();
    drawTime();
};

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
};

loop();

//game functions---------------------------------------------------------------
function getCarCorners(car) {
    const cosA = Math.cos(car.angle);
    const sinA = Math.sin(car.angle);
    return [
        { x: car.x + (-20 * cosA - -10 * sinA), y: car.y + (-20 * sinA + -10 * cosA) }, // top-left
        { x: car.x + (20 * cosA - -10 * sinA), y: car.y + (20 * sinA + -10 * cosA) }, // top-right
        { x: car.x + (20 * cosA - 10 * sinA), y: car.y + (20 * sinA + 10 * cosA) }, // bottom-right
        { x: car.x + (-20 * cosA - 10 * sinA), y: car.y + (-20 * sinA + 10 * cosA) }, // bottom-left
    ];
};

function checkCollision(car, walls) {
    const carCorners = getCarCorners(car);
    for (const wall of walls) {
        for (const corner of carCorners) {
            if (corner.x >= wall.x && corner.x <= wall.x + wall.width &&
                corner.y >= wall.y && corner.y <= wall.y + wall.height) {
                return true;
            }
        }
    }
    return false;
}

function checkCheckpoint(car, checkpoints) {
    const carCorners = getCarCorners(car);
    for (const checkpoint of checkpoints) {
        for (const corner of carCorners) {
            if (corner.x >= checkpoint.x && corner.x <= checkpoint.x + checkpoint.width &&
                corner.y >= checkpoint.y && corner.y <= checkpoint.y + checkpoint.height) {
                return true;
            }
        }
    }
    return false;
}
//draw functions---------------------------------------------------------------
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

function drawCheckpoints() {
    checkpoints.forEach((checkpoint) => {
        ctx.fillStyle = checkpoint.checked ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 217, 0, 1)';
        ctx.fillRect(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
    });
};

function drawWalls() {
    walls.forEach((wall) => {
        ctx.fillStyle = 'gray';
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
};

function drawCarLights() {
    ctx.fillStyle = 'yellow';
    for (const p of getCarCorners(car)) {
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }   
}

function drawTime() {
    ctx.fillStyle = 'white';
    ctx.font = '20px sans-serif';
    let text;
    if (startTime === null) {
        text = 'Time: 0.00';
    } else if (lapFinished) {
        text = 'Lap: ' + lapTime.toFixed(2);
    } else {
        text = 'Time: ' + ((performance.now() - startTime) / 1000).toFixed(2);
    }
    ctx.fillText(text, 10, 30);
}