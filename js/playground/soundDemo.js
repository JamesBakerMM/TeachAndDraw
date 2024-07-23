import { $ } from "../../lib/Pen.js";
$.use(update);

const exampleSound = $.loadSound("../../data/test.mp3");

function update(){
    if(exampleSound.isPlaying===false){
        exampleSound.play();
    } 

}