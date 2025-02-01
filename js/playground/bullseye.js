import {$} from "../../lib/TeachAndDraw.js"

$.use(update);
$.w = 400;
$.h = 400;

function update(){
    for(let i=0; i<5; i++){
        const size=100-i*21;
        $.colour.stroke="rgba(0,0,0,0)";
        if(size%2===0){
            $.colour.fill="red";
        } else { 
            $.colour.fill="white";
        }
        $.shape.oval($.mouse.x,$.mouse.y,size);
    }
}