import { $ } from "../../lib/TeachAndDraw.js";
import { Paint } from "../../lib/Paint.js";
$.use(update);

let groups = []

for (let i=0; i<10; i++) {
    let group = $.makeGroup();
    let rad = $.math.random(16, 32);

    let x0 = $.math.random(0, $.w);
    let y0 = $.math.random(0, $.h);

    for (let j=0; j<16; j++) {
        let dx = 4 * rad * $.math.random(-1, +1);
        let dy = 4 * rad * $.math.random(-1, +1);
        let ball = $.makeCircleCollider(x0+dx, y0+dy, rad);
        ball.velocity.x = $.math.random(-4, +4);
        ball.velocity.y = $.math.random(-4, +4);
        ball.friction = 0.001;
        group.push(ball);
    }
    groups.push(group);
}


function update() {

    $.shape.movedByCamera = true;
    $.shape.strokeWidth = 2;
    $.shape.border = Paint.white;
    $.shape.colour = Paint.white;

    for (let i=0; i<=$.w; i+=50) {
        $.shape.line(i, 0, i, $.h);
    }

    for (let i=0; i<=$.h; i+=50) {
        $.shape.line(0, i, $.w, i);
    }


    for (let i=0; i<groups.length; i++)
    {
        groups[i].draw();

        for (let j=i+1; j<groups.length; j++)
        {
            groups[i].collides(groups[j]);
        }
    }


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
        $.camera2.zoom *= 1.01;
    }
    if ($.keys.down("k")) {
        $.camera2.zoom *= 0.99;
    }
}
