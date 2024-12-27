import { $ } from "../../lib/Pen.js";

$.use(update);

let dropdown1 = $.makeDropdown(200, 300, 150, [
    "Option A",
    "Option B",
    "Option C"
]);

let dropdown2 = $.makeDropdown( 400, 300, 150, [
    "Option X",
    "Option Y",
    "Option Z"
]);

let dropdown3 = $.makeDropdown(600, 300, 150, [
    "Option Q",
    "Option R",
    "Option S"
]);


function update() {
    dropdown1.border = "lime";
    dropdown2.border = "purple";
    dropdown3.border = "rgb(100, 250, 250)";

    dropdown1.draw();
    dropdown2.draw();
    dropdown3.draw();
}