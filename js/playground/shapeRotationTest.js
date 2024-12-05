import { $ } from "../../lib/Pen.js"
$.use(draw)
$.width = 900
$.height = 900


let theta = 0.0;
let xOffset = 0.0;
let xSpeed  = 1.0;


function drawShapes(x, y) {
    $.shape.rotation = theta;

    $.shape.alignment.x = "left";
    $.shape.alignment.y = "bottom";

    $.colour.fill = "white";
    $.shape.rectangle(x+100, y+100, 100, 50);
    $.shape.roundedRectangle(x+300, y+100, 100, 50, 16);
    $.shape.oval(x+500, y+100, 50, 25);

    $.shape.line(x+700, y+100, x+800, y+100);
    $.shape.multiline(x+100, y+300, x+150, y+300, x+185, y+325, x+175, y+280);
    $.shape.arc(x+300, y+300, 100, 50, 0, 45);
    $.shape.polygon(x+475, y+315, x+500, y+275, x+525, y+315);

    $.text.alignment.x = "left";
    $.text.print(x+10, y+10, `θ = ${theta}°`);
}


function draw() {
    $.shape.movedByCamera = true;
    $.text.movedByCamera = true;
    drawShapes(0, 400);

    $.shape.movedByCamera = false;
    $.text.movedByCamera = false;
    drawShapes(0, 0);

    theta = (theta + 1) % 360;

    if (xOffset < -4) {
        xSpeed = +0.05;
    }
    
    if (xOffset > 4) {
        xSpeed = -0.05;
    }
    xOffset += xSpeed;

	$.camera.x += xOffset;
}

