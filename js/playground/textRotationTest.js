import { $ } from "../../lib/Pen.js"

$.use(draw);
$.width  = 800;
$.height = 800;


function draw() {

    $.text.print(100, 100, "Test");
    $.text.rotation = 45;
    $.text.print(200, 100, "Test");

}