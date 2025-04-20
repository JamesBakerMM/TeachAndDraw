import { Paint } from "../../lib/Paint.js";
import { $ } from "../../lib/TeachAndDraw.js"
$.use(draw)
// $.debug = true;
$.width = 900
$.height = 900


let theta = 0.0;

function drawShapes(x, y) {
    $.shape.alignment.x = "left";
    $.shape.alignment.y = "bottom";

    $.shape.colour = Paint.white;
    $.shape.rectangle(x+100, y+100, 100, 50);
    // $.shape.roundedRectangle(x+300, y+100, 100, 50, 16);
    $.shape.oval(x+500, y+100, 50, 25);

    $.shape.line(x+700, y+100, x+800, y+100);
    $.shape.multiline(x+100, y+300, x+150, y+300, x+185, y+325, x+175, y+280);
    $.shape.arc(x+300, y+300, 100, 50, 0, 45);
    $.shape.polygon(x+475, y+315, x+500, y+275, x+525, y+315);

    $.text.alignment.x = "left";
    $.text.print(x+10, y+10, `θ = ${theta}°`);
}


function draw() {

    theta = (theta + 1) % 360;
    $.shape.rotation = theta;
    $.shape.movedByCamera = true;
    $.text.movedByCamera = true;
    drawShapes(0, 0);

    console.log($.camera2.x);
    const tmp = $.camera2.screenToWorld($.mouse.x, $.mouse.y);
    $.shape.oval(tmp.x, tmp.y, 50);

    $.shape.alignment.x = "center";
    $.shape.alignment.y = "center";

    if ($.keys.down("leftArrow")) {
        $.camera2.x -= 1;
    }
    if ($.keys.down("rightArrow")) {
        $.camera2.x += 1;
    }
    if ($.keys.down("upArrow")) {
        $.camera2.y -= 1;
    }
    if ($.keys.down("downArrow")) {
        $.camera2.y += 1;
    }

	if ($.keys.down("q")) {
        $.camera2.rotation -= 0.01;
    }
    if ($.keys.down("e")) {
        $.camera2.rotation += 0.01;
    }


	if ($.keys.down("i")) {
        $.camera2.scale -= 0.01;
    }
    if ($.keys.down("k")) {
        $.camera2.scale += 0.01;
    }
}

