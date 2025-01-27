import { $ } from "../../lib/TeachAndDraw.js";
$.use(update);

const exampleSound = $.loadSound("../../data/test.mp3");

function update(){
    if(exampleSound.isPlaying===false){
        exampleSound.startTime = 16;
        exampleSound.endTime = exampleSound.startTime + 2.25;
        exampleSound.play();
    } 

}
