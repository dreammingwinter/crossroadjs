// 4 positions
const tl_spots = {
    "top": [h_center, v_center - road_width],
    "right": [h_center + road_width, v_center],
    "bottom": [h_center, v_center + road_width],
    "left": [h_center - road_width, v_center]
}

// class for access to color
class TrafficLight {
    constructor(pos, offset) {
        this.pos = pos;
        this.offset = offset;
        this.color = "#f00";
        this.radius = 12;
        // Font
        tlctx.font = "bold 16px sans-serif";
        // Timings
        this.red = 99;
        this.green = 30;
        this.orange = 3;
        this.full_cycle = this.red + this.green + this.orange;
        this.text_to_draw = "";
        this.refresh = 1000;
    }
    draw() {
        // Draw arc
        tlctx.beginPath();
        tlctx.fillStyle = this.color;
        tlctx.arc(tl_spots[this.pos][0], tl_spots[this.pos][1], this.radius, 0, Math.PI*2);
        tlctx.fill();
        tlctx.closePath();

        // Draw text
        tlctx.fillStyle = "#000";
        if (this.text_to_draw < 10) {
            tlctx.fillText(this.text_to_draw, tl_spots[this.pos][0]-4.5, tl_spots[this.pos][1]+5);
        } else {
            tlctx.fillText(this.text_to_draw, tl_spots[this.pos][0]-9, tl_spots[this.pos][1]+5);
        }
    }
    run() {
        let i = this.full_cycle - this.offset;
        let animate = () => {
            // Set arc color & text
            if (i > this.green + this.orange) {
                this.color = "#f00";
                this.text_to_draw = i - this.green - this.orange;
            } else if (i > this.orange) {
                this.color = "#0f0";
                this.text_to_draw = i - this.orange;
            } else if (i > 1) {
                this.color = "#fa0";
                this.text_to_draw = "";
            } else {
                i = this.full_cycle+1;
            }
            // Draw arc
            this.draw();
            i--;
            setTimeout(() => {
                requestAnimationFrame(animate);   
            }, this.refresh);
        }
        requestAnimationFrame(animate);
    }
    setRefresh(ms) {
        this.refresh = ms;
    }
}

// Run TL
let tl1 = new TrafficLight("top", 99);
let tl2 = new TrafficLight("right", 0);
let tl3 = new TrafficLight("bottom", 33);
let tl4 = new TrafficLight("left", 66);
tl1.run();
tl2.run();
tl3.run();
tl4.run();

function refreshAllTL() {
    let val = Number(document.getElementById("tl_speed").value);
    tl1.setRefresh(val);
    tl2.setRefresh(val);
    tl3.setRefresh(val);
    tl4.setRefresh(val);
    document.getElementById("current_tl_speed").innerHTML = val;
}