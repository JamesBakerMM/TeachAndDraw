import { $ } from "../../lib/TeachAndDraw.js";
import { Vector } from "../../lib/Vector.js";

$.use(update);

const r = {
    name: "r",
    colour: "red",
    x_input: $.make.textArea(90, 20, 100),
    y_input: $.make.textArea(90, 60, 100),
    vec: new Vector(100, -100),
};

const b = {
    name: "b",
    colour: "blue",
    x_input: $.make.textArea(90, 100, 100),
    y_input: $.make.textArea(90, 140, 100),
    vec: new Vector(-120, 200),
};

const p = {
    name: "p",
    colour: "purple",
    vec: new Vector(0, 0),
};

const controls = {
    add: $.make.checkbox(20, 200, 25, 25),
    sub: $.make.checkbox(20, 230, 25, 25),
    multiply: $.make.checkbox(20, 260, 25, 25),
    normalise: $.make.checkbox(20, 290, 25, 25),
};
controls.add.name = "add b to r";
controls.sub.name = "sub b from r";
controls.multiply.name = "multilpy";
controls.normalise.name = "normalise";

controls.sub.checked = true;
const center_x = $.w / 2;
const center_y = $.h / 2;

function update() {
    background("white");
    $.text.alignment.x = "right";
    $.text.print($.w - 10, 20, `a:{x:${r.vec.x}, y:${r.vec.y}}`);
    $.text.print($.w - 10, 40, `b:{x:${b.vec.x}, y:${b.vec.y}}`);
    $.shape.colour = "black";
    $.shape.line(
        center_x + r.vec.x,
        center_y + r.vec.y,
        center_x + b.vec.x,
        center_y + b.vec.y
    );
    update_vec(r, $.keys.down("r"));
    update_vec(b, $.keys.down("b"));
    $.shape.oval(center_x, center_y, 2);
    draw_info_dot(center_x, center_y, r);
    draw_info_dot(center_x, center_y, b);


    let hasAnyControlsFlagged = false;
    for (const control of Object.values(controls)) {
        control.draw();
        if (control.checked) {
            hasAnyControlsFlagged = true;
        }
        $.text.alignment.x = "left";
        $.text.print(control.x + 15, control.y, control.name);
    }
    if (controls.add.checked) {
        const bNew = b.vec.clone();
        const rNew = r.vec.clone();
        const newVec = bNew.addVec(rNew);
        const x = newVec.x;
        const y = newVec.y;
        $.shape.oval(x + center_x, y + center_y, 5);
        $.text.alignment.x = "right";
        $.text.print(x - 15 + center_x, y + center_y, "add");
        $.text.alignment.x = "left";
        $.text.print(x + 15 + center_x, y + center_y, `x:${x}, y:${y}`);
    }
    if (controls.sub.checked) {
        const bNew = b.vec.clone();
        const rNew = r.vec.clone();
        const newVec = rNew.subtractVec(bNew);
        const x = newVec.x;
        const y = newVec.y;
        $.shape.oval(x + center_x, y + center_y, 5);
        $.text.alignment.x = "right";
        $.text.print(x - 15 + center_x, y + center_y, "sub");
        $.text.alignment.x = "left";
        $.text.print(x + 15 + center_x, y + center_y, `x:${x}, y:${y}`);
    }
}

function update_vec(vector, mouseDown) {
    if (mouseDown) {
        vector.x_input.value = ($.mouse.x - center_x).toString();
        vector.y_input.value = ($.mouse.y - center_y).toString();
    }
    const x = Number(vector.x_input.value);
    const y = Number(vector.y_input.value);
    if (Number.isFinite(x) && Number.isFinite(y)) {
        vector.vec.x = x;
        vector.vec.y = y;
    } else {
        console.log(x, y);
    }
    vector.x_input.draw();
    vector.y_input.draw();
}

/**
 *
 * @param {number} x_offset
 * @param {number} y_offset
 * @param {Vector} vector
 */
function draw_info_dot(x_offset, y_offset, vector) {
    // $.state.save();
    $.shape.colour = vector.colour;
    $.text.alignment.x = "left";
    $.text.print(5, vector.x_input.y, `${vector.name} x:`);
    $.text.print(5, vector.y_input.y, `${vector.name} y:`);

    vector = vector.vec;
    const x = x_offset + vector.x;
    const y = y_offset + vector.y;

    $.shape.oval(x, y, 5);
    $.text.print(x + 15, y, `x:${vector.x}, y:${vector.y}`);

    // $.state.load();
}

/** @param {String} colour  */
function background(colour) {
    // $.state.save();
    $.shape.colour = colour;
    $.shape.rectangle($.w / 2, $.h / 2, $.w, $.h);
    // $.state.load();
}
