import { $ } from "../../lib/Pen.js";

$.use(draw);
// $.debug=true;
let beegSprite = makeBeegSprite($.w / 2, $.h / 2);
let smallSprite = $.makeBoxCollider(20, $.h / 2,20,20);
smallSprite.friction=0;
smallSprite.velocity.x=12;
let leftGroup = $.makeGroup();
let rightGroup = $.makeGroup();

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 80; j++) {
        leftGroup.push(makeLeftShip(i * 20, 0 + 10 * j));
        rightGroup.push(makeRightShip(400 + i * 20, 10 + 10 * j));
    }
}
function draw() {
    if($.frameCount===2){
        // $.paused=true;
    }
    if(leftGroup.collides(rightGroup)){
        $.colour.fill="grey";
        $.shape.rectangle($.w/2,$.h/2,$.w,$.h);
    };
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
