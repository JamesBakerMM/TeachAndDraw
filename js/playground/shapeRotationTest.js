import { Paint } from "../../lib/Paint.js";
import { $ } from "../../lib/TeachAndDraw.js"
$.use(draw)
$.debug = true;
$.width = 900
$.height = 900


let theta = 0.0;

function drawShapes(x, y) {
    $.shape.colour = Paint.white;
    $.shape.rectangle(x+100, y+100, 100, 50);
    // $.shape.roundedRectangle(x+300, y+100, 100, 50, 16);
    $.shape.oval(x+500, y+100, 50, 25);

    $.shape.line(x+700, y+100, x+800, y+100);
    $.shape.multiline(x+100, y+300, x+150, y+300, x+185, y+325, x+175, y+280);
    $.shape.arc(x+300, y+300, 100, 50, 0, 45);
    $.shape.polygon(x+475, y+315, x+500, y+275, x+525, y+315);

    $.text.print(x+10, y+10, `θ = ${theta}°`);

    $.drawColliders();
}


function draw() {

    theta = (theta + 1) % 360;
    $.shape.rotation = theta;
    $.shape.movedByCamera = true;
    $.text.movedByCamera = true;

    $.shape.alignment.x = "left";
    $.shape.alignment.y = "center";
    drawShapes(50, 50);

    if ($.keys.down("leftArrow")) {
        $.camera.x -= 1;
    }
    if ($.keys.down("rightArrow")) {
        $.camera.x += 1;
    }
    if ($.keys.down("upArrow")) {
        $.camera.y -= 1;
    }
    if ($.keys.down("downArrow")) {
        $.camera.y += 1;
    }

	if ($.keys.down("q")) {
        $.camera.rotation -= 0.5;
    }
    if ($.keys.down("e")) {
        $.camera.rotation += 0.5;
    }

	if ($.keys.down("i")) {
        $.camera.zoom *= 1.01;
    }
    if ($.keys.down("k")) {
        $.camera.zoom *= 0.99;
    }
}

