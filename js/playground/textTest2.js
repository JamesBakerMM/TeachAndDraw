import { tad, load, make, math, shape } from "../../lib/TeachAndDraw.js";

tad.use(update);

const text = load.text("./data/hello.txt");

tad.debug = true;

const grp = make.group();
grp.push(1, 2, 3);

console.log(grp);

function update() {
    if (tad.time.frames === 0) {
        console.log(text);
        console.log(text.type);
    }

    math.abs(20);
}
