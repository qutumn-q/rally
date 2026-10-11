//consts----------------------------------------------------------------------
const walls = [
    { x: 0, y: 0, width: WORLD_W, height: 10 },
    { x: 0, y: WORLD_H - 10, width: WORLD_W, height: 10 },
    { x: 0, y: 0, width: 10, height: WORLD_H },
    { x: WORLD_W - 10, y: 0, width: 10, height: WORLD_H },
];
const trackCheckpoints = 5;
let checkpoints = generateCheckpointPoints(trackCheckpoints);
let trackLine = [generateTrackLine(checkpoints[5])];
let nextCheckpoint = 0;
//generate
function generateCheckpointPoints(count) {
    const cx = WORLD_W / 2, cy = WORLD_H / 2;
    const points = [];
    for (let i = 0; i < count.points; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        const r = 500 + Math.random() * 300;
        points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    return points;
}
//Крок 2. Шлях між точками з поворотами. Прямі відрізки виглядають кутасто, тому між сусідніми точками додаємо проміжні, зміщені перпендикулярно. Напиши сама функцію, яка для кожної пари точок A → B додає точку посередині, зміщену на випадкову величину вбік від відрізка. Підказка: перпендикуляр до вектора (dx, dy) це (-dy, dx), нормалізований і помножений на відхилення. Потім можна повторити цей крок двічі: тоді кожен відрізок ділиться ще раз, і виходить природна звивина.
function generateTrackLine(points) {
    const line = [];
    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const n = Math.atan2(dy, dx);
        for (let j = 0; j < d; j += 10) {
            const x = a.x + j * Math.cos(n);
            const y = a.y + j * Math.sin(n);
            line.push({ x, y });
        }
    }
    return line;
}
//draw functions-----------------------------------------------------------------
function drawCheckpoints() {
    checkpoints.forEach((checkpoint) => {
        ctx.fillStyle = checkpoint.checked ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 217, 0, 1)';
        ctx.fillRect(checkpoint.x, checkpoint.y, 100, 100);
    });
};

function drawWalls() {
    walls.forEach((wall) => {
        ctx.fillStyle = 'gray';
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
};