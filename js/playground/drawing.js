import { Colour } from "../../lib/Colour.js";
import { Paint } from "../../lib/Paint.js";
import { $ } from "../../lib/TeachAndDraw.js";  
import { Vector } from "../../lib/Vector.js";

$.use(update);


class Stroke {

    /** @type {Number} */
    size = 4;

    /** @type {String} */
    colour = Paint.white;

    /** @type {Number[]} */
    sizes = [];

    /** @type {String[]} */
    colours = [];

    /** @type {Vector[]} */
    points = new Array();

    constructor(x, y, size=4) {
        this.size = size;
        this.pushPoint(x, y, size);
    }

    pushPoint(x, y, size=4) {
        this.points.push(new Vector(x, y));
        this.colours.push(strokeColour);
        this.sizes.push(size);
    }

    draw() {
        const S = this;
        for (let i=0; i<S.points.length-1; i++)
        {
            const p0 = S.points[i+0];
            const p1 = S.points[i+1];
            $.shape.border = S.colours[i];
            $.shape.colour = S.colours[i];
            $.shape.strokeWidth = S.sizes[i];
            $.shape.line(p0.x, p0.y, p1.x, p1.y);

            $.shape.strokeWidth = 0;
            // $.shape.oval(p0.x, p0.y, S.sizes[i+0]/32);
            $.shape.oval(p1.x, p1.y, S.sizes[i+1]/32);
        }
    }
}


class RectStroke {
    x0; y0; x1; y1;
    colour;

    constructor(x0, y0) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x0;
        this.y1 = y0;
        this.colour = strokeColour;
    }

    draw() {
        $.shape.colour = this.colour;
        $.shape.border = this.colour;
        const w = this.x1 - this.x0;
        const h = this.y1 - this.y0;
        $.shape.rectangle(this.x0+w/2, this.y0+h/2, w, h);
    }
}


class OvalStroke {
    x; y; w; h;
    colour;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.colour = strokeColour;
    }

    draw() {
        $.shape.colour = this.colour;
        $.shape.border = this.colour;
        $.shape.oval(this.x, this.y, this.w, this.h);
    }
}

/** @type {Stroke[]} */
let strokes = [];
let strokeColour = "green";


let toolState = toolStateClear;


function toolStateBrushIdle() {
    dropdownColour.x = toolButtons.brush.x;

    if ($.mouse.leftDown) {
        strokes.push(new Stroke($.mouse.x, $.mouse.y));
        toolState = toolStateBrushDragging;
    }
}


let mspeed = 0;

function toolStateBrushDragging() {
    const prevStroke = strokes[strokes.length-1];
    const prevPoints = prevStroke.points;
    const prevPoint  = prevPoints[prevPoints.length-1];
    const delta = $.math.distance($.mouse.previous.x, $.mouse.previous.y, $.mouse.x, $.mouse.y);
    const speed = delta / $.time.msElapsed;
    if (!isNaN(delta)) {
        mspeed = 0.95*mspeed + 0.05*speed;
    }
    if ($.math.distance(prevPoint.x, prevPoint.y, $.mouse.x, $.mouse.y) > 2*prevStroke.size) {
        prevStroke.pushPoint($.mouse.x, $.mouse.y, Math.max(4*mspeed, 4));
    }
    if ($.mouse.leftReleased) {
        mspeed = 0;
        toolState = toolStateBrushIdle;
    }
}




function toolStateRectIdle() {
    dropdownColour.x = toolButtons.rect.x;
    if ($.mouse.leftDown) {
        strokes.push(new RectStroke($.mouse.x, $.mouse.y));
        toolState = toolStateRectDragging;
    }
}

function toolStateRectDragging() {
    const prevStroke = strokes[strokes.length-1];
    prevStroke.x1 = $.mouse.x;
    prevStroke.y1 = $.mouse.y;
    if ($.mouse.leftReleased) {
        toolState = toolStateRectIdle;
    }
}



function toolStateOvalIdle() {
    dropdownColour.x = toolButtons.oval.x;
    if ($.mouse.leftDown) {
        strokes.push(new OvalStroke($.mouse.x, $.mouse.y));
        toolState = toolStateOvalDragging;
    }
}

function toolStateOvalDragging() {
    const prevStroke = strokes[strokes.length-1];
    prevStroke.w = $.math.abs($.mouse.x - prevStroke.x);
    prevStroke.h = $.math.abs($.mouse.y - prevStroke.y);
    if ($.mouse.leftReleased) {
        toolState = toolStateOvalIdle;
    }
}



function toolStateUndo() {
    if (strokes.length > 0)
        strokes.pop();
    toolState = toolStateIdle;
}

function toolStateClear() {
    dropdownColour.x = $.w + 50;
    strokes = [];
    toolState = toolStateIdle;
}

function toolStateIdle() {

}



let dropdownColour = $.makeDropdown(
    50, 50, 100, ["white", "black", "grey", "red", "blue", "green", "orange", "yellow", "purple", "pink"]
);

let toolButtons = {
    rect:  $.makeButton( 50, 15, 100, 30, "Rect"),
    oval:  $.makeButton(150, 15, 100, 30, "Oval"),
    brush: $.makeButton(250, 15, 100, 30, "Brush"),
    undo:  $.makeButton(350, 15, 100, 30, "Undo"),
    clear: $.makeButton($.w-50, 15, 100, 30, "Clear"),
};

let drawables = [
    dropdownColour,
    toolButtons.rect,
    toolButtons.oval,
    toolButtons.brush,
    toolButtons.undo,
    toolButtons.clear,
];


function update() {

    if (toolButtons.rect.released)
        toolState = toolStateRectIdle;
    if (toolButtons.oval.released)
        toolState = toolStateOvalIdle;
    if (toolButtons.brush.released)
        toolState = toolStateBrushIdle;
    if (toolButtons.undo.released)
        toolState = toolStateUndo;
    if (toolButtons.clear.released)
        toolState = toolStateClear;

    strokeColour = dropdownColour.value;
    toolState();

    for (let S of strokes) {
        S.draw();
    }

    for (let D of drawables) {
        D.draw();
    }

}