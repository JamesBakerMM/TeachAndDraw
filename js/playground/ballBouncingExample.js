//TAD
import { $ } from "../../lib/Pen.js"; //we use the es6 import system to import the way to access the library which is $ 
$.use(update); //we tell it which function use for our draw :)

$.width = 400; 
$.height = 400;

const circle = $.makeCircleCollider($.w / 2, $.h / 2, 60, 60);
circle.friction = 0; //in tad colliders have some default friction
circle.speed = 10; 
circle.direction = 90; //in tad 0 is up, 90 is right, 180 is down, 270 is left

function update() {
    $.colour.fill = "grey"; //we set the fill as a property, not a method
    $.shape.rectangle($.w / 2, $.h / 2, $.w, $.h);
    const isAtLeftEdge = circle.x - circle.radius < 0;
    if (isAtLeftEdge) {
        circle.direction = 90; //go right
    }
    const isAtRightEdge = circle.x + circle.radius > $.w;
    if (isAtRightEdge) {
        circle.direction = 270; //go left
    }
    $.drawColliders(); //draws all colliders we could instead call circle.draw();
}