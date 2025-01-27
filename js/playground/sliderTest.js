import { $ } from "../../lib/TeachAndDraw.js";

$.use(update);

const slider = $.makeSlider(    
    $.w / 2,
    $.h / 2 + 200,
    350
);

slider.min = -100; // Must be below max, above -1,000,000, below value, and not NaN or Infinity
slider.value = 50; // Must be between max and min, and not NaN or Infinity
slider.max = 100; // Must be above min, below 1,000,000, above value, and not NaN or Infinity
slider.step = 10; // Must be a positive integer that perfectly divides into the range, and not NaN or Infinity
slider.name = "Test slider"; // Must be a string

const sliderGroup1 = $.makeGroup();
for (let i = 1; i < 7; i++) {
    const slider = $.makeSlider($.w/2 - 230, 50 * i + 50, 50 * i + 10);
    slider.min = -((10) ** i);
    slider.value = 0;
    slider.max = (10) ** i;
    slider.step = slider.max / 10;
    sliderGroup1.push(slider);
}

const sliderGroup2 = $.makeGroup();
for (let i = 1; i < 7; i++) {
    const slider = $.makeSlider($.w/2, 50 * i + 50, 120);
    sliderGroup2.push(slider);
}
sliderGroup2[0].step = 1;
sliderGroup2[1].step = 2;
sliderGroup2[2].step = 5;
sliderGroup2[3].step = 10;
sliderGroup2[4].step = 25;
sliderGroup2[5].step = 50;

$.gui.accentColour = "yellow";
$.gui.primaryColour = "lightblue";
$.gui.secondaryColour = "black";
$.gui.textColour = "green";


const sliderGroup3 = $.makeGroup();
for (let i = 0; i < 3; i++) {
    const slider = $.makeSlider($.w/2 + 150, 50 * i + 100, 120);
    slider.step = 10;
    sliderGroup3.push(slider);
}
sliderGroup3[0].showMarks = false; // Must be a boolean
sliderGroup3[1].showPopup = false; // Must be a boolean
sliderGroup3[2].showMarks = false;
sliderGroup3[2].showPopup = false;


function update() {
    // for(const box of boxGroup){
    //     if(box.name==="red" && box.checked){
    //         $.colour.fill=boxGroup[0].value;
    //         $.shape.rectangle($.w/2,$.h/2,$.w,$.h);
    //     }
    // }
    slider.draw();
    sliderGroup1.draw();
    sliderGroup2.draw();
    sliderGroup3.draw();
}
