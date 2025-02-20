import { $ } from "../../lib/TeachAndDraw.js";
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

    for (let i=0; i<groups.length; i++)
    {
        groups[i].draw();

        for (let j=i+1; j<groups.length; j++)
        {
            groups[i].collides(groups[j]);
        }
    }
}
