//consts----------------------------------------------------------------------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WORLD_W = 3600;
const WORLD_H = 1800;

const car = { x: WORLD_W / 2, y: WORLD_H / 2, angle: 0, speed: 0 };

const camera = { x: 0, y: 0 };

