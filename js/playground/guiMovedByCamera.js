import { tad, time, math, make, camera } from "../../lib/TeachAndDraw.js";

tad.use(update);

const btn = make.button(tad.w / 2, tad.h / 2, 100, 50, "test");
btn.rotation = 45;
const otherBtn = make.button(tad.w / 2 + 100, tad.h / 2, 100, 50, "test");
otherBtn.rotation = 90;
otherBtn.movedByCamera = false;

const dropTest = make.dropdown(tad.w / 2, tad.h / 2, 100, ["test", "a", "b"]);
dropTest.rotation = 70;
dropTest.movedByCamera = false;

const textArea = make.textArea(tad.w / 2, tad.h / 2 + 100, 100);
textArea.movedByCamera = false;

const checkTest = make.checkbox(100, tad.h / 2, 100, 100);

tad.debug = true;

function update() {
    // console.log("update");
    camera.y = tad.h / 2 + math.sin(time.frames) * 100;

    if (btn.down) {
        console.log("btn went down");
    }

    if (otherBtn.down) {
        console.log("otherBtn went down");
    }
    btn.draw();
    otherBtn.draw();
    dropTest.draw();

    textArea.draw();
    checkTest.draw();
}
