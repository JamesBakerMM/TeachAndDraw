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
    $.text.print(50, 140, `dragged == ${$.touch.dragged}`);

    // console.log($.touch.dragEnd.x, $.touch.dragEnd.y, 10);

    if ($.touch.down) {
        $.shape.border = Paint.palegreen;
        $.shape.strokeWidth = 5;
        $.shape.line(
            $.touch.startX, $.touch.startY,
            $.touch.currX, $.touch.currY
        );
        $.shape.border = Paint.clear;
        $.shape.strokeWidth = 1;

        $.shape.colour = Paint.green;
        $.shape.oval($.touch.startX, $.touch.startY, 10);
    
        $.shape.colour = Paint.blue;
        $.shape.oval($.touch.currX, $.touch.currY, 10);
    
        $.text.colour = Paint.white;
        $.text.print($.touch.startX, $.touch.startY-25, "start");
        $.text.print($.touch.currX, $.touch.currY-25, "current");
    }


    ($.touch.swipedLeft) ? console.log("swipedLeft") : {};
    ($.touch.swipedRight) ? console.log("swipedRight") : {};


    ($.touch.swipedUp) ? console.log("swipedUp") : {};
    ($.touch.swipedDown) ? console.log("swipedDown") : {};

    // $.camera.x += $.touch.motionX;
    // $.camera.y += $.touch.motionY;

}


