import { Paint } from "../../lib/Paint.js";
import { $ } from "../../lib/TeachAndDraw.js";  

$.width = 800;
$.height = 800;
$.use(update);

let slider = $.makeSlider(100, $.height-100, 100);
slider.min = 0;
slider.value = 1;
slider.max = 64;


function ngon( x, y, n, width, height=width )
{
    const TAU = 2.0 * Math.PI;
    const points = [];

    let p0x = width * Math.cos(TAU);
    let p0y = height * Math.sin(TAU);
    let p1x = p0x;
    let p1y = p0y;

    points.push(x+p0x);
    points.push(y+p0y);

    for (let i=1; i<n; i++)
    {
        const theta = TAU * (i/n);

        p1x = width * Math.cos(theta);
        p1y = height * Math.sin(theta);

        points.push(x+p1x);
        points.push(y+p1y);
    }

    $.shape.polygon(...points);
}


function update() {
    $.shape.movedByCamera = true;
    $.shape.colour = Paint.grey;
    $.shape.border = Paint.white;

    $.shape.rounding = slider.value;
    $.shape.multiline(100, 500, 200, 400, 300, 600, 400, 500, 500, 450, 600, 550);

    for (let i=3; i<7; i++)
    {
        ngon(200*(i-3)+100, 100, i, 75);
        $.text.print(200*(i-3)+100, 200, `${i}-gon`);
    }

    for (let i=7; i<11; i++)
    {
        ngon(200*(i-7)+100, 300, i, 75);
        $.text.print(200*(i-7)+100, 400, `${i}-gon`);
    }

    $.shape.polygon(400, 650, 500, 550, 600, 600, 600, 750);
    $.shape.multiline(650, 500, 750, 500, 650, 600, 750, 650);

    $.text.print(slider.x, slider.y+25, `radius = ${slider.value}`);
    slider.draw();


    if ($.keys.down("leftArrow")) {
        $.camera2.x -= 1;
    }
    if ($.keys.down("rightArrow")) {
        $.camera2.x += 1;
    }
    if ($.keys.down("upArrow")) {
        $.camera2.y -= 1;
    }
    if ($.keys.down("downArrow")) {
        $.camera2.y += 1;
    }

	if ($.keys.down("q")) {
        $.camera2.rotation -= 0.01;
    }
    if ($.keys.down("e")) {
        $.camera2.rotation += 0.01;
    }

	if ($.keys.down("i")) {
        $.camera2.zoom *= 1.01;
    }
    if ($.keys.down("k")) {
        $.camera2.zoom *= 0.99;
    }
}