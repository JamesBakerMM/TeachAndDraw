import { $ } from "../../lib/Pen.js";

$.use(update);

// test widths, test steps
// test marks
// test settings min/max/value incorrectly
// test steps correct/incorrect
// test the different numbers in the popup
// test turning all parts on/off
const slider = $.makeSlider(    
    $.w / 2,
    $.h / 2,
    350
);
// slider.value = 110;
// slider.max = 100;
slider.min = -10;
slider.value = 50;
slider.max = 100;

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
    const slider = $.makeSlider($.w/2 - 230, 50 * i + 50, 50 * i + 10);
    slider.min = -((10) ** i);
    slider.value = 0;
    slider.max = (10) ** i;
    slider.step = slider.max / 10;
    sliderGroup2.push(slider);
}


function update() {
    // for(const box of boxGroup){
    //     if(box.name==="red" && box.checked){
    //         $.colour.fill=boxGroup[0].value;
    //         $.shape.rectangle($.w/2,$.h/2,$.w,$.h);
    //     }
    // }
    sliderGroup1.draw();
    sliderGroup2.draw();
}
