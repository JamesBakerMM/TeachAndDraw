import { $ } from "../../lib/Pen.js"

$.use(draw);
$.width  = 800;
$.height = 800;

let theta   = 0;
let size    = 16;
let sizedir = 1;

function draw() {

    $.text.rotation = theta;
    $.text.print(100, 100, "Rotating text!", 48);
    $.text.print(250, 100, "Rotating text!");

    
    if (size <= 16)      sizedir = +0.2;
    else if (size >= 32) sizedir = -0.2;
    size += sizedir;

    $.text.size = size;
    $.text.print(400, 100, "Rotating text!", 96);
    $.text.size = 16;



    theta += 1;
}