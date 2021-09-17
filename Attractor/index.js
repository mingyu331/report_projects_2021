const pt_num = 300;
const pt_trail_length = 4;
const scale = 12;
const pt_size = 4;
const randomness_scale = 1;

var pt = [];
var pt_trail = [];
var pt_color = [];
// var pt_prev;

function dxOverdt(pt) {
    return 10 * (pt.y - pt.x);
}

function dyOverdt(pt) {
    return pt.x * (28 - pt.z) - pt.y;
}

function dzOverdt(pt) {
    return pt.x * pt.y - (8 / 3) * pt.z;
}

var dt = 1 / 120;
var prevTime = -1 / 60;
function main(time) {
    if (time - prevTime > 22) dt = 1 / 120;
    else dt = (time - prevTime) / 2000;
    prevTime = time;

    // Update points
    let pt_temp = [];
    for (let idx = 0; idx < pt.length; idx++) {
        const element = pt[idx];

        let element_tmp = {};
        element_tmp.x = element.x + dxOverdt(element) * dt;
        element_tmp.y = element.y + dyOverdt(element) * dt;
        element_tmp.z = element.z + dzOverdt(element) * dt;
        pt_temp.push(element_tmp);
    }
    // pt_prev = pt;
    pt = pt_temp;

    pt_trail.push(pt);
    if (pt_trail.length >= pt_trail_length) pt_trail.shift();
    render2d_lines(pt, pt_trail);

    window.requestAnimationFrame(main);
}

function render2d_lines(pt, pt_trail) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let idx = 0; idx < pt.length; idx++) {
        const element = pt[idx];
        // For each line
        ctx.strokeStyle = `rgb(${pt_color[idx].r}, ${pt_color[idx].g}, ${pt_color[idx].b})`;
        ctx.beginPath();
        ctx.moveTo(pt_trail[0][idx].x * scale + canvas.width / 2, pt_trail[0][idx].y * scale + canvas.height / 2);
        for (let trail_idx = 1; trail_idx < pt_trail.length; trail_idx++) {
            ctx.lineTo(pt_trail[trail_idx][idx].x * scale + canvas.width / 2, pt_trail[trail_idx][idx].y * scale + canvas.height / 2);
        }
        ctx.stroke();
    }
}

function GreenCalc(num) {
    if (num > pt_num / 2) return 255;
    else return (511 / pt_num) * num;
}
function blueCalc(num) {
    if (num < pt_num / 2) return 255;
    else return 511 - (511 / pt_num) * num;
}

let canvas, ctx;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.lineWidth = pt_size;
ctx.lineCap = "round";

for (let idx = 0; idx < pt_num; idx++) {
    pt.push({ x: (2 * Math.random() - 1) * randomness_scale, y: (2 * Math.random() - 1) * randomness_scale, z: 1 });
    pt_color.push({ r: 0, g: Math.floor(GreenCalc(idx)), b: Math.floor(blueCalc(idx)) });
}

pt_trail.push(pt);
