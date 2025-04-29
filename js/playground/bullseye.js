import {$} from "../../lib/TeachAndDraw.js"

$.use(update);
$.w = 400;
$.h = 400;

function update(){
    $.shape.alignment.x = "center";
    $.shape.alignment.y = "center";

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

    for(let i=0; i<5; i++){
        const size=100-i*21;
        $.shape.border="rgba(0,0,0,0)";
        if(size%2===0){
            $.shape.colour="red";
        } else { 
            $.shape.colour="white";
        }
        $.shape.oval($.mouse.x,$.mouse.y,size);
    }
}