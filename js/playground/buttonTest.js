import { $ } from "../../lib/TeachAndDraw.js";

$.use(update);
// $.debug = true;

// console.log($.text.size);
// console.log($.gui.theme);
// $.gui.theme = "grevszfzd";

const btn = $.makeButton(
    $.w / 2,
    $.h / 2,
    200,
    100,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus."
);

const btn2 = $.makeButton($.w / 2, $.h / 2 + 100, 200, 100, "small text");

function update() {
    btn.draw();
    if (btn.up) {
        console.log("btn.up");
    } else if (btn.down) {
        console.log("btn.down");
    }

    if (btn2.up) {
        console.log("btn2.up");
    } else if (btn2.down) {
        console.log("btn2.down");
    }
    btn2.draw(); // btn.up/down works regardless of draw order.
}
