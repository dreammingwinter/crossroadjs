const line_width = 2;
const lines = 7;
const line_height_hor = (h_center - road_width) / lines;
const line_height_ver = (v_center - road_width) / lines;
const line_gap = 7;
const sw_width = 24; // sidewalk

function rand_btw(a, b) {
    return Math.round(Math.random()*(b-a)+a);
}

let grass = new Image(50, 50);
let tree = new Image(80, 60);
let house = new Image(70, 113);
let penthouse = new Image(363, 207);
penthouse.addEventListener('load', function() {
    // Grass
    for (let i = 0; i < width; i+=50) {
        for (let j = 0; j < height; j+= 50) {
            rctx.drawImage(grass, i, j);
        }
    }
    // Houses
    let xs = [30, 150, 270, width-110, width-230, width-350];
    xs.forEach ((x) => {
        rctx.drawImage(house, x, 20);
        rctx.drawImage(house, x, 113);
    });
    rctx.drawImage(penthouse, 5, v_center + road_width + sw_width + 20);
    // Trees
    let br_x_corner = h_center + road_width + sw_width;
    let br_y_corner = v_center + road_width + sw_width;
    for (let i = 0; i < 50; i++) {
        rctx.drawImage(tree, rand_btw(br_x_corner, width-40), rand_btw(br_y_corner, height-30));
    }
    rctx.drawImage(tree, width-80, height - 230);
    
    // Black roads
    rctx.fillStyle = "#000";
    rctx.fillRect(h_center - road_width, 0, road_width*2, v_center*2);
    rctx.fillRect(0, v_center - road_width,  h_center*2, road_width*2);

    // White dashed lines
    rctx.fillStyle = "#fff";
    for (let i = 0; i < lines; i++) {
        rctx.fillRect(line_gap+line_height_hor*(i), v_center-road_width/2-line_width/2, line_height_hor-line_gap, line_width); // Left
        rctx.fillRect(line_gap+line_height_hor*(i), v_center+road_width/2-line_width/2, line_height_hor-line_gap, line_width); // Left
        rctx.fillRect(h_center*2-(line_height_hor*(lines-i)), v_center-road_width/2-line_width/2, line_height_hor-line_gap, line_width); // Right
        rctx.fillRect(h_center*2-(line_height_hor*(lines-i)), v_center+road_width/2-line_width/2, line_height_hor-line_gap, line_width); // Right
        rctx.fillRect(h_center-road_width/2-line_width/2, line_gap+line_height_ver*(i), line_width, line_height_ver-line_gap); // Top
        rctx.fillRect(h_center+road_width/2-line_width/2, line_gap+line_height_ver*(i), line_width, line_height_ver-line_gap); // Top
        rctx.fillRect(h_center-road_width/2-line_width/2, v_center*2-(line_height_ver*(lines-i)), line_width, line_height_ver-line_gap); // Bottom
        rctx.fillRect(h_center+road_width/2-line_width/2, v_center*2-(line_height_ver*(lines-i)), line_width, line_height_ver-line_gap); // Bottom
    }

    // White separate road lines
    rctx.fillRect(h_center-1         , 0                  , line_width, v_center - road_width); // Top
    rctx.fillRect(h_center+road_width, v_center-1         , h_center - road_width, line_width); // Right
    rctx.fillRect(h_center-1         , v_center+road_width, line_width, v_center - road_width); // Bottom
    rctx.fillRect(0                  , v_center-1         , h_center - road_width, line_width); // Left

    // White stop lines
    rctx.fillRect(h_center-road_width  , v_center-road_width-1, road_width, 1); // Top
    rctx.fillRect(h_center+road_width  , v_center-road_width-1, 1, road_width); // Right
    rctx.fillRect(h_center             , v_center+road_width  , road_width, 1); // Bottom
    rctx.fillRect(h_center-road_width-1, v_center             , 1, road_width); // Left

    // Sidewalks
        // Major lines
    rctx.fillStyle = "#b8b8b8";
    rctx.fillRect(h_center - road_width - sw_width, 0, sw_width, v_center - road_width);
    rctx.fillRect(h_center - road_width - sw_width, v_center + road_width, sw_width, v_center - road_width);
    rctx.fillRect(0, v_center - road_width - sw_width, h_center - road_width, sw_width);
    rctx.fillRect(0, v_center + road_width, h_center - road_width, sw_width);
    rctx.fillRect(h_center + road_width, 0, sw_width, v_center - road_width);
    rctx.fillRect(h_center + road_width, v_center - road_width - sw_width, h_center - road_width, sw_width);
    rctx.fillRect(h_center + road_width, v_center + road_width, h_center - road_width, sw_width);
    rctx.fillRect(h_center + road_width, v_center + road_width, sw_width, v_center - road_width);
        // Small lines
    rctx.lineWidth = 4;
    rctx.strokeStyle = "#686c73";
    // ←↑
    rctx.beginPath();
    rctx.moveTo(h_center - road_width - sw_width, 0);
    rctx.lineTo(h_center - road_width - sw_width, v_center - road_width - sw_width);
    rctx.lineTo(0, v_center - road_width - sw_width);
    rctx.stroke();
    // ↑→
    rctx.beginPath();
    rctx.moveTo(h_center + road_width + sw_width, 0);
    rctx.lineTo(h_center + road_width + sw_width, v_center - road_width - sw_width);
    rctx.lineTo(width, v_center - road_width - sw_width);
    rctx.stroke();
    // ←↓
    rctx.beginPath();
    rctx.moveTo(0, v_center + road_width + sw_width);
    rctx.lineTo(h_center - road_width - sw_width, v_center + road_width + sw_width);
    rctx.lineTo(h_center - road_width - sw_width, height);
    rctx.stroke();
    // ↓→
    rctx.beginPath();
    rctx.moveTo(h_center + road_width + sw_width, height);
    rctx.lineTo(h_center + road_width + sw_width, v_center + road_width + sw_width);
    rctx.lineTo(width, v_center + road_width + sw_width);
    rctx.stroke();
}, false);
grass.src = "./Images/grass.png";
house.src = "./Images/house.png";
tree.src = "./Images/tree.png";
penthouse.src = "./Images/penthouse.png";

