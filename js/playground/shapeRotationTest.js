import { $ } from "../../lib/Pen.js"
$.use(draw)
$.width = 900
$.height = 600


let theta = 0.0;

function draw() {

    $.shape.rotation = theta;

    $.colour.fill = "white";
    $.shape.rectangle(100, 100, 100, 50);
    $.shape.roundedRectangle(300, 100, 100, 50, 16);
    $.shape.oval(500, 100, 50, 25);

    $.shape.line(700, 100, 800, 100);
    $.shape.multiline(100, 300, 150, 300, 185, 325, 175, 280);
    $.shape.arc(300, 300, 100, 50, 0, 45);
    $.shape.polygon(475, 315, 500, 275, 525, 315);

    $.text.alignment.x = "left";
    $.text.print(10, 10, `θ = ${theta}°`);

    theta = (theta + 1) % 360;
}
