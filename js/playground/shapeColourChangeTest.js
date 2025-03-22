import { $ } from "../../lib/TeachAndDraw.js";

const test = $.makeCircleCollider(20, 20, 20);
test.friction = 0;
test.velocity.x = 10;
const testGroup = $.makeGroup();
testGroup.push(test);

const btn = $.makeButton(90, 100, 100, 20, "test");
const chkBox = $.makeCheckbox(90, 120, 20, 20);
const slider = $.makeSlider(90, 150, 100);
const drop = $.makeDropdown(90, 200, 100, ["test", "test2"]);
const txt = $.makeTextArea(200, 20, 100);

const img = $.loadImage(20, 20, "./images/sample.png");
img.direction = 120;
img.speed = 2;

const anim = $.loadAnimation(
    20,
    20,
    "./images/sample.png",
    "./images/sample.png",
    "./images/sample.png"
);

const box = $.makeBoxCollider(20, 20, 20, 20);

$.use(update);
// $.debug = true;
function update() {
    $.shape.colour = "red";
    $.shape.rectangle($.w / 2, $.h / 2, 200, 50);
    $.shape.colour = "grey";
    $.text.print($.w / 2, $.h / 2 + 50, "cry");
    $.text.colour = "white";
    $.text.print($.w / 2, $.h / 2 + 75, "cry");
    $.shape.rectangle($.w / 2, $.h / 2 + 125, 200, 50);
    btn.draw();
    test.draw();
    testGroup.draw();
    chkBox.draw();
    drop.draw();
    slider.draw();
    txt.draw();
    box.draw();
    img.draw();
    anim.draw();
}
