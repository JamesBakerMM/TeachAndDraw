import { $ } from "../../lib/TeachAndDraw.js";

$.use(update);
$.w = 1024;
$.h = 1024;

$.debug=false;

const A = $.makeBoxCollider($.w/2 - 128, $.h/2, 64, 64);
const B = $.makeBoxCollider($.w/2 + 128, $.h/2, 64, 64);

function update() {
    if (A.collides($.mouse)) {
        A.fill = "rgb(100, 100, 255)";
    } else {
        A.fill = "rgb(255, 255, 255)";
    }

    if (B.overlaps($.mouse)) {
        B.fill = "rgb(100, 255,  100)";
    } else {
        B.fill = "rgb(255, 255, 255)";
    }

    $.drawColliders();
}