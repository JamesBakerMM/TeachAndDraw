import {$} from "../../lib/Pen.js";

$.use(draw);

let leftGroup=$.makeGroup(); 
let rightGroup=$.makeGroup(); 
for(let i=0; i<3; i++){
    leftGroup.push(makeLeftShip(400,100+100*i));
    rightGroup.push(makeRightShip(200,100+100*i));
}
function draw(){
    leftGroup.collides(rightGroup);

    $.drawAllColliders();
}

function makeLeftShip(x,y){
    const tempShip = $.makeBoxCollider(x,y,20,20);
    tempShip.direction=270;
    tempShip.friction=0;
    tempShip.speed=20;
    return tempShip;
}
function makeRightShip(x,y){
    const tempShip = $.makeBoxCollider(x,y,20,20);
    tempShip.direction=90;
    tempShip.friction=0;
    tempShip.speed=20;
    return tempShip;
}