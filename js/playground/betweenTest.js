import { tad, mouse, shape, make } from "../../lib/TeachAndDraw.js";

tad.use(update);
const box = make.boxCollider(20, 20, 50, 50);
const circle = make.circleCollider(20, 20, 50);

const line = [
    {
        x: 2,
        y: 2,
    },
    {
        x: tad.w,
        y: tad.h,
    },
];

function update() {
    if (mouse.leftDown) {
        box.x = mouse.x;
        box.y = mouse.y;
    }
    if (mouse.rightDown) {
        circle.x = mouse.x;
        circle.y = mouse.y;
    }
    
    if (box.between(line[0].x, line[0].y, line[1].x, line[1].y)) {
        shape.colour = "red";
        shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);
    }
    if (circle.between(line[0].x, line[0].y, line[1].x, line[1].y)) {
        shape.colour = "blue";
        shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);
    }
    shape.line(line[0].x, line[0].y, line[1].x, line[1].y);
    box.draw();
    circle.draw();
}
