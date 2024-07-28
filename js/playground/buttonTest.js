import { $ } from "../../lib/Pen.js";

$.use(update);

const btn = $.makeButton($.w/2,$.h/2,200,100,"jhsdkfjsdh");

function update() {
    btn.draw();
    if(btn.released){
        console.log("kjhsdfkjsd");
    }
}