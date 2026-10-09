//consts----------------------------------------------------------------------
let walls = [];
let checkpoints = [];
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