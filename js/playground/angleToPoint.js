import { $ } from "../../lib/TeachAndDraw.js";  

$.use(update);

const test = $.makeBoxCollider($.w/2, $.h/2, 20, 20);

function update() {
    test.rotation = test.getAngleToPoint($.mouse.x, $.mouse.y);
    $.shape.line(test.x, test.y, $.mouse.x, $.mouse.y);
    
    test.draw();
}