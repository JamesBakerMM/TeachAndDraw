import { $ } from "../../lib/Pen.js";

$.use(draw);
let beegSprite = makeBeegSprite($.w / 2, $.h / 2);
let leftGroup = $.makeGroup();
let rightGroup = $.makeGroup();

for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 80; j++) {
        leftGroup.push(makeLeftShip(i * 20, 0 + 10 * j));
        rightGroup.push(makeRightShip(400 + i * 20, 10 + 10 * j));
    }
}
function draw() {
    leftGroup.collides(leftGroup);
    rightGroup.collides(rightGroup);
    leftGroup.collides(rightGroup);
    leftGroup.collides(beegSprite);
    rightGroup.collides(beegSprite);
    $.drawAllColliders();
}

function makeBeegSprite(x, y) {
    const tempShip = $.makeBoxCollider(x, y, 100, 100);
    tempShip.static=false;
    tempShip.mass=100;
    return tempShip;
}

function makeLeftShip(x, y) {
    const tempShip = $.makeBoxCollider(x, y, 5, 5);
    tempShip.direction = 90;
    tempShip.friction = 1;
    tempShip.speed = 20;
    return tempShip;
}
function makeRightShip(x, y) {
    const tempShip = $.makeBoxCollider(x, y, 5, 5);
    tempShip.direction = 270;
    tempShip.friction = 1;
    tempShip.speed = 20;
    return tempShip;
}
