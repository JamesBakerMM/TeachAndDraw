import { $ } from "../../lib/TeachAndDraw.js";
$.use(update);

const exampleSound = $.loadSound("../../data/test.mp3");
let start = 0;

function update(){

    if (exampleSound.isPlaying===false) {
        exampleSound.endTime = 8.0 + 2.5;
        exampleSound.startTime = start;
        exampleSound.play();
        start += 1;
    }

}
