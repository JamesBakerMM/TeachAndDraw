import { $ } from"../../lib/Pen.js";

$.use(draw);
$.width  = 800;
$.height = 800;

function draw()
{
    $.text.print($.w/2, $.h/2, 'ABCDE', 32);
}

