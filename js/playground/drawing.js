import { $ } from "../../lib/TeachAndDraw.js";  
import { Vector } from "../../lib/Vector.js";

$.use(update);



class Stroke {
    /** @type {String} */
    colour;
    constructor(colour) { this.colour = colour; }
    draw() {  }
    translate(x, y) {  }
}
/** @type {Array<Stroke[]>} */
const allLayers = [[], [], [], []];

const layerSelectButtons = [
    $.make.button($.w-50,  50, 75, 25, "Layer 0"),
    $.make.button($.w-50,  80, 75, 25, "Layer 1"),
    $.make.button($.w-50, 110, 75, 25, "Layer 2"),
    $.make.button($.w-50, 140, 75, 25, "Layer 3"),
];

const layerHideButtons = [
    $.make.button($.w-100,  50, 25, 25, "👁"),
    $.make.button($.w-100,  80, 25, 25, "👁"),
    $.make.button($.w-100, 110, 25, 25, "👁"),
    $.make.button($.w-100, 140, 25, 25, "👁"),
];

const layerVisibility = [
    true, true, true, true
];


function update() {

    for (let i=0; i<allLayers.length; i++) {
        if (layerVisibility[i] == true) {
            for (let S of allLayers[i]) {
                S.draw();
            }
        }
    }


    DrawTool.btnHovered = false;

    for (let i=0; i<layerSelectButtons.length; i++) {
        if (layerHideButtons[i].hovered) {
            DrawTool.btnHovered = true;
        }
        if (layerHideButtons[i].released) {
            layerVisibility[i] = !layerVisibility[i];
        }
        if (layerVisibility[i]) {
            layerHideButtons[i].label = "👁";
        } else {
            layerHideButtons[i].label = "🗙";
        }
        layerHideButtons[i].draw();

        if (layerSelectButtons[i].hovered) {
            DrawTool.btnHovered = true;
        }
        if (layerSelectButtons[i].released) {
            DrawTool.currLayer = i;
        }
        if (DrawTool.currLayer == i) {
            layerSelectButtons[i].background = "grey";
            layerSelectButtons[i].textColour = "white";
        } else {
            layerSelectButtons[i].background = "white";
            layerSelectButtons[i].textColour = "grey";
        }
        layerSelectButtons[i].draw();
    }

    DrawTool.currTool.update();
    for (let T of allTools) {
        T.draw();
    }
}




class BrushStroke extends Stroke {
    /** @type {Number} */
    size;

    /** @type {Number[]} */
    points = [];

    constructor(x, y, size, colour) {
        super(colour);
        this.size = size;
        this.pushPoint(x, y, size);
        this.pushPoint(x, y, size);
    }

    pushPoint(x, y) {
        this.points.push(x);
        this.points.push(y);
    }

    draw() {
        $.shape.strokeWidth = this.size;
        $.shape.colour = this.colour;
        $.shape.border = this.colour;
        $.shape.multiline(...this.points);
    }

    translate(x, y) {
        for (let i=0; i<this.points.length/2; i++) {
            this.points[2*i+0] += x;
            this.points[2*i+1] += y;
        }
    }

}


class RectStroke extends Stroke {
    x0; y0; x1; y1;

    constructor(x0, y0, colour) {
        super(colour);
        this.x0=x0; this.y0=y0;
        this.x1=x0; this.y1=y0;
        this.colour = colour;
    }

    draw() {
        $.shape.colour = this.colour;
        $.shape.border = this.colour;
        const w = this.x1 - this.x0;
        const h = this.y1 - this.y0;
        $.shape.rectangle(this.x0+w/2, this.y0+h/2, w, h);
    }

    translate(x, y) {
        this.x0+=x; this.y0+=y;
        this.x1+=x; this.y1+=y;
    }
}


class OvalStroke extends Stroke {
    x; y; w; h;

    constructor(x, y, colour) {
        super(colour);
        this.x=x; this.y=y;
        this.w=1; this.h=1;
    }

    draw() {
        $.shape.colour = this.colour;
        $.shape.border = this.colour;
        $.shape.strokeWidth = 1;
        $.shape.oval(this.x, this.y, this.w, this.h);
    }

    translate(x, y) {
        this.x+=x; this.y+=y;
    }
}



import { Button } from "../../lib/Button.js";
import { Dropdown } from "../../lib/Dropdown.js";

class DrawTool {
    /** @type {DrawTool} */
    static currTool = undefined;
    /** @type {DrawTool} */
    static prevTool = undefined;
    /** @type {Number} */
    static currLayer = 0;
    static btnHovered = false;

    static switchTool(tool) {
        if (DrawTool.currTool == undefined) {
            DrawTool.prevTool = tool;
            DrawTool.currTool = tool;
        } else {
            DrawTool.currTool.isDown = false;
            DrawTool.prevTool = DrawTool.currTool;
            DrawTool.currTool = tool;
        }
    }

    /** @type {Button} */
    button;
    /** @type {Dropdown} */
    colourDropdown;
    
    static #btnx = 50;
    static #colourOptions = [
        "white", "black", "grey",
        "green", "blue", "red", "purple", "aqua", "pink", "yellow", "brown", "orange",
    ];
    isDown = false;

    constructor(label) {
        this.button = $.make.button(DrawTool.#btnx, 15, 100, 30, label);
        this.colourDropdown = $.makeDropdown(
            DrawTool.#btnx, this.button.y+this.button.h, 100,
            DrawTool.#colourOptions
        );
        DrawTool.#btnx += 100;
    }

    update() {
        // let btnHovered = false;

        for (let T of allTools) {
            if (T.button.hovered) {
                DrawTool.btnHovered = true;
            }
            if (T.button.released) {
                DrawTool.switchTool(T);
                break;
            }
        }

        if ($.mouse.leftDown && !this.isDown && !DrawTool.btnHovered) {
            this.isDown = true;
            this.beginStroke();
        } else if ($.mouse.leftReleased) {
            this.isDown = false
            this.endStroke();
        } else if (this.isDown) {
            this.midStroke();
        }
    }

    draw(drawDropdown=true) {
        if (DrawTool.currTool == this) {
            this.button.background = "grey"
            this.button.textColour = "white"
        } else {
            this.button.background = "white";
            this.button.textColour = "grey"
        }

        this.colourDropdown.accentColour = this.colourDropdown.value;
        this.colourDropdown.secondaryColour = this.colourDropdown.value;

        if (this.colourDropdown.open) {
            for (let i=0; i<this.colourDropdown.options.length; i++) {
                if (this.colourDropdown.isHoverOnOption(i)) {
                    this.colourDropdown.accentColour = this.colourDropdown.options[i];
                    this.colourDropdown.secondaryColour = this.colourDropdown.options[i];
                    break;
                }
            }
        }

        $.state.save();
        this.button.draw();
        if (drawDropdown)
            this.colourDropdown.draw();
        $.state.load();
    }

    pushStroke(stroke) {
        allLayers[DrawTool.currLayer].push(stroke);
    }
    popStroke() {

    }
    topStroke() {
        const layer = allLayers[DrawTool.currLayer];
        return layer[layer.length-1];
    }
    beginStroke() {  }
    midStroke() {  }
    endStroke() {  }
}

class DrawToolBrush extends DrawTool {
    mspeed = 0;
    prevxy = new Vector(0, 0);
    constructor() { super("Brush"); }
    beginStroke() {
        console.log(this.button.label);

        this.pushStroke(new BrushStroke($.mouse.x, $.mouse.y, 4, this.colourDropdown.value));
        this.prevxy.x = $.mouse.x;
        this.prevxy.y = $.mouse.y;
    }
    endStroke() {
        this.mspeed = 0;
    }
    midStroke() {
        const layer = allLayers[DrawTool.currLayer];
        const prevStroke = layer[layer.length-1];
        const delta = $.math.distance($.mouse.previous.x, $.mouse.previous.y, $.mouse.x, $.mouse.y);
        const speed = delta / $.time.msElapsed;
        if (!isNaN(delta)) {
            this.mspeed = 0.95*this.mspeed + 0.05*speed;
        }
        if ($.math.distance(this.prevxy.x, this.prevxy.y, $.mouse.x, $.mouse.y) > 2*prevStroke.size) {
            prevStroke.pushPoint($.mouse.x, $.mouse.y, Math.max(4*this.mspeed, 4));
            this.prevxy.x = $.mouse.x;
            this.prevxy.y = $.mouse.y;
        }
    }
}

class DrawToolRect extends DrawTool {
    constructor() { super("Rect"); }
    beginStroke() {
        this.pushStroke(new RectStroke($.mouse.x, $.mouse.y, this.colourDropdown.value));
    }
    midStroke() {
        const layer = allLayers[DrawTool.currLayer];
        const prevStroke = layer[layer.length-1];
        prevStroke.x1 = $.mouse.x;
        prevStroke.y1 = $.mouse.y;
    }
}

class DrawToolOval extends DrawTool {
    constructor() { super("Oval"); }
    beginStroke() {
        this.pushStroke(new OvalStroke($.mouse.x, $.mouse.y, this.colourDropdown.value));
    }
    midStroke() {
        const layer = allLayers[DrawTool.currLayer];
        const prevStroke = layer[layer.length-1];
        prevStroke.w = $.math.abs($.mouse.x - prevStroke.x);
        prevStroke.h = $.math.abs($.mouse.y - prevStroke.y);
    }
}

class DrawToolGrab extends DrawTool {
    constructor() { super("Grab"); }

    midStroke() {
        const layer = allLayers[DrawTool.currLayer];
        for (let S of layer) {
            S.translate($.mouse.x-$.mouse.previous.x, $.mouse.y-$.mouse.previous.y);
        }
    }
    draw() {
        super.draw(false);
    }
}

class DrawToolUndo extends DrawTool {
    constructor() { super("Undo"); }
    update() {
        console.log(this.button.label);
        // if (this.button.released && allStrokes.length > 0) {
            allLayers[DrawTool.currLayer].pop();
            DrawTool.currTool = DrawTool.prevTool;
        // }
    }
    draw() {
        super.draw(false);
    }
}

class DrawToolClear extends DrawTool {
    constructor() { super("Clear"); }
    update() {
        allLayers[DrawTool.currLayer].length = 0;
        DrawTool.currTool = DrawTool.prevTool;
    }
    draw() {
        super.draw(false);
    }
}


class DrawToolPopLayer extends DrawTool {
    constructor() {
        super("-");
        this.button.x = $.w-50;
        this.button.y = 50;
        this.button.w = 25;
        this.button.h = 25;
    }
    update() {
        allLayers.pop();
        DrawTool.currTool = DrawTool.prevTool;
    }
    draw() {
        let y = 50;
        for (let i=0; i<allLayers.length; i++) {
            // $.shape.rectangle(this.button.x, y, 50, 50);
            y += 50;
        }
        this.button.y = y;
        super.draw(false);
    }
}

class DrawToolPushLayer extends DrawTool {
    constructor() {
        super("+");
        this.button.x = $.w-50 + 25;
        this.button.y = 100;
        this.button.w = 25;
        this.button.h = 25;
    }
    update() {
        allLayers.push([]);
        DrawTool.currTool = DrawTool.prevTool;
    }
    draw() {
        let y = 50;
        for (let i=0; i<allLayers.length; i++) {
            $.shape.rectangle(this.button.x-12.5, y, 50, 50);
            y += 50;
        }
        this.button.y = y;
        super.draw(false);
    }
}




/** @type {DrawTool[]} */
const allTools = [
    new DrawToolBrush(),
    new DrawToolRect(),
    new DrawToolOval(),
    new DrawToolGrab(),
    new DrawToolUndo(),
    new DrawToolClear(),
    // new DrawToolPopLayer(),
    // new DrawToolPushLayer(),
];
DrawTool.currTool = allTools[0];
DrawTool.pervTool = allTools[0];

