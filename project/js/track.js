//consts----------------------------------------------------------------------
const walls = [];

const checkpoints = [
    { x: 600, y: 100, width: 100, height: 100, checked: false },
    { x: 600, y: 400, width: 100, height: 100, checked: false },
    { x: 100, y: 400, width: 100, height: 100, checked: false },
];
let nextCheckpoint = 0;
//draw functions-----------------------------------------------------------------
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