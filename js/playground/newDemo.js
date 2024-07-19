import { $ } from "../../lib/Pen.js";
$.use(update);

let file = $.loadTextFile("../../data/hello.txt");
let sampleGroup = $.makeGroup();
sampleGroup.push(1);
sampleGroup.push(2);
sampleGroup.push(3);
$.debug = true;
function update() {
    $.colour.fill="rgba(255,255,255,0.5)";
    $.colour.stroke="red";
    $.shape.oval($.mouse.x,$.mouse.y,100,100);
    $.shape.rectangle(10,10,10,10);
    $.text.print(100,100,file);
}