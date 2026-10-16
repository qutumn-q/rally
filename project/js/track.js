const edgeMargin = 200;
const startMaxMargin = 400;
const skeletonMinSegments = 6;
const stepLength = 150;
const maxOffsetRatio = 0.4;
const edgeSafe = 150;
const checkpointSize = 50;
const maxBuitldTries = 10;
let nextCheckpoint = 0;

let walls = [
    { x: 0, y: 0, width: WORLD_W, height: 10 },
    { x: 0, y: WORLD_H - 10, width: WORLD_W, height: 10 },
    { x: 0, y: 0, width: 10, height: WORLD_H },
    { x: WORLD_W - 10, y: 0, width: 10, height: WORLD_H },
];
let wallSegments = [];

//add functions---------------------------------------------------------------
function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max,value));
}
function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

// start function---------------------------------------------------------------
function randomStartPoint() {
    const side = Math.floor(Math.random() * 4); 
    const margin = randomBetween(edgeMargin, startMaxMargin); 
    const along = randomBetween(edgeMargin, WORLD_W - edgeMargin); 

    switch (side) {
        case 0: return { x: margin, y: along };                  
        case 1: return { x: WORLD_W - margin, y: along };        
        case 2: return { x: along, y: margin };                    
        default: return { x: along, y: WORLD_H - margin };          
    }
}

//skelet function---------------------------------------------------------------
function makeSkeleton() {
    const start = randomStartPoint();
    const finish = { x: WORLD_W - start.x, y: WORLD_H - start.y };

    let skeleton = [start];

    const d = { x: finish.x - start.x, y: finish.y - start.y };
    const totalLen = distance(start, finish);
    const normal = { x: d.y / totalLen, y: -d.x / totalLen };
    console.log('start', start, 'finish', finish, 'totalLen', totalLen);

    for (let i = 0; i < skeletonMinSegments - 1; i++) {
        const t = (i + 1) / skeletonMinSegments;
        let base = { x: start.x + d.x * t, y: start.y + d.y * t };

        const segLen = totalLen / skeletonMinSegments;

        let p;
        let tries = 0;
        do {
            const offset = randomBetween(-maxOffsetRatio, maxOffsetRatio) * segLen;
            p = { x: base.x + normal.x * offset, y: base.y + normal.y * offset };
            tries++;
        } while ((p.x < edgeSafe || p.x > WORLD_W - edgeSafe || p.y < edgeSafe || p.y > WORLD_H - edgeSafe) && tries < 50);

        skeleton.push(p);
    }
    skeleton.push(finish);
    return skeleton;
}

//details function---------------------------------------------------------------
function subdivideSegments(a, b) {
    const L = distance(a, b);
    const n = Math.floor(L / stepLength);
    const amp = randomBetween(60, 150);
    const freq = randomBetween(1, 2.5);

    let dir = { x: (b.x - a.x) / L, y: (b.y - a.y) / L };
    let perp = { x: -dir.y, y: dir.x };

    let points = [];
    for (let i = 0; i < n; i++) {
        const t = i / n;
        let base = { x: (a.x + (b.x - a.x) * t), y: (a.y + (b.y - a.y) * t) };
        const offset = amp * Math.sin(freq * t * 2 * Math.PI);
        points.push({ x: base.x + perp.x * offset, y: base.y + perp.y * offset });
    }
    console.log('сегмент', 'довжина', L.toFixed(0), 'amp', amp.toFixed(0), 'freq', freq.toFixed(2));
    return points;
}

//buitd track function---------------------------------------------------------------
function buildTrack(skeleton) {
    let trackLine = [];
    for (let i = 0; i < skeleton.length - 1; i++) {
        const seg = subdivideSegments(skeleton[i], skeleton[i + 1]);
        trackLine.push(...seg);
    }
    trackLine.push(skeleton[skeleton.length - 1]);
    return trackLine;
}

//perevirka function---------------------------------------------------------------
function isInsideWorld(p) {
    return p.x >= 0 && p.x <= WORLD_W && p.y >= 0 && p.y <= WORLD_H;
}

function isValidTrack(trackLine) {
    for (let p of trackLine) {
        if (!isInsideWorld(p)) return false;
    }
    return true;
}

function generateValidTrack() {
    for (let i = 0; i < maxBuitldTries; i++) {
        const skeleton = makeSkeleton();
        const trackLine = buildTrack(skeleton);
        if (isValidTrack(trackLine)) return {skeleton: skeleton, trackLine: trackLine};
    }
    return { skeleton: skeleton, trackLine: trackLine };
}

function buildCheckpoints(trackLine) {
    const checkpoints = [];
    for (let i = 1; i < trackLine.length - 1; i += Math.floor(trackLine.length / 4)) {
        const p = trackLine[i];
        checkpoints.push({ x: p.x - checkpointSize / 2, y: p.y - checkpointSize / 2, width: checkpointSize, height: checkpointSize, checked: false });
    }
    const finish = trackLine[trackLine.length - 1];
    checkpoints.push({ x: finish.x - checkpointSize / 2, y: finish.y - checkpointSize / 2, width: checkpointSize, height: checkpointSize, checked: false });
    return checkpoints;
}

//colision functions---------------------------------------------------------------
function distToSegment(p, s) {
    const dx = s.bx - s.ax;
    const dy = s.by - s.ay;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return distance(p, { x: s.ax, y: s.ay });
    let t = ((p.x - s.ax) * dx + (p.y - s.ay) * dy) / len2;
    t = clamp(t, 0, 1);
    const closest = { x: s.ax + dx * t, y: s.ay + dy * t };
    return distance(p, closest);
}

function checkCollision(car, segments) {
    const corners = getCarCorners(car);
    for (const s of segments) {
        for (const c of corners) {
            if (distToSegment(c, s) < wallSize / 2) return true;
        }
    }
    return false;
}

//draw functions---------------------------------------------------------------
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

function drawWallSegments() {
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = wallSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const s of wallSegments) {
        ctx.moveTo(s.ax, s.ay);
        ctx.lineTo(s.bx, s.by);
    }
    ctx.stroke();
}

//buid walls
const halfWidth = 60;
const wallSize = 10;
const miterLimit = 1.4;

function normalizeVec(v) {
    const len = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
    if (len === 0) return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
}

function perpOf(dir) {
    return { x: -dir.y, y: dir.x };
}

function segmentsDirection(trackLine) {
    let dirs = [];
    for (let i = 0; i < trackLine.length - 1; i++) {
        dirs.push(normalizeVec({ x: trackLine[i + 1].x - trackLine[i].x, y: trackLine[i + 1].y - trackLine[i].y }));
    }
    return dirs;
}

function turnSign(i, trackLine, normals) {
    const a = normals[i - 1];
    const b = normals[i];
    return a.x * b.y - a.y * b.x;
}

function vertexNormals(trackLine) {
    const dirs = segmentsDirection(trackLine);
    let normals = [];
    for (let i = 0; i < trackLine.length; i++) {
        let n;
        if (i === 0) {
            n = perpOf(dirs[0]);
        } else if (i === trackLine.length - 1) {
            n = perpOf(dirs[dirs.length - 1]);
        } else {
            const avg = normalizeVec({ x: dirs[i - 1].x + dirs[i].x, y: dirs[i - 1].y + dirs[i].y });
            n = perpOf(avg);
        }
        normals.push(n);
    }
    return normals;
}

function buildEdges(trackLine, halfWidth) {
    const normals = vertexNormals(trackLine);
    let left = []; let right = [];
    for (let i = 0; i < trackLine.length; i++) {
        const P = trackLine[i];
        const N = normals[i];
        let kLeft = halfWidth;
        let kRight = halfWidth;
        if (i > 0 && i < trackLine.length - 1) {
            const coef = Math.min(coefMiter(i, trackLine, normals), miterLimit) * halfWidth;
            if (turnSign(i, trackLine, normals) > 0) kLeft = coef; 
            else kRight = coef;                                    
        }
        left.push({ x: P.x + N.x * kLeft, y: P.y + N.y * kLeft });
        right.push({ x: P.x - N.x * kRight, y: P.y - N.y * kRight });
    }
    return { left: left, right: right };
}

function coefMiter(i, trackLine, normals) {
    if (i === 0 || i === trackLine.length - 1) return 1;
    const cosHalf = normals[i].x * normals[i - 1].x + normals[i].y * normals[i - 1].y;
    if (cosHalf <= 0) return miterLimit;
    return Math.min(1 / cosHalf, miterLimit);
}

function edgeToSegments(edge) {
    let segs = [];
    for (let i = 0; i < edge.length - 1; i++) {
        const A = edge[i]; const B = edge[i + 1];
        if (distance(A, B) === 0) continue;
        segs.push({ ax: A.x, ay: A.y, bx: B.x, by: B.y });
    }
    return segs;
}

function buildTrackWalls(trackLine) {
    const edges = buildEdges(trackLine, halfWidth);
    return edgeToSegments(edges.left).concat(edgeToSegments(edges.right));
}

//startup function---------------------------------------------------------------
function startup() {
    result = generateValidTrack();
    skeleton = result.skeleton;
    trackLine = result.trackLine;
    checkpoints = buildCheckpoints(trackLine);
    wallSegments = buildTrackWalls(trackLine);
    console.log('перша точка', trackLine[0], 'остання точка', trackLine[trackLine.length - 1]);
    console.log('точок:', trackLine.length, 'NaN:', trackLine.some(p => isNaN(p.x) || isNaN(p.y)));
}