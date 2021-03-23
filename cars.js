// Simple turn data
let big_radius = road_width + road_width/4;
let small_radius = road_width/4;

// Start angles if car turns inside center
const starts = {
    "top right": 0,
    "top left": 0,
    "right top": 1.5*Math.PI,
    "right bottom": -Math.PI/2,
    "bottom right": Math.PI,
    "bottom left": Math.PI,
    "left top": Math.PI/2,
    "left bottom": Math.PI/2,
}

let sqrt2 = Math.sqrt(2); // For clear a circle around car (car rotates in center so it makes a circle with d=sqrt2*width)

// Spawn spots
const car_spots = {
    "top_up": [h_center - 3*road_width/4, 12],
    "top_down": [h_center - road_width/4, 12],
    "right_up": [width-12, v_center - 3*road_width/4],
    "right_down": [width-12, v_center - road_width/4],
    "bottom_up": [h_center + 3*road_width/4, height-12],
    "bottom_down": [h_center + road_width/4, height-12],
    "left_up": [12, v_center + 3*road_width/4],
    "left_down": [12, v_center + road_width/4]
}

// Move vectors for cars
const move_rule = {
    "top": [0, 1],
    "right": [-1, 0],
    "bottom": [0, -1],
    "left": [1, 0]
}

// Where to check traffic light (zones)
const tl_pos_check = { 
    "top": [width, v_center - road_width, 0, v_center - road_width - 24],
    "right": [h_center + road_width + 24, height, h_center + road_width, 0],
    "bottom": [width, v_center + road_width + 24, 0, v_center + road_width],
    "left": [h_center - road_width, height, h_center - road_width - 24, 0]
}

// Main traffic light
const pos_light = {
    "top": tl1,
    "right": tl2,
    "bottom": tl3,
    "left": tl4,
}

// Direction on right to start
const pos_right = {
    "top": "left",
    "right": "top",
    "bottom": "right",
    "left": "bottom"
}

// Images
const cars = {
    "top": "./Images/car_top.png",
    "right": "./Images/car_left.png",
    "bottom": "./Images/car_bottom.png",
    "left": "./Images/car_right.png"
}

// Direction oposite to start
const oposites = {
    "top": "bottom",
    "right": "left",
    "bottom": "top",
    "left": "right"
}

class Car {
    constructor(from, to) {
        this.width = 24;
        this.height = 24;
        this.speed = 2;
        this.from = from; // Move car from pos
        this.to = to; // Move car to pos
        // This if defines car spawn spot and turning radius
        if (this.to == oposites[this.from]) {
            if (Math.random() < 0.5) {
                this.posX = car_spots[this.from+"_up"][0];
                this.posY = car_spots[this.from+"_up"][1];
            } else {
                this.posX = car_spots[this.from+"_down"][0];
                this.posY = car_spots[this.from+"_down"][1];
            }
        } else if (this.to == pos_right[this.from]) {
            this.posX = car_spots[this.from+"_up"][0];
            this.posY = car_spots[this.from+"_up"][1];
            this.radius = small_radius;
            this.step = -(Math.PI / 2) / (this.radius * Math.PI/2 / this.speed);
        } else {
            this.posX = car_spots[this.from+"_down"][0];
            this.posY = car_spots[this.from+"_down"][1];
            this.radius = big_radius;
            this.step = (Math.PI / 2) / (this.radius * Math.PI/2 / this.speed);
        }
        // Define car image, main traffic light, where to check traffic light ang move vector
        this.car = new Image(this.width, this.height);
        this.car.src = cars[this.from];
        this.tl = pos_light[this.from];
        this.tl_pos_check = tl_pos_check[this.from];
        this.move_rule = {
            "start": move_rule[this.from],
            "end": move_rule[oposites[this.to]]
        }
        this.start = starts[this.from + " " + this.to];
        this.angle = 0;
        this.inside_center = false; // Defines switch to center from start, so the else branch in animate() works
    }
    clear() {
        ctx.clearRect(this.posX - sqrt2*this.width/2, this.posY - sqrt2*this.height/2, this.width*sqrt2, this.height*sqrt2);
    }
    draw() {
        ctx.drawImage(this.car, this.posX-this.width/2, this.posY-this.height/2);
    }
    move(x, y) {
        this.clear();
        this.posX += x;
        this.posY += y;
    }
    // Rotate canvas and draw, then rotate back
    rotate(angle) {
        ctx.translate(this.posX, this.posY);
        ctx.rotate(angle);
        ctx.drawImage(this.car, -this.width/2, -this.height/2);
        ctx.rotate(-angle);
        ctx.translate(-this.posX, -this.posY);
    }
    // Run car
    run() {        
        if (this.checkArea()) {
            this.animate();
        } else {
            // Try to switch side
            if (this.to == oposites[this.from]) {
                if (this.posX == car_spots[this.from+"_up"][0] && this.posY == car_spots[this.from+"_up"][1]) {
                    this.posX = car_spots[this.from+"_down"][0];
                    this.posY = car_spots[this.from+"_down"][1];
                } else if (this.posX == car_spots[this.from+"_down"][0] && this.posY == car_spots[this.from+"_down"][1]) {
                    this.posX = car_spots[this.from+"_up"][0];
                    this.posY = car_spots[this.from+"_up"][1];
                }
            }
            if (this.checkArea()) {
                this.animate();
            } else {
                buffer[this.from].push(this);
            }
        }
    }
    animate = () => {
        let x = 0;
        let y = 0;
        if (this.exceed()) {
            this.clear();
            cancelAnimationFrame(this.animate);
        } else {
            // Main movement code
            if (this.insideCenter()) {
                this.inside_center = true;
                if (this.from == oposites[this.to]) {
                    x = this.move_rule["start"][0] * this.speed;
                    y = this.move_rule["start"][1] * this.speed;
                } else {
                    x = Math.sin(this.start)*this.speed;
                    y = Math.cos(this.start)*this.speed;
                    this.start += this.step;
                    this.angle += this.step;
                }
            } else if (!this.inside_center) { // First step
                this.checkForward();
                this.car.src = cars[this.from];
                x = this.move_rule["start"][0] * this.speed;
                y = this.move_rule["start"][1] * this.speed;
            } else { // Last step
                this.car.src = cars[oposites[this.to]];
                x = this.move_rule["end"][0] * this.speed;
                y = this.move_rule["end"][1] * this.speed;
            }
            if (this.posX < this.tl_pos_check[0] && this.posY < this.tl_pos_check[1] && 
                this.posX > this.tl_pos_check[2] && this.posY > this.tl_pos_check[3]) {
                this.checkTrafficLight();
                if (this.speed == 0) {
                    x = 0;
                    y = 0;
                }
            }
                    
            if (!this.insideCenter()) {
                this.angle = 0;
            }
            this.move(x, y);
            if (this.angle == 0) {
                this.rotate(0);
            } else {
                this.rotate(-this.angle);
            }
            requestAnimationFrame(this.animate);
        }
    }
    // If car exceeded border
    exceed() {
        if (this.posX < -this.width/2 || this.posX > width + this.width/2 || this.posY < -this.height/2 || this.posY > height + this.height/2) {
            return true;
        }
        return false;
    }
    stop() {
        this.speed = 0;
    }
    go() {
        this.speed = 2;
    }
    checkTrafficLight() {
        if (this.tl.color == "#0f0") {
            this.go();
        } else {
            if ((pos_light[oposites[this.from]].color == "#0f0" || pos_light[pos_right[this.from]].color == "#0f0") && this.to == pos_right[this.from]) {
                this.go();
            } else {
                this.stop();
            }
        }
    }
    // Check spawn position
    // False if area is not empty
    checkArea() {
        let color = ctx.getImageData(this.posX - this.width, this.posY - this.height, this.width*2, this.height*2);
        for (let i = 3; i < color.data.length; i+=4) {
            if (color.data[i] != 0) {
                return false;
            }
        }
        return true;
    }
    // Check if car is next to us
    checkForward() {
        let x;
        let y;
        let scaler = 1.25;
        switch (this.from) {
            case "top":
                x = this.posX;
                y = this.posY + scaler*this.height;
                break;
            case "right":
                x = this.posX - scaler*this.width;
                y = this.posY;
                break;
            case "bottom":
                x = this.posX;
                y = this.posY - scaler*this.height;
                break;
            case "left":
                x = this.posX + scaler*this.width;
                y = this.posY;
                break;
        }
        let color = ctx.getImageData(x, y, 1, 1);
        if (color.data[3] != 0) {
            this.stop();
        } else {
            setTimeout(() => { // Timeout before go
                this.go();
            }, 200);
        }
    }
    insideCenter() {
        if (this.posX > h_center - road_width && this.posX < h_center + road_width) {
            if (this.posY > v_center - road_width && this.posY < v_center + road_width) {
                return true;
            }
        }
        return false;
    }
}