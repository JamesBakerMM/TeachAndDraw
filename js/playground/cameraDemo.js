import { $ } from "../../lib/Pen.js";
$.use(update);

$.debug = true;

const demoImage=$.loadImage(20,20,"../../images/tpose.png");
demoImage.movedByCamera=false;

function update(){
    if($.keys.down("a")){
        $.camera.x--
    }
    if($.keys.down("d")){
        $.camera.x++
    }
    if($.keys.down("w")){
        $.camera.y--
    }
    if($.keys.down("s")){
        $.camera.y++
    } 
    demoImage.draw();
}