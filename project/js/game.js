//Constants-----------------------------------------------------------------------
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
//draw functions----------------------------------------------------------------
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