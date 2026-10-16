//Constants-----------------------------------------------------------------------
let startTime = null;  // коло ще не почалося
let lapTime = 0;       // фінальний час, секунди
let lapFinished = false;
//main functions----------------------------------------------------------------
function update() {
    const prevAngle = car.angle;
    if (car.speed != 0) {
        if (keys['ArrowLeft']) { car.angle -= 0.05 * (car.speed/5); }
        if (keys['ArrowRight']) { car.angle += 0.05 * (car.speed/5); }
        if (checkCollision(car, wallSegments)) { car.angle = prevAngle; }
    }

    if (keys['ArrowUp']) { car.speed += 0.15; }
    if (keys['ArrowDown']) { car.speed -= 0.15; }
    car.speed *= 0.97;

    const dx = car.speed * Math.cos(car.angle);
    const dy = car.speed * Math.sin(car.angle);
    car.x += dx;
    if (checkCollision(car, wallSegments)) { car.x -= dx; }
    car.y += dy;
    if (checkCollision(car, wallSegments)) { car.y -= dy; }
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
    camera.x = car.x - canvas.width / 2;
    camera.y = car.y - canvas.height / 2;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-car.angle - Math.PI / 2);
    ctx.translate(-car.x, -car.y);
    drawWallSegments();
    drawline();
    drawCheckpoints();

    drawCarLights();
    drawCar(car);

    ctx.restore();
    drawTime();
};

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
};
startup();
car.x = trackLine[0].x;
car.y = trackLine[0].y;
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