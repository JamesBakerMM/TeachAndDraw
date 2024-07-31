import { $ } from "../../lib/Pen.js";

$.use(update);

console.log($.gui.theme);
$.gui.theme = "grevszfzd";

const btn = $.makeButton($.w / 2, $.h / 2, 200, 100, "jhsdkfjsdh");

function update() {
    btn.draw();
    if (btn.released) {
        console.log("kjhsdfkjsd");
    }
}
