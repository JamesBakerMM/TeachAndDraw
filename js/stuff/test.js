import { $, shape, colour, mouse, keys, text } from "../../lib/Pen.js";

$.use(draw);

let testImage=$.loadImage(0,0,"./images/fac0_refinery.png");
let playerCar=$.makeBoxCollider(20,20,20,20);
playerCar.asset=testImage;

function draw(){
    playerCar.rotation=playerCar.direction;
    if($.keys.down("d")){
        playerCar.direction+=1;
    }
    if($.keys.down("a")){
        playerCar.direction-=1;
    }
    if($.keys.down("w")){
        playerCar.speed+=2;
    }
    if($.keys.down("s")){
        playerCar.speed-=2;
    }
    playerCar.draw();
}