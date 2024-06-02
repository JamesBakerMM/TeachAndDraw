import { $ } from "../../lib/Pen.js";

$.use(draw);
let beegSprite = makeBeegSprite($.w / 2, $.h / 2);
let leftGroup = $.makeGroup();
let rightGroup = $.makeGroup();
for (let i = 0; i < 5; i++) {
    leftGroup.push(makeLeftShip(700, 100 + 100 * i));
    rightGroup.push(makeRightShip(100, 100 + 100 * i));
}
function draw() {
    leftGroup.collides(rightGroup);
    beegSprite.collides(leftGroup);
    beegSprite.collides(rightGroup);
    $.drawAllColliders();
}

function makeBeegSprite(x, y) {
    const tempShip = $.makeBoxCollider(x, y, 100, 100);
    tempShip.static=true;
    return tempShip;
}

function makeLeftShip(x, y) {
    const tempShip = $.makeBoxCollider(x, y, 20, 20);
    tempShip.direction = 270;
    tempShip.friction = 0;
    tempShip.speed = 20;
    return tempShip;
}
function makeRightShip(x, y) {
    const tempShip = $.makeBoxCollider(x, y, 20, 20);
    tempShip.direction = 90;
    tempShip.friction = 0;
    tempShip.speed = 20;
    return tempShip;
}
