import { Paint } from "../../lib/Paint.js";
import { $ } from "../../lib/TeachAndDraw.js";

$.use(draw);

// $.debug = true;
$.width  = 800;
$.height = 800;

function draw() {
    $.text.movedByCamera = true;
    $.shape.movedByCamera = true;

    $.shape.strokeWidth = 2;
    $.shape.border = Paint.grey;
    for (let i=0; i<=$.w; i+=50) {
        $.shape.line(i, 0, i, $.h);
    }
    for (let i=0; i<=$.h; i+=50) {
        $.shape.line(0, i, $.w, i);
    }


    dragTest();

    if ($.keys.down("a")) $.camera.x -= 1;
    if ($.keys.down("d")) $.camera.x += 1;
    if ($.keys.down("w")) $.camera.y -= 1;
    if ($.keys.down("s")) $.camera.y += 1;
	if ($.keys.down("q")) $.camera.rotation -= 0.5;
    if ($.keys.down("e")) $.camera.rotation += 0.5;
    if ($.keys.down("i")) $.camera.zoom *= 1.01;
    if ($.keys.down("k")) $.camera.zoom *= 0.99;
}


function dragTest() {

    $.text.colour = Paint.white;
    $.text.alignment.x = "left"
    $.text.print(50, 100, `down == ${$.touch.down}`);
    $.text.print(50, 120, `released == ${$.touch.released}`);

    // console.log($.touch.dragEnd.x, $.touch.dragEnd.y, 10);

    if ($.touch.down) {
        $.shape.border = Paint.palegreen;
        $.shape.strokeWidth = 5;
        $.shape.line(
            $.touch.startX, $.touch.startY,
            $.touch.endX, $.touch.endY
        );
        $.shape.border = Paint.clear;
        $.shape.strokeWidth = 1;

        $.shape.colour = Paint.green;
        $.shape.oval($.touch.startX, $.touch.startY, 10);
    
        $.shape.colour = Paint.blue;
        $.shape.oval($.touch.endX, $.touch.endY, 10);
    
        $.text.colour = Paint.white;
        $.text.print($.touch.startX, $.touch.startY-25, "start");
        $.text.print($.touch.endX, $.touch.endY-25, "end");
    }

    $.camera.x += $.touch.dragX;
    $.camera.y += $.touch.dragY;

}


