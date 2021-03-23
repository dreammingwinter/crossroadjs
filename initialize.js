let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let road = document.getElementById("road");
let rctx = road.getContext("2d");

let trafficlights = document.getElementById("trafficlights");
let tlctx = trafficlights.getContext("2d");

const width = 1000;
const height = 750;
const h_center = width/2;
const v_center = height/2;
const road_width = 100;

canvas.width = width;
canvas.height = height;
road.width = width;
road.height = height;
trafficlights.width = width;
trafficlights.height = height;

// Buffer contains cars that didn`t fit on canvas
let buffer = {
    "top": [],
    "right": [],
    "bottom": [],
    "left": []
}
buffer.size = () => {
    return buffer.top.length + buffer.right.length + buffer.bottom.length + buffer.left.length;
} 