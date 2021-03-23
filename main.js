let creating = false;
function callCar(from, to) {
    if (!creating) {
        // Creating car
        new Car(from, to).run();

        creating = true;
        setTimeout(() => {
            creating = false;
        }, 500);
    }
}

let running = false;
let pos = ["top", "right", "bottom", "left"];
let auto = () => {
    if (running) {
        let from, prev_from, to;
        prev_from = from;
        from = pos[Math.round(Math.random()*3)];
        while (prev_from == from) {
            from = pos[Math.round(Math.random()*3)];
        }
        to = pos[Math.round(Math.random()*3)];
        while (from == to) {
            to = pos[Math.round(Math.random()*3)];
        }
        new Car(from, to).run();
        setTimeout(() => {
            requestAnimationFrame(auto);
        }, 3000);
    }
}

document.getElementById("auto").onclick = () => {
    if (!running) {
        running = true;
        // Run simulation
        requestAnimationFrame(auto);
    }
    
    // Stop spawn
    document.getElementById("stop").onclick = () => {
        running = false;
    }
}

// Cars in buffer number positions
let buffer_pos = {
    "top": [h_center - road_width - sw_width - 12, 20],
    "right": [width - 36, v_center - road_width - 0.25*sw_width],
    "bottom": [h_center + road_width + sw_width - 6, height - 20],
    "left": [20, v_center + road_width + 0.75*sw_width],
}
ctx.font = "bold 16px sans-serif";
// Cars that couldn`t fit on road are saving in buffer and we clear it
let freeBuffer = () => {
    if (buffer.size() > 0) {
        pos.forEach (el => {
            ctx.clearRect(buffer_pos[el][0]-18, buffer_pos[el][1]-18, 54, 24);
            if (buffer[el].length > 0) {
                ctx.fillStyle = "#70ff96";
                ctx.fillRect(buffer_pos[el][0]-18, buffer_pos[el][1]-18, 54, 24);
                ctx.fillStyle = "#000";
                ctx.fillText(buffer[el].length, buffer_pos[el][0]-12, buffer_pos[el][1]);
                if (buffer[el][0].checkArea()) {
                    buffer[el].shift().run();
                }
            }
        })
    } else {
        pos.forEach (el => {
            ctx.clearRect(buffer_pos[el][0]-18, buffer_pos[el][1]-18, 54, 24);
        })
    }
    setTimeout(() => {
        requestAnimationFrame(freeBuffer);
    }, 500);
}
requestAnimationFrame(freeBuffer);