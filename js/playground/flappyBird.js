import { tad, load, make } from "../../lib/TeachAndDraw.js";
tad.use(update);

const sampleSound = tad.load.sound("../../data/test.mp3");
const jason = tad.load.json("../../data/jason.json");
const dominance = tad.load.image(
    tad.w / 2,
    tad.h / 2,
    "../../images/tpose.png"
);
const me = tad.make.circleCollider(100, tad.h / 2, 50);

const pillars = tad.make.group();
let randomOffset = tad.math.random(-200, 200);
pillars.push(createPillar(tad.w - 100 + randomOffset, 100));
pillars.push(createPillar(tad.w - 100 + randomOffset, tad.h - 100));
me.image = dominance;
tad.debug = true;

const sampleBtn = tad.make.button(100, 100, 100, 20, "hello world");

sampleBtn.background = "green";

function update() {
    if (tad.time.frames == 1) {
        //tad.paused = true;
    }

    meUpdate();
    pillarUpdate();
    tad.drawColliders();
    sampleBtn.draw();
}

function pillarUpdate() {
    for (let pillar of pillars) {
        // if (pillar.collides(me)) {
        //     tad.shape.colour = "red";
        //     tad.shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);
        // }
        if (pillar.x < 0) {
            pillar.remove();
        }
    }
    if (pillars.length < 12) {
        randomOffset = tad.math.random(-200, 200);
        let yrandomoffset = tad.math.random(-50, 50);
        pillars.push(
            createPillar(tad.w * 2 - 100 + randomOffset, 100 + yrandomoffset)
        );
        pillars.push(
            createPillar(
                tad.w * 2 - 100 + randomOffset,
                tad.h - 100 - yrandomoffset
            )
        );
    }
}

function meUpdate() {
    window.me = me;
    if (tad.keys.down("uparrow")) {
        me.direction = 0
        me.speed = 20
    }
    // if (me.y > tad.h) {
    //     me.y = tad.h / 2;
    // }
    // if (me.x < 0) {
    //     me.x = tad.w / 2;
    // }
    // if(tad.keys.down("d")) {
    //     me.velocity.x +=1
    // }
    // if(tad.keys.down("a")) {
    //     me.velocity.x -=1
    // }
}

function createPillar(x, y) {
    const temp = tad.make.boxCollider(x, y, 20, 200);
    temp.direction = 90;
    temp.friction = 0;
    temp.mass = 100000;
    temp.speed = 20;
    return temp;
}
