const checkpointsCount = 10;
let nextCheckpoint = 0;

let walls = [
    { x: 0, y: 0, width: WORLD_W, height: 10 },
    { x: 0, y: WORLD_H - 10, width: WORLD_W, height: 10 },
    { x: 0, y: 0, width: 10, height: WORLD_H },
    { x: WORLD_W - 10, y: 0, width: 10, height: WORLD_H },
];


function generateChekpoints(count) {
    const checkpoints = [];
    const cx = WORLD_W / 2; const cy = WORLD_H / 2;
    for (let i = 0; i < count; i++) {
        const angle  = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const r = 500 + Math.random() * 300;
        checkpoints.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), width: 10, height: 10 });
    }
    return checkpoints;
}
let precheckpoints = generateChekpoints(checkpointsCount);

function generateTrackLine(){
    const line = [];
    for (let i = 0; i < precheckpoints.length; i++) {
        const a = precheckpoints[i]; const b = precheckpoints[(i+1) % precheckpoints.length];
        const dx = b.x - a.x; const dy = b.y - a.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        const nx = -dy/d; const ny = dx/d;
        const offset = (Math.random() -0.5) * 80;
        const mx = (a.x + b.x)/2 + nx * offset;
        const my = (a.y + b.y)/2 + ny * offset;
        line.push({ x: a.x, y: a.y });
        line.push({ x: mx, y: my });
    }
    line.push({ x: line[0].x, y: line[0].y });  
    return line;
}
let trackLine = generateTrackLine();

function pushGameCheckpoints(){
    const checkpoints = [];
    for (let i = 0; i < precheckpoints.length; i++) {
        const x = precheckpoints[i].x; const y = precheckpoints[i].y;
        checkpoints.push({ x: x - 25, y: y - 25, width: 50, height: 50, checked: false });
    }
    return checkpoints;
}
const checkpoints = pushGameCheckpoints();

function drawline() { 
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    for (let i = 0; i < trackLine.length; i++) {
        const p = trackLine[i];
        if (i === 0) { ctx.moveTo(p.x, p.y); }
        else { ctx.lineTo(p.x, p.y); }
    }
    ctx.stroke();
}
function drawCheckpoints() {
    checkpoints.forEach((checkpoint) => {
        ctx.fillStyle = checkpoint.checked ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 217, 0, 1)';
        ctx.fillRect(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
    });
};
function drawWalls() {
    ctx.fillStyle = 'grey';
    for (const wall of walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
}