import {$} from "../../lib/TeachAndDraw.js";

$.use(update);

const colours = {
    palegreen : "#92d2af",
    green : "#5ac632",
    darkgreen : "#446808",
    paleblue : "#b0fff5",
    blue : "#3ca9c6",
    darkblue : "#132c54",
    palered : "#f46c70",
    red : "#ad1f1e",
    darkred : "#55080e"
};
let selectedColour=colours.red;
const btns = $.makeGroup();

let counter = 0;
for (const key of Object.keys(colours)) {
    counter += 1;
    btns.push(makeExampleBtn(100, counter * 50, "opt" + counter, key));
}

function makeExampleBtn(x, y, label, name) {
    const btn = $.makeButton(x, y, 100, 50, label);
    btn.name = name;
    return btn;
}
const text = $.makeTextArea($.w/2,$.h-100,100);
console.log($.storage)
function update() {
    $.colour.fill=selectedColour;
    $.shape.rectangle($.w/2,$.h/2,$.w,$.h);
    for(const btn of btns){
        if(btn.down){
            selectedColour = btn.name;
        }
    }
    $.colour.fill="white";
    $.text.print($.w/2,$.h/2,$.storage.name)
    if(text.value.trim()!==""){
        $.storage.name = text.value;
    }
    text.draw();
    btns.draw();
}
