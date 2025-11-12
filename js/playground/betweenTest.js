import { tad, mouse, shape, make } from "../../lib/TeachAndDraw.js";

tad.use(update);
const box = make.boxCollider(20, 20, 50, 50);
const circle = make.circleCollider(20, 20, 50);

let angle = 0;
const line = [
    { x: 2, y: 2 },
    { x: tad.w, y: tad.h },
];
function update() {
    box.rotation +=1
    if (mouse.leftDown) {
        box.x = mouse.x;
        box.y = mouse.y;
    }
    if (mouse.rightDown) {
        circle.x = mouse.x;
        circle.y = mouse.y;
    }
    angle -= 0.001; // rotation speed
    const centerX = tad.w / 2;
    const centerY = tad.h / 2;
    const radius = Math.min(tad.w, tad.h) * 0.45;

    line[0].x = centerX + Math.cos(angle) * radius;
    line[0].y = centerY + Math.sin(angle) * radius;
    line[1].x = centerX - Math.cos(angle) * radius;
    line[1].y = centerY - Math.sin(angle) * radius;

    if (box.between(line[0].x, line[0].y, line[1].x, line[1].y)) {
        shape.colour = "red";
        shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);
    } else if (circle.between(line[0].x, line[0].y, line[1].x, line[1].y)) {
        shape.colour = "blue";
        shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);
    } else {
        shape.colour = "white";
        shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);
    }
    box.draw();
    circle.draw();
    shape.colour = "black";
    shape.line(line[0].x, line[0].y, line[1].x, line[1].y);
}
