import { $ } from "../../lib/Pen.js";
$.use(update);

const sampleSound = $.loadSound("../../data/test.mp3");
const jason = $.loadJsonFile("../../data/jason.json");
const dominance = $.loadImageToStamp($.w/2,$.h/2,"../../images/tpose.png");
const me = $.makeCircleCollider(100,$.h/2,50);

const pillars = $.makeGroup();
let randomOffset= $.math.random(-200,200);
pillars.push(createPillar($.w-100+randomOffset,100));
pillars.push(createPillar($.w-100+randomOffset,$.h-100));
me.asset = dominance;
$.debug = true;


const sampleBtn = $.makeButton(100,100,100,20,"hello world");


sampleBtn.background="green";

function update() {
    if ($.frameCount == 1) {
        //$.paused = true;
    }

    meUpdate();
    pillarUpdate();
    $.drawColliders();
    sampleBtn.draw();
}

function pillarUpdate() {
    for (let pillar of pillars) {
        if (pillar.collides(me)) {
            $.colour.fill = "red";
            $.shape.rectangle($.w / 2, $.h / 2, $.w, $.h);
        }
        if(pillar.x < 0) {
            pillar.remove();
        }
    }
    if(pillars.length<12){
        randomOffset= $.math.random(-200,200);
        let yrandomoffset = $.math.random(-50,50)
        pillars.push(createPillar($.w*2-100+randomOffset,100+yrandomoffset));
        pillars.push(createPillar($.w*2-100+randomOffset,$.h-100-yrandomoffset));
    }
    
}

function meUpdate() {
    me.velocity.y += 1;
    if ($.keys.down("uparrow")) {
        me.velocity.y -= 2;
    }
}

function createPillar(x,y){
    const temp = $.makeBoxCollider(x,y,20,200);
    temp.direction = 270;
    temp.friction = 0;
    temp.mass=100000;
    temp.speed = 20;
    return temp;
}