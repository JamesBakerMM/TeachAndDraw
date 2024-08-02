import { $ } from "../../lib/Pen.js";

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
        console.log("kjhsdfkjsd");
    }
    btn2.draw();
}
