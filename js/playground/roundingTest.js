import { $ } from "../../lib/TeachAndDraw.js";  

$.width = 800;
$.height = 800;
$.use(update);

let slider = $.makeSlider(100, $.height-100, 100);
slider.min = 0;
slider.value = 4;
slider.max = 32;

function update() {

    let radius = slider.value;
    $.shape.rounding = radius;

    // $.shape.polygon(100, 100, 400, 100, 400, 400);
    // $.shape.polygon(100+350, 100, 400+350, 100, 400+350, 400, 100+350, 400);
    $.shape.multiline(100, 500, 200, 400, 300, 600, 400, 500, 500, 450, 600, 550)

    for (let i=3; i<7; i++)
    {
        $.shape.ngon(200*(i-3)+100, 100, i, 75);
        $.text.print(200*(i-3)+100, 200, `${i}-gon`);
    }

    for (let i=7; i<11; i++)
    {
        $.shape.ngon(200*(i-7)+100, 300, i, 75);
        $.text.print(200*(i-7)+100, 400, `${i}-gon`);
    }

    $.shape.polygon(400, 650, 500, 550, 600, 600, 600, 750);

    $.text.print(slider.x, slider.y+25, `radius = ${radius}`);
    slider.draw();
}