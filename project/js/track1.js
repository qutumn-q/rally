let nextCheckpoint = 0;
let trackLine = generateTurtleTrack(100);
let checkpoints = pushGameCheckpoints();

let walls = [
    { x: 0, y: 0, width: WORLD_W, height: 10 },
    { x: 0, y: WORLD_H - 10, width: WORLD_W, height: 10 },
    { x: 0, y: 0, width: 10, height: WORLD_H },
    { x: WORLD_W - 10, y: 0, width: 10, height: WORLD_H },
];

function generateTurtleTrack(steps) {
    const points = [];
    const stepLength = 100;
    let heading = 0;

    const startX = 400 + Math.random() * (WORLD_W - 800);
    const startY = 400 + Math.random() * (WORLD_H - 800);
    points.push({ x: startX, y: startY });

    const finishX = WORLD_W / 2;
    const finishY = WORLD_H / 2;

    let attempts = 0;
    let made = 0;

    while (made < steps && attempts < 20000) {
        attempts++;

        const last = points[points.length - 1];
        const prevX = last.x;
        const prevY = last.y;

        if (prevX < 300 || prevX > WORLD_W - 300 || prevY < 300 || prevY > WORLD_H - 300) {
            const targetAngle = Math.atan2(finishY - prevY, finishX - prevX);
            let diff = targetAngle - heading;
            while (diff > Math.PI) diff -= 2 * Math.PI;
            while (diff < -Math.PI) diff += 2 * Math.PI;
            heading += diff * 0.3;
        } else {
            heading += 0.5 - Math.random() * 1.0;
        }

        const result = findNextPoint(last, heading, stepLength, points);
        if (result !== null) {
            points.push(result.point);
            heading = result.heading;
            made++;
        }
    }

    console.log('спроб:', attempts, 'зроблено кроків:', made, 'точок:', points.length);
    return points;
}

function findNextPoint(last, heading, stepLength, points) {
    const valid = [];
    for (let k = 0; k < 15; k++) {
        const candidate = heading + (k - 7) * 0.12;
        const newX = last.x + Math.cos(candidate) * stepLength;
        const newY = last.y + Math.sin(candidate) * stepLength;
        const newPoint = { x: newX, y: newY };

        if (newX < 0 || newX > WORLD_W || newY < 0 || newY > WORLD_H) continue;
        if (crossesOld(last, newPoint, points)) continue;
        if (tooCloseToOld(newPoint, points)) continue;

        valid.push({ point: newPoint, heading: candidate });
    }
    if (valid.length === 0) return null;
    return valid[Math.floor(Math.random() * valid.length)];
}
// Перевірка: чи перетинає відрізок last→newPoint будь-який старий відрізок
function crossesOld(last, newPoint, points) {
    // пропускаємо два останні відрізки, бо вони сусідні з новим
    for (let j = 0; j < points.length - 2; j++) {
        if (segmentsIntersect(last, newPoint, points[j], points[j + 1])) {
            return true;
        }
    }
    return false;
}

function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function tooCloseToOld(newPoint, points){
    for (let i = 0; i < points.length-5; i++) {
        if (distance(newPoint, points[i]) < 80) { return true; }
    }
    return false;
}

function cross(o, a, b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function segmentsIntersect(p1, p2, q1, q2) {
    const d1 = cross(q1, q2, p1);
    const d2 = cross(q1, q2, p2);
    const d3 = cross(p1, p2, q1);
    const d4 = cross(p1, p2, q2);
    return (d1 * d2 < 0) && (d3 * d4 < 0);
}

function pushGameCheckpoints() {
    const result = [];
    for (let i = 0; i < trackLine.length; i += 5) {
        const x = trackLine[i].x;
        const y = trackLine[i].y;
        result.push({ x: x - 25, y: y - 25, width: 50, height: 50, checked: false });
    }
    return result;
}

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
}

function drawWalls() {
    ctx.fillStyle = 'grey';
    for (const wall of walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
}