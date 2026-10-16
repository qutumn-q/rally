//game functions---------------------------------------------------------------
function getCarCorners(car) {
    const cosA = Math.cos(car.angle);
    const sinA = Math.sin(car.angle);
    return [
        { x: car.x + (-20 * cosA - -10 * sinA), y: car.y + (-20 * sinA + -10 * cosA) }, 
        { x: car.x + (20 * cosA - -10 * sinA), y: car.y + (20 * sinA + -10 * cosA) }, 
        { x: car.x + (20 * cosA - 10 * sinA), y: car.y + (20 * sinA + 10 * cosA) }, 
        { x: car.x + (-20 * cosA - 10 * sinA), y: car.y + (-20 * sinA + 10 * cosA) }, 
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



function drawCarLights() {
    ctx.fillStyle = 'yellow';
    for (const p of getCarCorners(car)) {
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }   
}