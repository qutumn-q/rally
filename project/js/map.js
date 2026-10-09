const MAP_SCALE = 15;
// js/map.js
function loadMapFromImage(src, onLoaded) {
    const img = new Image();
    img.onload = () => {
        const off = document.createElement('canvas');
        off.width = img.width;
        off.height = img.height;
        const offCtx = off.getContext('2d');
        offCtx.fillStyle = 'black';
        offCtx.fillRect(0, 0, off.width, off.height);
        offCtx.drawImage(img, 0, 0);
        offCtx.drawImage(img, 0, 0);
        const data = offCtx.getImageData(0, 0, off.width, off.height).data;
        onLoaded(data, off.width, off.height);
    };
    img.onerror = () => console.log('картинка не завантажилась:', src);
    img.src = src;
}

function getPixelColor(data, width, x, y) {
    const index = (y * width + x) * 4;
    return {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
        a: data[index + 3]
    };
}

function isColor(color, r, g, b) {
    return color.r === r && color.g === g && color.b === b && color.a === 255;
}

// Стіни: для кожного рядка об'єднуємо чорні пікселі в один прямокутник
function buildWalls(data, width, height) {
    const walls = [];
    for (let y = 0; y < height; y++) {
        let startX = null;
        for (let x = 0; x <= width; x++) {
            const isBlack = x < width && isColor(getPixelColor(data, width, x, y), 0, 0, 0);
            if (isBlack && startX === null) {
                startX = x;
            } else if (!isBlack && startX !== null) {
                walls.push({x: startX * MAP_SCALE, y: y * MAP_SCALE, width: (x - startX) * MAP_SCALE, height: MAP_SCALE});
                startX = null;
            }
        }
    }
    return walls;
}

// Чекпоінти: кожен зелений піксель стає маленьким прямокутником 
function buildCheckpoints(data, width, height) {
    const checkpoints = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (isColor(getPixelColor(data, width, x, y), 0, 255, 0)) {
                checkpoints.push({ x: x * MAP_SCALE, y: y * MAP_SCALE, width: MAP_SCALE, height: MAP_SCALE, checked: false });
            }
        }
    }
    return checkpoints;
}