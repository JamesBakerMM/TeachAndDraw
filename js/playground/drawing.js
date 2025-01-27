import { $ } from "../../lib/TeachAndDraw.js";  

$.use(update);

const drawpoints = new Array();


function update() {
    if ($.mouse.leftDown) {
        drawpoints.push($.makePoint($.mouse.x, $.mouse.y));
    }
    if ($.touch.down) {
        drawpoints.push($.makePoint($.touch.x, $.touch.y));
    }
    for (const point of drawpoints) {
        $.shape.oval(point.x, point.y, 5);
    }
}