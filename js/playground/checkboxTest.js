import { $ } from "../../lib/Pen.js";

$.use(update);
const checkbox = $.makeCheckbox(    
    $.w / 2 + 200,
    $.h / 2,
    30
);
const slider = $.makeSlider(    
    $.w / 2,
    $.h / 2,
    350
);
// slider.value = 110;
// slider.max = 100;
slider.min = -10000;
slider.value = 0;
slider.max = 10000;

const boxGroup = $.makeGroup();
for(let i=0; i<10; i++) {
    boxGroup.push($.makeCheckbox(20+i*30,60,20));
}

boxGroup[0].name="red";
boxGroup[0].value="red";
boxGroup[0].accentColour="red";
boxGroup[0].backgroundColour="red";
boxGroup[2].accentColour="yellow";
const button = $.makeButton(
    $.w/2-200,
    $.h/2,
    100,
    50
)
// checkbox.checked = "true";

function update() {
    for(const box of boxGroup){
        if(box.name==="red" && box.checked){
            $.colour.fill=boxGroup[0].value;
            $.shape.rectangle($.w/2,$.h/2,$.w,$.h);
        }
    }
    boxGroup.draw();
    checkbox.draw();
    button.draw();
    slider.draw();
    // console.log(slider);
}
