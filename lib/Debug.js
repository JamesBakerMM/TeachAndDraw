// @ts-nocheck
import { Collider } from "./Collider.js";
import { Group } from "./Group.js";
import { Paint } from "./Paint.js";
import { Pen } from "./Pen.js";

/**
 * @typedef {import("./Mouse.js").Mouse} Mouse
 */

/**
 * @typedef {import("./Img.js").Stamp} Stamp
 */

/**
 * @typedef {import("./Button.js").Button} Button
 */

/**
 * @typedef {import("./Camera.js").Camera} Camera
 */

/**
 * @typedef {import("./Keyboard.js").Keyboard} Keyboard
 */
const COLOURS = {
    BLACK: "black",
    GREEN: "green",
    BLACK_50_OPACITY: "rgba(0,0,0,0.5)",
    BLACK_90_OPACIITY: "rgba(0,0,0,0.9)",
    IMG_ORANGE: "rgb(255, 185, 0)",
    INVISIBLE: "rgba(0,0,0,0)",
    DEFAULT: {},
    BTN: {},
    IMG: {
        ORANGE: "rgb(255, 185, 0)",
    },
    ANIM: {
        AQUA: "aqua",
    },
    COLLIDER: {
        STROKE: "red",
        FILL: "black",
    },
};

const TEXT_SIZE = 12;

/**
 * Debug class for drawing debug information to the canvas.
 */
export class Debug {
    static initialPaneBuild = true;
    static active = false;

    /**
     * Constructs the memory pane for the debug information.
     * @returns {string} - The HTML structure for the memory pane. If the browser does not support memory, nothing is returned.
     * @static
     */
    static constructMemoryPane() {
        if (performance && performance.memory) {
            return `<strong>Memory</strong>
                <ul>
                    <li><strong>Total HeapSize:</strong>${performance.memory.totalJSHeapSize} Bytes </li>
                    <li><strong>Used HeapSize:</strong>${performance.memory.usedJSHeapSize} Bytes </li>
                    <li><strong>HeapSize Limit:</strong>${performance.memory.jsHeapSizeLimit} Bytes </li>
                </ul>`;
        }
        return ""; //the browser being used doesn't support memory
    }

    /**
     * Constructs the group pane for the debug information.
     * @returns {string} - The HTML structure for the group pane.
     * @static
     */
    static constructGroupPane() {
        let html = `<strong>Group: ${Group.all.length} groups</strong>
            <ul id="groups">`;
        for(let i=0; i<Group.all.length; i++){
            console.log(Group.all[i].deref())
            if(Group.all[i].deref()){
                html += `<li>${Group.all[i].deref().name || ""} Group(${Group.all[i].deref().length}):${
                    Group.all[i].deref().type
                }</li>`;
            }
        }
        html += "</ul>";
        return html;
    }

    /**
     * Constructs the camera information pane for the debug information.
     * @param {Camera} camera - The camera object to display information for.
     * @returns {string} - The HTML structure for the camera information pane.
     * @static
     */
    static constructCameraInfoPane(camera) {
        let html = `
            <strong>Camera:</strong>
            <br/>
                    <hr>
                    <strong>Center</strong><br>xCenter:<strong>${camera.xCenter}</strong> |  yCenter:<strong>${camera.yCenter}</strong>
                    <hr>
                    <strong>Offset</strong><br>xOffset:<strong>${camera.xOffset}</strong> |  yOffset:<strong>${camera.yOffset}</strong>
                    <hr>
        `;
        return html;
    }

    /**
     * NOT YET IMPLEMENTED
     */
    static hideInfoPane() {
        //find and hide the info pane
    }

    /**
     * Constructs the information pane for the pen object.
     * @param {Pen} pen - The pen object to draw with.
     * @returns - The HTML structure for the information pane.
     * @static
     */
    static constructInfoPane(pen) {
        // return
        if (!pen) {
            console.error("Pen instance not found.");
            return;
        }
        const debug = document.getElementById("debug");
        if (debug.classList.contains("hidden")) {
            return;
        }
        if (Debug.initialPaneBuild) {
            debug.classList.toggle("invisible");
            const btn = document.querySelector("#showhidebtn");
            debug.classList.toggle("hidden");

            btn.addEventListener("click", () => {
                debug.classList.toggle("hidden");
            });
            Debug.initialPaneBuild = false;
        }
        let debugPane = document.querySelector("#debug section");

        //set it to visible
        Debug.constructGroupPane();
        let html = `                    
            <strong>Canvas</strong> w:${pen.w} h:${pen.h}
            <hr>
                    <div><strong>Paused:</strong> ${pen.paused}</div>
                    <hr>
                    <strong>Fps</strong> count:${pen.frameCount}  actual:(${
            Math.floor(pen.time.averageFps) || "nope"
        }/${pen.fps})
                    <hr>
                    <strong>MsElapsed</strong>:(${Math.floor(
                        pen.time.msElapsed
                    )})
                    <hr>
                    <strong>Colour</strong><br>Fill:
                    <div class='prev' style='background:${pen.colour.fill}'>
                        <strong style='color:${
                            pen.colour.fill
                        }; filter: invert(100%);'>${pen.colour.fill}</strong>
                    </div>Stroke:
                    <div class='prev' style='background:${pen.colour.stroke};'>
                        <strong style='color:${
                            pen.colour.stroke
                        }; filter: invert(100%);'>${pen.colour.stroke}</strong>
                    </div>
                    <hr>
                    <strong>Shape</strong><br>alignment.x:<strong>${
                        pen.shape.alignment.x
                    }</strong> |  alignment.y:<strong>${
            pen.shape.alignment.y
        }</strong> StrokeWidth:<strong>${pen.shape.strokeWidth}</strong>
                    <hr>
                    <strong>Text</strong>
                    <br>
                        <div>${pen.text.font} | ${pen.text.size}px </div>
                        <strong>alignment.x</strong> ${pen.text.alignment.x} | 
                        <strong>alignment.y</strong> ${pen.text.alignment.y}
                    <hr>
        `;
        html += Debug.constructCameraInfoPane(pen.camera);
        html += Debug.constructMemoryPane();
        html += Debug.constructGroupPane();

        // Append the HTML structure to the provided node
        debugPane.innerHTML = html;

        /*
        
        //build out
            aside
            button
                section
                    heading
                        canvas
                            width
                            height
                        paused
                        targetFps
                        currentFrame
                        actualFps
                        userDrawGiven
                        currentDrawState
                        currentGroups
                            number in each
                        listOfLoadedFiles
        */
    }

    /**
     * Constructs the grid-overlay on the canvas to better identify the coordinates.
     * @param {Pen} pen - The pen object to draw the grid overlay with.
     * @static
     */
    static applyDebugGrid(pen) {
        const element = document.querySelector(".wrapper");
        element.classList.add("grid-overlay");
    }

    /**
     * Removes the grid-overlay from the canvas.
     * @param {Pen} pen - The pen object to remove the grid overlay from.
     * @static
     */
    static removeDebugGrid(pen) {
        const element = document.querySelector(".wrapper");
        element.classList.remove("grid-overlay");
    }

    /**
     * Draws debug information for collider objects to the canvas.
     * @param {Pen} pen - The pen object to draw the debug information with.
     * @param {Collider} collider - The collider object to draw debug information for.
     * @static
     */
    static drawCollider(pen, collider) {
        pen.state.save();
        pen.shape.alignment.x = "center";
        pen.shape.alignment.y = "center";
        pen.colour.stroke = COLOURS.COLLIDER.STROKE;
        pen.colour.fill = Paint.clear;
        // pen.context.translate(collider.x,collider.y)
        const x = collider.x;
        const y = collider.y;

        pen.colour.stroke = Paint.paleaqua;
        pen.shape.strokeWidth = 3;

        pen.colour.fill = `rgba(20,250,250,0.1)`;

        if (collider.shape === "box" && collider.vertices != null) {
            pen.shape.oval(
                collider.vertices[0].x,
                collider.vertices[0].y,
                2,
                2
            );
            pen.shape.oval(
                collider.vertices[1].x,
                collider.vertices[1].y,
                2,
                2
            );
            pen.shape.oval(
                collider.vertices[2].x,
                collider.vertices[2].y,
                2,
                2
            );
            pen.shape.oval(
                collider.vertices[3].x,
                collider.vertices[3].y,
                2,
                2
            );
            pen.shape.polygon(
                collider.vertices[0].x,
                collider.vertices[0].y,
                collider.vertices[1].x,
                collider.vertices[1].y,
                collider.vertices[2].x,
                collider.vertices[2].y
            );
            pen.shape.polygon(
                collider.vertices[1].x,
                collider.vertices[1].y,
                collider.vertices[3].x,
                collider.vertices[3].y,
                collider.vertices[2].x,
                collider.vertices[2].y
            );
        } else {
            pen.shape.oval(x, y, collider.radius, collider.radius);
        }

        const MIN_WIDTH_FOR_TEXT = 40;
        if (collider.w >= MIN_WIDTH_FOR_TEXT) {
            // pen.text.size = TEXT_SIZE;
            // pen.colour.fill = COLOURS.BLACK;
            // pen.text.alignment.x = "center";
            // pen.text._print(collider.x, collider.y, `x:${parseInt(collider.x)}`);
            // pen.text._print(collider.x, collider.y+pen.text.size*1, `y:${parseInt(collider.y)}`);
        }

        if (collider.exists === false) {
            pen.text._print(x, y, "💀");
        }

        Debug.cross(pen, x, y);
        pen.state.load();
    }

    /**
     * Draws debug information for the pen object to the canvas.
     * @param {Pen} pen - The pen object to draw with and debug.
     * @static
     */
    static drawPen(pen) {
        //calculations
        const LEFT = 0;
        const TOP = 0;
        const BAR_WIDTH = 150;
        const BAR_HEIGHT = 20;

        pen.state.save();
        Debug.drawGrid(pen);

        //setup
        pen.text.alignment.x = "left";
        pen.shape.alignment.x = "left";
        pen.shape.alignment.y = "top";
        pen.colour.fill = COLOURS.BLACK_90_OPACIITY;
        pen.colour.stroke = COLOURS.INVISIBLE;

        pen.shape.rectangle(LEFT, TOP, BAR_WIDTH, BAR_HEIGHT);

        pen.colour.fill = COLOURS.GREEN;
        pen.text._print(2, 10, `frame:${pen.frameCount}`);

        pen.state.load();
    }

    /**
     * Special text drawing function to draw information to the screen with.
     * @param {Pen} pen - The pen object to draw with.
     * @param {number} x - The x-coordinate to draw the text.
     * @param {number} y - The y-coordinate to draw the text.
     * @param {string} msg - The text portion of the text.
     * @static
     */
    static drawText(pen, x, y, msg, maxWidth, numLines) {
        pen.state.save();
        pen.shape.alignment.x = "center";
        pen.shape.alignment.y = "center";

        // Draw debug for when multiline or not
        Debug.cross(pen, x, y, 'yellow');

        const textMeasureObj = pen.context.measureText(msg);
        const left = x - textMeasureObj.actualBoundingBoxLeft;
        const right = x + textMeasureObj.actualBoundingBoxRight;
        const top = y - textMeasureObj.actualBoundingBoxAscent;
        const bottom = y + textMeasureObj.actualBoundingBoxDescent;
        const width = textMeasureObj.actualBoundingBoxLeft + textMeasureObj.actualBoundingBoxRight;
        const height = pen.text.size;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        pen.colour.fill = "transparent";
        pen.colour.stroke = "grey";
        pen.shape.strokeDash = 2;
        pen.shape.rectangle(centerX, centerY, width, height);

        const totalHeight = height * numLines;
        let yAdjustment = 0 + height / 2; // center alignment
        if (pen.text.alignment.y === "top") {
            yAdjustment = totalHeight / 2;
        } else if (pen.text.alignment.y === "bottom") {
            yAdjustment = -totalHeight / 2 + height;
        }

        // Draw debug for when multiline
        if (maxWidth > 0) {
            pen.colour.stroke = "red";
            pen.shape.strokeDash = 1;
            let x = centerX;
            if (pen.context.textAlign === "right") {
                x = right - maxWidth / 2;
            } else if (pen.context.textAlign === "left") {
                x = left + maxWidth / 2;
            }
            pen.shape.rectangle(x, centerY - height / 2 + yAdjustment, maxWidth, totalHeight);
        }

        pen.shape.strokeDash = 0;
        pen.state.load();
    }

    /**
     * NOT YET IMPLEMENTED
     */
    static drawAnimation(pen, anim) {
        //draw like
    }

    /**
     * Draws debug information for keyboard events to the canvas.
     * @param {Pen} pen - The pen object to draw with.
     * @param {Keyboard} keys - The keys object to draw debug information for.
     * @param {string} key - The key to draw debug information for (i.e "a").
     * @param {number} inputCount - The number of inputs observed.
     * @static
     */
    static drawKeys(pen, keys, key, inputCount) {
        if (keys.keys[key].down) {
            pen.state.save();

            //setup
            pen.text.alignment.x = "left";
            pen.text.alignment.y = "center";
            pen.text.size = TEXT_SIZE;
            pen.colour.stroke = COLOURS.INVISIBLE;
            pen.shape.alignment.x = "left";
            pen.shape.alignment.y = "center";

            //calculations
            const BOX_WIDTH = 100;
            const BOX_HEIGHT = 15;
            const X = pen.canvas.width - BOX_WIDTH / 2 - 50;
            const Y = pen.canvas.height - BOX_HEIGHT / 2 + inputCount;
            const BOX_X = X;

            pen.colour.fill = COLOURS.BLACK;
            pen.shape.rectangle(BOX_X, Y, BOX_WIDTH + 100, BOX_HEIGHT);

            pen.colour.fill = COLOURS.GREEN;
            pen.text._print(X, Y, `⌨️ ${key}: ${keys.keys[key].frames} fr`);

            pen.state.load();
        }
    }

    /**
     * Draws debug information for mouse events to the canvas.
     * @param {Pen} pen - The pen object to draw with.
     * @param {Mouse} mouse - The mouse object to draw debug information for.
     * @static
     */
    static drawMouse(pen, mouse) {
        pen.state.save();
        const BOX_WIDTH = 50;
        const BOX_HEIGHT = 30;
        const VERTICAL_PADDING = 40;

        const MIN_LEFT_X = 0 + BOX_WIDTH / 2;
        const MIN_TOP_Y = 0 + BOX_HEIGHT / 2;
        const MIN_RIGHT_X = pen.w - BOX_WIDTH / 2;

        const MOUSEHEIGHT = 25;
        const MOUSEWIDTH = 20;

        if (mouse.leftDown || mouse.rightDown) {
            //calculations
            //boundary mininums

            let X = mouse.x - BOX_WIDTH / 1.5;
            let Y = mouse.y - VERTICAL_PADDING;

            const TOP_Y = Y - BOX_HEIGHT / 2;
            if (TOP_Y < MIN_TOP_Y) {
                Y = MIN_TOP_Y;
            }

            const LEFT_X = X - BOX_WIDTH / 2;
            if (LEFT_X < MIN_LEFT_X) {
                X = MIN_LEFT_X;
            }

            const RIGHT_X = X + BOX_WIDTH / 2;
            if (RIGHT_X > MIN_RIGHT_X) {
                X = MIN_RIGHT_X;
            }

            //setup
            pen.text.size = TEXT_SIZE;
            pen.colour.fill = COLOURS.BLACK;
            pen.colour.stroke = COLOURS.INVISIBLE;
            pen.shape.alignment.x = "center";
            pen.shape.alignment.y = "center";
            pen.text.alignment.x = "center";

            pen.shape.rectangle(mouse.x, mouse.y, MOUSEWIDTH, MOUSEHEIGHT);
            pen.colour.fill = Paint.grey;
            if (mouse.leftDown) {
                pen.colour.fill = Paint.white;
            }

            pen.shape.alignment.x = "right";
            pen.shape.rectangle(
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3,
                MOUSEWIDTH / 2,
                MOUSEHEIGHT / 2
            );
            pen.colour.fill = Paint.grey;
            if (mouse.rightDown) {
                pen.colour.fill = Paint.white;
            }
            pen.shape.alignment.x = "left";
            pen.shape.rectangle(
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3,
                MOUSEWIDTH / 2,
                MOUSEHEIGHT / 2
            );

            pen.shape.alignment.x = "center";
            pen.colour.fill = Paint.black;
            pen.colour.stroke = Paint.black;
            //black box behind the text
            pen.shape.rectangle(X, Y - 5, BOX_WIDTH, BOX_HEIGHT);

            //green text on top
            pen.colour.fill = "white";
            pen.text._print(X, Y - pen.text.size, `x:${parseInt(mouse.x.toString())}`);
            pen.text._print(X, Y, `y:${parseInt(mouse.y.toString())}`);
        }

        pen.colour.stroke = Paint.clear;
        pen.colour.fill = Paint.red;
        pen.shape.alignment.x = "center";

        if (mouse.wheel.up) {
            if (mouse.leftDown === false && mouse.rightDown === false) {
                pen.colour.stroke = Paint.black;
                pen.colour.fill = Paint.black;
                pen.shape.rectangle(mouse.x, mouse.y, MOUSEWIDTH, MOUSEHEIGHT);
                pen.colour.stroke = Paint.white;
                pen.colour.fill = Paint.white;
            } else {
                pen.colour.stroke = Paint.black;
                pen.colour.fill = Paint.black;
            }

            //arrow
            pen.shape.rectangle(
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3,
                MOUSEWIDTH / 5,
                MOUSEHEIGHT / 3
            );
            pen.shape.polygon(
                mouse.x - 5,
                mouse.y - MOUSEHEIGHT / 3 - 7 + 5,
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3 - 7,
                mouse.x + 5,
                mouse.y - MOUSEHEIGHT / 3 - 7 + 5
            );
        } else if (mouse.wheel.down) {
            pen.colour.fill = COLOURS.BLACK;
            pen.colour.stroke = COLOURS.INVISIBLE;
            pen.shape.alignment.x = "center";
            pen.shape.alignment.y = "center";
            pen.text.alignment.y = "center";

            if (mouse.leftDown === false && mouse.rightDown === false) {
                pen.colour.stroke = "black";
                pen.colour.fill = "black";
                pen.shape.rectangle(mouse.x, mouse.y, MOUSEWIDTH, MOUSEHEIGHT);
                pen.colour.stroke = "white";
                pen.colour.fill = "white";
            } else {
                pen.colour.stroke = "black";
                pen.colour.fill = "black";
            }

            //arrow
            pen.shape.rectangle(
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3,
                MOUSEWIDTH / 5,
                MOUSEHEIGHT / 3
            );
            pen.shape.polygon(
                mouse.x - 5,
                mouse.y + MOUSEHEIGHT / 3 - 7 - 5 - 2,
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3 + 10 - 2,
                mouse.x + 5,
                mouse.y + MOUSEHEIGHT / 3 - 7 - 5 - 2
            );
        }
        pen.colour.fill = mouse.fill;
        pen.colour.stroke = mouse.stroke;
        const SIZE = 13;
        pen.shape.polygon(
            mouse.x,
            mouse.y,
            mouse.x,
            mouse.y + SIZE * 1.5,
            mouse.x + SIZE,
            mouse.y + SIZE
        );

        pen.state.load();
    }

    /**
     * Special rectangle drawing function.
     * @param {Pen} pen - The pen object to draw with.
     * @param {number} x - The x-coordinate of the rectangle.
     * @param {number} y - The y-coordinate of the rectangle.
     * @param {number} w - The width of the rectangle.
     * @param {number} h - The height of the rectangle.
     * @static
     */
    static drawRectangle(pen, x, y, w, h) {
        pen.state.save();
        Debug.cross(pen, x, y);
        pen.state.load();
    }

    /**
     * Special oval drawing function.
     * @param {Pen} pen - The pen object to draw with.
     * @param {number} x - The x-coordinate of the oval.
     * @param {number} y - The y-coordinate of the oval.
     * @param {number} w - The width of the oval.
     * @param {number} h - The height of the oval.
     * @static
     */
    static drawOval(pen, x, y, w, h) {
        pen.state.save();
        Debug.cross(pen, x, y);
        pen.state.load();
    }

    /**
     * Special cross drawing function.
     * @param {Pen} pen - The pen object to draw with.
     * @param {number} x - The x-coordinate of the center of the cross.
     * @param {number} y - The y-coordinate of the center of the cross.
     * @param {string} colour - The colour of the cross.
     * @static
     */
    static cross(pen, x, y, colour = "rgba(255,255,0,0.3)") {
        pen.colour.stroke = colour;
        pen.shape.strokeWidth = 1;
        pen.shape.line(x - 5, y, x + 5, y);
        pen.shape.line(x, y - 5, x, y + 5);
    }

    /**
     * Draws debug information for the camera object to the canvas.
     * @param {Pen} pen - The pen object to draw with.
     * @param { {x: number, y: number} } center - The center of the camera.
     * @param { {x: number, y: number} } offset - The offset of the camera.
     * @static
     */
    static drawCamera(pen, center = { x: 0, y: 0 }, offset = { x: 0, y: 0 }) {
        if (offset.x === 0 && offset.y === 0) {
            return;
        }
        pen.state.save();
        //center point.
        pen.shape.alignment.x = "center";
        pen.shape.alignment.y = "center";
        pen.shape.oval(center.x, center.y, 15);
        pen.shape.strokeWidth = 1;
        pen.colour.stroke = "white";
        pen.colour.fill = "rgba(0,0,0,0)";
        pen.shape.rectangle(
            center.x + offset.x,
            center.y + offset.y,
            pen.w,
            pen.h
        );
        pen.colour.fill = "white";
        pen.shape.strokeDash = 2;
        pen.shape.line(
            center.x,
            center.y,
            center.x + offset.x,
            center.y + offset.y
        );
        //current location
        pen.shape.oval(center.x + offset.x, center.y + offset.y, 4);
        Debug.cross(pen, center.x + offset.x, center.y + offset.y);
        pen.text.alignment.x = "center";
        pen.text.alignment.y = "center";
        pen.text._print(center.x, center.y + 4, "🎥");
        pen.state.load();
    }

    /**
     * Drawing function for the background grid
     * @param {Pen} pen - The pen object to draw with.
     * @static
     */
    static drawGrid(pen) {
        // Constants
        const INCREMENT = 50;
        const LABELWIDTH = 30;
        const LABELHEIGHT = 20;
        const PADDING_OFFSET = 10;

        // Colours
        const DULL_GREEN = "rgba(0,55,0,1)";
        const WHITE_05_OPACITY = "rgba(255,255,255,0.5)";

        // Text setup
        pen.text.alignment.x = "center";
        pen.text.alignment.y = "center";
        pen.text.size = 8;

        pen.shape.alignment.x = "center";
        pen.shape.alignment.y = "center";
        pen.colour.stroke = "rgba(0,0,0,0)";
        // Drawing vertical tags
        for (let i = 0; i < pen.w / INCREMENT; i++) {
            pen.colour.fill = WHITE_05_OPACITY;
            pen.shape.rectangle(
                i * INCREMENT,
                INCREMENT - PADDING_OFFSET,
                LABELWIDTH,
                LABELHEIGHT
            );

            pen.colour.fill = DULL_GREEN;
            pen.text._print(i * INCREMENT, INCREMENT - 5, `${i * INCREMENT}`);
        }

        // Drawing horizontal tags
        for (let y = 0; y < pen.h / INCREMENT; y++) {
            if (y * INCREMENT !== 50) {
                //prevent overlapping tag
                pen.colour.fill = WHITE_05_OPACITY;
                pen.shape.rectangle(
                    INCREMENT,
                    INCREMENT * y - PADDING_OFFSET,
                    LABELWIDTH,
                    LABELHEIGHT
                );
                pen.colour.fill = DULL_GREEN;
                pen.text._print(INCREMENT, INCREMENT * y - 5, `${y * INCREMENT}`);
            }
        }
    }

    /**
     * Draws debug information for the button object to the canvas.
     * @param {Pen} pen - The pen object to draw with.
     * @param {Button} btn - The button object to draw debug information for.
     * @static
     */
    static drawButton(pen, btn) {
        pen.state.save();

        if (btn.isHovered()) {
            Debug.drawIdleButton(pen, btn);
        } else {
            Debug.drawHoveredButton(pen, btn);
        }
        pen.state.load();
    }

    /**
     * Draws the button in an idle state.
     * @param {Pen} pen - The pen object to draw with.
     * @param {Button} btn - The button object to draw in an idle state.
     * @static
     */
    static drawIdleButton(pen, btn) {
        pen.state.save();
        //colours
        const strokeColour = COLOURS.GREEN;
        const fillColour = "rgba(0,155,0,0.5)";

        const VERTICAL_OFFSET = btn.h / 2;
        const HORIZONTAL_OFFSET = btn.w / 2;

        pen.text.size = TEXT_SIZE;
        pen.colour.fill = fillColour;
        pen.colour.stroke = strokeColour;

        pen.shape.rectangle(btn.x, btn.y, btn.w, btn.h);
        pen.colour.fill = strokeColour;

        pen.text._print(btn.x, btn.y + 20, btn.label);
        for (let i = 0; i < btn.w / 10; i++) {
            let x1 = btn.x - HORIZONTAL_OFFSET + i * 10 + 20;
            let y1 = btn.y - VERTICAL_OFFSET;
            let x2 = btn.x - HORIZONTAL_OFFSET + i * 10;
            let y2 = btn.y + VERTICAL_OFFSET;

            if (x1 > btn.x + HORIZONTAL_OFFSET === false) {
                pen.shape.line(x1, y1, x2, y2);
            }
        }

        pen.shape.oval(btn.x, btn.y, pen.text.size);
        pen.colour.fill = COLOURS.BLACK;
        pen.text._print(btn.x, btn.y, `${btn.id}`);

        pen.shape.rectangle(
            btn.x,
            btn.y - VERTICAL_OFFSET + 7,
            btn.w,
            pen.text.size * 1.5
        );
        pen.colour.fill = COLOURS.GREEN;
        pen.text._print(btn.x, btn.y - VERTICAL_OFFSET + 7, `👆 Btn`);
        pen.state.load();
    }

    /**
     * Draws the button in a hovered state.
     * @param {Pen} pen - The pen object to draw with.
     * @param {Button} btn - The button object to draw in a hovered state.
     * @static
     */
    static drawHoveredButton(pen, btn) {
        pen.state.save();
        pen.text.size = TEXT_SIZE;
        let fillColour = btn.fill;
        let strokeColour = "rgba(0,155,0,0.5)";
        fillColour = COLOURS.GREEN;
        pen.colour.fill = fillColour;
        pen.colour.stroke = COLOURS.BLACK;

        pen.shape.rectangle(btn.x, btn.y, btn.w, btn.h);
        pen.colour.fill = COLOURS.BLACK;
        pen.text._print(btn.x, btn.y + 20, btn.label);

        const y1 = btn.y - btn.h / 2;
        const y2 = btn.y + btn.h / 2;

        for (let i = 0; i < btn.w / 10; i++) {
            const x1 = btn.x - btn.w / 2 + i * 10 + 20;
            const x2 = btn.x - btn.w / 2 + i * 10;

            if (x1 > btn.x + btn.w / 2 === false) {
                pen.shape.line(x1, y1, x2, y2);
            }
        }

        pen.shape.oval(btn.x, btn.y, 10);
        pen.colour.fill = COLOURS.GREEN;
        pen.text._print(btn.x, btn.y, `${btn.id}`);

        pen.colour.fill = COLOURS.BLACK;
        pen.shape.rectangle(btn.x, btn.y - btn.h / 2 + 7, btn.w, 15);
        pen.colour.fill = COLOURS.GREEN;
        pen.text._print(btn.x, btn.y - btn.h / 2 + 7, `👆 Btn`);
        pen.state.load();
    }

    /**
     * Draws debug information for the image object to the canvas.
     * @param {Pen} pen - The pen object to draw with.
     * @param {Stamp} img - The image object to draw debug information for.
     * @static
     */
    static drawImg(pen, img) {
        pen.state.save();
        //colour

        //initial setup
        pen.text.alignment.x = "left";
        pen.text.alignment.y = "center";

        pen.context.translate(img.x, img.y);
        // translation to img x and y means the canvas draws that position so X and Y would now be 0
        const NEW_X = 0;
        const NEW_Y = 0;
        const halfWidth = img.w / 2;
        const halfHeight = img.h / 2;
        pen.context.rotate(pen.math.degreeToRadian(img.rotation));
        pen.text.size = TEXT_SIZE;

        pen.colour.fill = COLOURS.BLACK_50_OPACITY;
        pen.shape.rectangle(NEW_X, NEW_Y, img.w, img.h);
        pen.colour.stroke = COLOURS.IMG_ORANGE;
        pen.colour.fill = COLOURS.INVISIBLE;
        pen.shape.rectangle(NEW_X, NEW_Y, img.w, img.h);
        //x lines
        pen.shape.line(halfWidth, -halfHeight, -halfWidth, halfHeight);
        pen.shape.line(-halfWidth, -halfHeight, halfWidth, halfHeight);

        pen.text._print(
            NEW_X - 36,
            NEW_Y - halfHeight - 5,
            `x:${parseInt(img.x.toString())}, y:${parseInt(img.y.toString())}`
        );
        pen.colour.fill = COLOURS.BLACK;
        pen.shape.rectangle(NEW_X, NEW_Y - halfHeight, img.w, 15);
        pen.colour.fill = COLOURS.IMG_ORANGE;
        pen.text.alignment.x = "center";
        pen.text._print(NEW_X, NEW_Y - halfHeight, `🎨 Img`);

        //static label
        const LABELWIDTH = 115;
        const LABELHEIGHT = 15;

        pen.context.rotate(-pen.math.degreeToRadian(img.rotation));
        pen.colour.fill = COLOURS.BLACK;
        pen.shape.rectangle(
            NEW_X + LABELWIDTH / 2,
            NEW_Y,
            LABELWIDTH,
            LABELHEIGHT
        );
        pen.colour.fill = COLOURS.IMG_ORANGE;
        pen.shape.oval(NEW_X, NEW_Y, 10);
        pen.colour.fill = COLOURS.BLACK;
        pen.text._print(NEW_X, NEW_Y, `${img.id}`);
        pen.colour.fill = COLOURS.IMG_ORANGE;

        pen.text.alignment.x = "left";
        pen.text._print(
            NEW_X + 15,
            NEW_Y,
            `x:${parseInt(img.x.toString())} y:${parseInt(img.y.toString())} rot:${img.rotation}`
        );
        //end static label
        pen.context.rotate(pen.math.degreeToRadian(img.rotation));
        pen.colour.fill = COLOURS.IMG_ORANGE;

        pen.state.load();
    }
    static draw(pen) {}
}
