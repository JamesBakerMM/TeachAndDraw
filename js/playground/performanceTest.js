import { $ } from "../../lib/Pen.js";
import { PerformanceMetrics } from "../../lib/PerformanceMetrics.js";
$.debug = false;

$.use(update);
$.width  = 512;
$.height = 512;



function setup()
{
    // Performance.collisionGroupFasterThanArray($);
}

setup();




function update() {

    // const G0 = $.makeGroup();
    // const A = $.makeCircleCollider(256, 256, 32);


    $.drawColliders();
}
