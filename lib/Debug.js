// @ts-nocheck
import { Collider } from "./Collider.js";
import { Group } from "./Group.js";
import { Paint } from "./Paint.js";
import { Tad } from "./TeachAndDraw.js";

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
     * Constructs the information pane for the tad object.
     * @param {Tad} tad - The tad object to draw with.
     * @returns - The HTML structure for the information pane.
     * @static
     */
    static constructInfoPane(tad) {
        // return
        if (!tad) {
            console.error("Tad instance not found.");
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
            <strong>Canvas</strong> w:${tad.w} h:${tad.h}
            <hr>
                    <div><strong>Paused:</strong> ${tad.paused}</div>
                    <hr>
                    <strong>Fps</strong> count:${tad.frameCount}  actual:(${
            Math.floor(tad.time.averageFps) || "nope"
        }/${tad.fps})
                    <hr>
                    <strong>MsElapsed</strong>:(${Math.floor(
                        tad.time.msElapsed
                    )})
                    <hr>
                    <strong>Colour</strong><br>Fill:
                    <div class='prev' style='background:${tad.colour.fill}'>
                        <strong style='color:${
                            tad.colour.fill
                        }; filter: invert(100%);'>${tad.colour.fill}</strong>
                    </div>Stroke:
                    <div class='prev' style='background:${tad.colour.stroke};'>
                        <strong style='color:${
                            tad.colour.stroke
                        }; filter: invert(100%);'>${tad.colour.stroke}</strong>
                    </div>
                    <hr>
                    <strong>Shape</strong><br>alignment.x:<strong>${
                        tad.shape.alignment.x
                    }</strong> |  alignment.y:<strong>${
            tad.shape.alignment.y
        }</strong> StrokeWidth:<strong>${tad.shape.strokeWidth}</strong>
                    <hr>
                    <strong>Text</strong>
                    <br>
                        <div>${tad.text.font} | ${tad.text.size}px </div>
                        <strong>alignment.x</strong> ${tad.text.alignment.x} | 
                        <strong>alignment.y</strong> ${tad.text.alignment.y}
                    <hr>
        `;
        html += Debug.constructCameraInfoPane(tad.camera);
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
     * @param {Tad} tad - The tad object to draw the grid overlay with.
     * @static
     */
    static applyDebugGrid(tad) {
        const element = document.querySelector(".wrapper");
        element.classList.add("grid-overlay");
    }

    /**
     * Removes the grid-overlay from the canvas.
     * @param {Tad} tad - The tad object to remove the grid overlay from.
     * @static
     */
    static removeDebugGrid(tad) {
        const element = document.querySelector(".wrapper");
        element.classList.remove("grid-overlay");
    }

    /**
     * Draws debug information for collider objects to the canvas.
     * @param {Tad} tad - The tad object to draw the debug information with.
     * @param {Collider} collider - The collider object to draw debug information for.
     * @static
     */
    static drawCollider(tad, collider) {
        tad.state.save();
        tad.shape.alignment.x = "center";
        tad.shape.alignment.y = "center";
        tad.colour.stroke = COLOURS.COLLIDER.STROKE;
        tad.colour.fill = Paint.clear;
        // tad.context.translate(collider.x,collider.y)
        const x = collider.x;
        const y = collider.y;

        tad.colour.stroke = Paint.paleaqua;
        tad.shape.strokeWidth = 3;

        tad.colour.fill = `rgba(20,250,250,0.1)`;

        if (collider.shape === "box" && collider.vertices != null) {
            tad.shape.oval(
                collider.vertices[0].x,
                collider.vertices[0].y,
                2,
                2
            );
            tad.shape.oval(
                collider.vertices[1].x,
                collider.vertices[1].y,
                2,
                2
            );
            tad.shape.oval(
                collider.vertices[2].x,
                collider.vertices[2].y,
                2,
                2
            );
            tad.shape.oval(
                collider.vertices[3].x,
                collider.vertices[3].y,
                2,
                2
            );
            tad.shape.polygon(
                collider.vertices[0].x,
                collider.vertices[0].y,
                collider.vertices[1].x,
                collider.vertices[1].y,
                collider.vertices[2].x,
                collider.vertices[2].y
            );
            tad.shape.polygon(
                collider.vertices[1].x,
                collider.vertices[1].y,
                collider.vertices[3].x,
                collider.vertices[3].y,
                collider.vertices[2].x,
                collider.vertices[2].y
            );
        } else {
            tad.shape.oval(x, y, collider.radius, collider.radius);
        }

        const MIN_WIDTH_FOR_TEXT = 40;
        if (collider.w >= MIN_WIDTH_FOR_TEXT) {
            // tad.text.size = TEXT_SIZE;
            // tad.colour.fill = COLOURS.BLACK;
            // tad.text.alignment.x = "center";
            // tad.text._print(collider.x, collider.y, `x:${parseInt(collider.x)}`);
            // tad.text._print(collider.x, collider.y+tad.text.size*1, `y:${parseInt(collider.y)}`);
        }

        if (collider.exists === false) {
            tad.text._print(x, y, "💀");
        }

        Debug.cross(tad, x, y);
        tad.state.load();
    }

    /**
     * Draws debug information for the tad object to the canvas.
     * @param {Tad} tad - The tad object to draw with and debug.
     * @static
     */
    static drawTad(tad) {
        //calculations
        const LEFT = 0;
        const TOP = 0;
        const BAR_WIDTH = 150;
        const BAR_HEIGHT = 20;

        tad.state.save();
        Debug.drawGrid(tad);

        //setup
        tad.text.alignment.x = "left";
        tad.shape.alignment.x = "left";
        tad.shape.alignment.y = "top";
        tad.colour.fill = COLOURS.BLACK_90_OPACIITY;
        tad.colour.stroke = COLOURS.INVISIBLE;

        tad.shape.rectangle(LEFT, TOP, BAR_WIDTH, BAR_HEIGHT);

        tad.colour.fill = COLOURS.GREEN;
        tad.text._print(2, 10, `frame:${tad.frameCount}`);

        tad.state.load();
    }

    /**
     * Special text drawing function to draw information to the screen with.
     * @param {Tad} tad - The tad object to draw with.
     * @param {number} x - The x-coordinate to draw the text.
     * @param {number} y - The y-coordinate to draw the text.
     * @param {string} msg - The text portion of the text.
     * @static
     */
    static drawText(tad, x, y, msg, maxWidth, numLines) {
        tad.state.save();
        tad.shape.alignment.x = "center";
        tad.shape.alignment.y = "center";

        // Draw debug for when multiline or not
        Debug.cross(tad, x, y, 'yellow');

        const textMeasureObj = tad.context.measureText(msg);
        const left = x - textMeasureObj.actualBoundingBoxLeft;
        const right = x + textMeasureObj.actualBoundingBoxRight;
        const top = y - textMeasureObj.actualBoundingBoxAscent;
        const bottom = y + textMeasureObj.actualBoundingBoxDescent;
        const width = textMeasureObj.actualBoundingBoxLeft + textMeasureObj.actualBoundingBoxRight;
        const height = tad.text.size;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        tad.colour.fill = "transparent";
        tad.colour.stroke = "grey";
        tad.shape.strokeDash = 2;
        tad.shape.rectangle(centerX, centerY, width, height);

        const totalHeight = height * numLines;
        let yAdjustment = 0 + height / 2; // center alignment
        if (tad.text.alignment.y === "top") {
            yAdjustment = totalHeight / 2;
        } else if (tad.text.alignment.y === "bottom") {
            yAdjustment = -totalHeight / 2 + height;
        }

        // Draw debug for when multiline
        if (maxWidth > 0) {
            tad.colour.stroke = "red";
            tad.shape.strokeDash = 1;
            let x = centerX;
            if (tad.context.textAlign === "right") {
                x = right - maxWidth / 2;
            } else if (tad.context.textAlign === "left") {
                x = left + maxWidth / 2;
            }
            tad.shape.rectangle(x, centerY - height / 2 + yAdjustment, maxWidth, totalHeight);
        }

        tad.shape.strokeDash = 0;
        tad.state.load();
    }

    /**
     * NOT YET IMPLEMENTED
     */
    static drawAnimation(tad, anim) {
        //draw like
    }

    /**
     * Draws debug information for keyboard events to the canvas.
     * @param {Tad} tad - The tad object to draw with.
     * @param {Keyboard} keys - The keys object to draw debug information for.
     * @param {string} key - The key to draw debug information for (i.e "a").
     * @param {number} inputCount - The number of inputs observed.
     * @static
     */
    static drawKeys(tad, keys, key, inputCount) {
        if (keys.keys[key].down) {
            tad.state.save();

            //setup
            tad.text.alignment.x = "left";
            tad.text.alignment.y = "center";
            tad.text.size = TEXT_SIZE;
            tad.colour.stroke = COLOURS.INVISIBLE;
            tad.shape.alignment.x = "left";
            tad.shape.alignment.y = "center";

            //calculations
            const BOX_WIDTH = 100;
            const BOX_HEIGHT = 15;
            const X = tad.canvas.width - BOX_WIDTH / 2 - 50;
            const Y = tad.canvas.height - BOX_HEIGHT / 2 + inputCount;
            const BOX_X = X;

            tad.colour.fill = COLOURS.BLACK;
            tad.shape.rectangle(BOX_X, Y, BOX_WIDTH + 100, BOX_HEIGHT);

            tad.colour.fill = COLOURS.GREEN;
            tad.text._print(X, Y, `⌨️ ${key}: ${keys.keys[key].frames} fr`);

            tad.state.load();
        }
    }

    /**
     * Draws debug information for mouse events to the canvas.
     * @param {Tad} tad - The tad object to draw with.
     * @param {Mouse} mouse - The mouse object to draw debug information for.
     * @static
     */
    static drawMouse(tad, mouse) {
        tad.state.save();
        const BOX_WIDTH = 50;
        const BOX_HEIGHT = 30;
        const VERTICAL_PADDING = 40;

        const MIN_LEFT_X = 0 + BOX_WIDTH / 2;
        const MIN_TOP_Y = 0 + BOX_HEIGHT / 2;
        const MIN_RIGHT_X = tad.w - BOX_WIDTH / 2;

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
            tad.text.size = TEXT_SIZE;
            tad.colour.fill = COLOURS.BLACK;
            tad.colour.stroke = COLOURS.INVISIBLE;
            tad.shape.alignment.x = "center";
            tad.shape.alignment.y = "center";
            tad.text.alignment.x = "center";

            tad.shape.rectangle(mouse.x, mouse.y, MOUSEWIDTH, MOUSEHEIGHT);
            tad.colour.fill = Paint.grey;
            if (mouse.leftDown) {
                tad.colour.fill = Paint.white;
            }

            tad.shape.alignment.x = "right";
            tad.shape.rectangle(
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3,
                MOUSEWIDTH / 2,
                MOUSEHEIGHT / 2
            );
            tad.colour.fill = Paint.grey;
            if (mouse.rightDown) {
                tad.colour.fill = Paint.white;
            }
            tad.shape.alignment.x = "left";
            tad.shape.rectangle(
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3,
                MOUSEWIDTH / 2,
                MOUSEHEIGHT / 2
            );

            tad.shape.alignment.x = "center";
            tad.colour.fill = Paint.black;
            tad.colour.stroke = Paint.black;
            //black box behind the text
            tad.shape.rectangle(X, Y - 5, BOX_WIDTH, BOX_HEIGHT);

            //green text on top
            tad.colour.fill = "white";
            tad.text._print(X, Y - tad.text.size, `x:${parseInt(mouse.x.toString())}`);
            tad.text._print(X, Y, `y:${parseInt(mouse.y.toString())}`);
        }

        tad.colour.stroke = Paint.clear;
        tad.colour.fill = Paint.red;
        tad.shape.alignment.x = "center";

        if (mouse.wheel.up) {
            if (mouse.leftDown === false && mouse.rightDown === false) {
                tad.colour.stroke = Paint.black;
                tad.colour.fill = Paint.black;
                tad.shape.rectangle(mouse.x, mouse.y, MOUSEWIDTH, MOUSEHEIGHT);
                tad.colour.stroke = Paint.white;
                tad.colour.fill = Paint.white;
            } else {
                tad.colour.stroke = Paint.black;
                tad.colour.fill = Paint.black;
            }

            //arrow
            tad.shape.rectangle(
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3,
                MOUSEWIDTH / 5,
                MOUSEHEIGHT / 3
            );
            tad.shape.polygon(
                mouse.x - 5,
                mouse.y - MOUSEHEIGHT / 3 - 7 + 5,
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3 - 7,
                mouse.x + 5,
                mouse.y - MOUSEHEIGHT / 3 - 7 + 5
            );
        } else if (mouse.wheel.down) {
            tad.colour.fill = COLOURS.BLACK;
            tad.colour.stroke = COLOURS.INVISIBLE;
            tad.shape.alignment.x = "center";
            tad.shape.alignment.y = "center";
            tad.text.alignment.y = "center";

            if (mouse.leftDown === false && mouse.rightDown === false) {
                tad.colour.stroke = "black";
                tad.colour.fill = "black";
                tad.shape.rectangle(mouse.x, mouse.y, MOUSEWIDTH, MOUSEHEIGHT);
                tad.colour.stroke = "white";
                tad.colour.fill = "white";
            } else {
                tad.colour.stroke = "black";
                tad.colour.fill = "black";
            }

            //arrow
            tad.shape.rectangle(
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3,
                MOUSEWIDTH / 5,
                MOUSEHEIGHT / 3
            );
            tad.shape.polygon(
                mouse.x - 5,
                mouse.y + MOUSEHEIGHT / 3 - 7 - 5 - 2,
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3 + 10 - 2,
                mouse.x + 5,
                mouse.y + MOUSEHEIGHT / 3 - 7 - 5 - 2
            );
        }
        tad.colour.fill = mouse.fill;
        tad.colour.stroke = mouse.stroke;
        const SIZE = 13;
        tad.shape.polygon(
            mouse.x,
            mouse.y,
            mouse.x,
            mouse.y + SIZE * 1.5,
            mouse.x + SIZE,
            mouse.y + SIZE
        );

        tad.state.load();
    }

    /**
     * Special rectangle drawing function.
     * @param {Tad} tad - The tad object to draw with.
     * @param {number} x - The x-coordinate of the rectangle.
     * @param {number} y - The y-coordinate of the rectangle.
     * @param {number} w - The width of the rectangle.
     * @param {number} h - The height of the rectangle.
     * @static
     */
    static drawRectangle(tad, x, y, w, h) {
        tad.state.save();
        Debug.cross(tad, x, y);
        tad.state.load();
    }

    /**
     * Special oval drawing function.
     * @param {Tad} tad - The tad object to draw with.
     * @param {number} x - The x-coordinate of the oval.
     * @param {number} y - The y-coordinate of the oval.
     * @param {number} w - The width of the oval.
     * @param {number} h - The height of the oval.
     * @static
     */
    static drawOval(tad, x, y, w, h) {
        tad.state.save();
        Debug.cross(tad, x, y);
        tad.state.load();
    }

    /**
     * Special cross drawing function.
     * @param {Tad} tad - The tad object to draw with.
     * @param {number} x - The x-coordinate of the center of the cross.
     * @param {number} y - The y-coordinate of the center of the cross.
     * @param {string} colour - The colour of the cross.
     * @static
     */
    static cross(tad, x, y, colour = "rgba(255,255,0,0.3)") {
        tad.colour.stroke = colour;
        tad.shape.strokeWidth = 1;
        tad.shape.line(x - 5, y, x + 5, y);
        tad.shape.line(x, y - 5, x, y + 5);
    }

    /**
     * Draws debug information for the camera object to the canvas.
     * @param {Tad} tad - The tad object to draw with.
     * @param { {x: number, y: number} } center - The center of the camera.
     * @param { {x: number, y: number} } offset - The offset of the camera.
     * @static
     */
    static drawCamera(tad, center = { x: 0, y: 0 }, offset = { x: 0, y: 0 }) {
        if (offset.x === 0 && offset.y === 0) {
            return;
        }
        tad.state.save();
        //center point.
        tad.shape.alignment.x = "center";
        tad.shape.alignment.y = "center";
        tad.shape.oval(center.x, center.y, 15);
        tad.shape.strokeWidth = 1;
        tad.colour.stroke = "white";
        tad.colour.fill = "rgba(0,0,0,0)";
        tad.shape.rectangle(
            center.x + offset.x,
            center.y + offset.y,
            tad.w,
            tad.h
        );
        tad.colour.fill = "white";
        tad.shape.strokeDash = 2;
        tad.shape.line(
            center.x,
            center.y,
            center.x + offset.x,
            center.y + offset.y
        );
        //current location
        tad.shape.oval(center.x + offset.x, center.y + offset.y, 4);
        Debug.cross(tad, center.x + offset.x, center.y + offset.y);
        tad.text.alignment.x = "center";
        tad.text.alignment.y = "center";
        tad.text._print(center.x, center.y + 4, "🎥");
        tad.state.load();
    }

    /**
     * Drawing function for the background grid
     * @param {Tad} tad - The tad object to draw with.
     * @static
     */
    static drawGrid(tad) {
        // Constants
        const INCREMENT = 50;
        const LABELWIDTH = 30;
        const LABELHEIGHT = 20;
        const PADDING_OFFSET = 10;

        // Colours
        const DULL_GREEN = "rgba(0,55,0,1)";
        const WHITE_05_OPACITY = "rgba(255,255,255,0.5)";

        // Text setup
        tad.text.alignment.x = "center";
        tad.text.alignment.y = "center";
        tad.text.size = 8;

        tad.shape.alignment.x = "center";
        tad.shape.alignment.y = "center";
        tad.colour.stroke = "rgba(0,0,0,0)";
        // Drawing vertical tags
        for (let i = 0; i < tad.w / INCREMENT; i++) {
            tad.colour.fill = WHITE_05_OPACITY;
            tad.shape.rectangle(
                i * INCREMENT,
                INCREMENT - PADDING_OFFSET,
                LABELWIDTH,
                LABELHEIGHT
            );

            tad.colour.fill = DULL_GREEN;
            tad.text._print(i * INCREMENT, INCREMENT - 5, `${i * INCREMENT}`);
        }

        // Drawing horizontal tags
        for (let y = 0; y < tad.h / INCREMENT; y++) {
            if (y * INCREMENT !== 50) {
                //prevent overlapping tag
                tad.colour.fill = WHITE_05_OPACITY;
                tad.shape.rectangle(
                    INCREMENT,
                    INCREMENT * y - PADDING_OFFSET,
                    LABELWIDTH,
                    LABELHEIGHT
                );
                tad.colour.fill = DULL_GREEN;
                tad.text._print(INCREMENT, INCREMENT * y - 5, `${y * INCREMENT}`);
            }
        }
    }

    /**
     * Draws debug information for the button object to the canvas.
     * @param {Tad} tad - The tad object to draw with.
     * @param {Button} btn - The button object to draw debug information for.
     * @static
     */
    static drawButton(tad, btn) {
        tad.state.save();

        if (btn.isHovered()) {
            Debug.drawIdleButton(tad, btn);
        } else {
            Debug.drawHoveredButton(tad, btn);
        }
        tad.state.load();
    }

    /**
     * Draws the button in an idle state.
     * @param {Tad} tad - The tad object to draw with.
     * @param {Button} btn - The button object to draw in an idle state.
     * @static
     */
    static drawIdleButton(tad, btn) {
        tad.state.save();
        //colours
        const strokeColour = COLOURS.GREEN;
        const fillColour = "rgba(0,155,0,0.5)";

        const VERTICAL_OFFSET = btn.h / 2;
        const HORIZONTAL_OFFSET = btn.w / 2;

        tad.text.size = TEXT_SIZE;
        tad.colour.fill = fillColour;
        tad.colour.stroke = strokeColour;

        tad.shape.rectangle(btn.x, btn.y, btn.w, btn.h);
        tad.colour.fill = strokeColour;

        tad.text._print(btn.x, btn.y + 20, btn.label);
        for (let i = 0; i < btn.w / 10; i++) {
            let x1 = btn.x - HORIZONTAL_OFFSET + i * 10 + 20;
            let y1 = btn.y - VERTICAL_OFFSET;
            let x2 = btn.x - HORIZONTAL_OFFSET + i * 10;
            let y2 = btn.y + VERTICAL_OFFSET;

            if (x1 > btn.x + HORIZONTAL_OFFSET === false) {
                tad.shape.line(x1, y1, x2, y2);
            }
        }

        tad.shape.oval(btn.x, btn.y, tad.text.size);
        tad.colour.fill = COLOURS.BLACK;
        tad.text._print(btn.x, btn.y, `${btn.id}`);

        tad.shape.rectangle(
            btn.x,
            btn.y - VERTICAL_OFFSET + 7,
            btn.w,
            tad.text.size * 1.5
        );
        tad.colour.fill = COLOURS.GREEN;
        tad.text._print(btn.x, btn.y - VERTICAL_OFFSET + 7, `👆 Btn`);
        tad.state.load();
    }

    /**
     * Draws the button in a hovered state.
     * @param {Tad} tad - The tad object to draw with.
     * @param {Button} btn - The button object to draw in a hovered state.
     * @static
     */
    static drawHoveredButton(tad, btn) {
        tad.state.save();
        tad.text.size = TEXT_SIZE;
        let fillColour = btn.fill;
        let strokeColour = "rgba(0,155,0,0.5)";
        fillColour = COLOURS.GREEN;
        tad.colour.fill = fillColour;
        tad.colour.stroke = COLOURS.BLACK;

        tad.shape.rectangle(btn.x, btn.y, btn.w, btn.h);
        tad.colour.fill = COLOURS.BLACK;
        tad.text._print(btn.x, btn.y + 20, btn.label);

        const y1 = btn.y - btn.h / 2;
        const y2 = btn.y + btn.h / 2;

        for (let i = 0; i < btn.w / 10; i++) {
            const x1 = btn.x - btn.w / 2 + i * 10 + 20;
            const x2 = btn.x - btn.w / 2 + i * 10;

            if (x1 > btn.x + btn.w / 2 === false) {
                tad.shape.line(x1, y1, x2, y2);
            }
        }

        tad.shape.oval(btn.x, btn.y, 10);
        tad.colour.fill = COLOURS.GREEN;
        tad.text._print(btn.x, btn.y, `${btn.id}`);

        tad.colour.fill = COLOURS.BLACK;
        tad.shape.rectangle(btn.x, btn.y - btn.h / 2 + 7, btn.w, 15);
        tad.colour.fill = COLOURS.GREEN;
        tad.text._print(btn.x, btn.y - btn.h / 2 + 7, `👆 Btn`);
        tad.state.load();
    }

    /**
     * Draws debug information for the image object to the canvas.
     * @param {Tad} tad - The tad object to draw with.
     * @param {Stamp} img - The image object to draw debug information for.
     * @static
     */
    static drawImg(tad, img) {
        tad.state.save();
        //colour

        //initial setup
        tad.text.alignment.x = "left";
        tad.text.alignment.y = "center";

        tad.context.translate(img.x, img.y);
        // translation to img x and y means the canvas draws that position so X and Y would now be 0
        const NEW_X = 0;
        const NEW_Y = 0;
        const halfWidth = img.w / 2;
        const halfHeight = img.h / 2;
        tad.context.rotate(tad.math.degreeToRadian(img.rotation));
        tad.text.size = TEXT_SIZE;

        tad.colour.fill = COLOURS.BLACK_50_OPACITY;
        tad.shape.rectangle(NEW_X, NEW_Y, img.w, img.h);
        tad.colour.stroke = COLOURS.IMG_ORANGE;
        tad.colour.fill = COLOURS.INVISIBLE;
        tad.shape.rectangle(NEW_X, NEW_Y, img.w, img.h);
        //x lines
        tad.shape.line(halfWidth, -halfHeight, -halfWidth, halfHeight);
        tad.shape.line(-halfWidth, -halfHeight, halfWidth, halfHeight);

        tad.text._print(
            NEW_X - 36,
            NEW_Y - halfHeight - 5,
            `x:${parseInt(img.x.toString())}, y:${parseInt(img.y.toString())}`
        );
        tad.colour.fill = COLOURS.BLACK;
        tad.shape.rectangle(NEW_X, NEW_Y - halfHeight, img.w, 15);
        tad.colour.fill = COLOURS.IMG_ORANGE;
        tad.text.alignment.x = "center";
        tad.text._print(NEW_X, NEW_Y - halfHeight, `🎨 Img`);

        //static label
        const LABELWIDTH = 115;
        const LABELHEIGHT = 15;

        tad.context.rotate(-tad.math.degreeToRadian(img.rotation));
        tad.colour.fill = COLOURS.BLACK;
        tad.shape.rectangle(
            NEW_X + LABELWIDTH / 2,
            NEW_Y,
            LABELWIDTH,
            LABELHEIGHT
        );
        tad.colour.fill = COLOURS.IMG_ORANGE;
        tad.shape.oval(NEW_X, NEW_Y, 10);
        tad.colour.fill = COLOURS.BLACK;
        tad.text._print(NEW_X, NEW_Y, `${img.id}`);
        tad.colour.fill = COLOURS.IMG_ORANGE;

        tad.text.alignment.x = "left";
        tad.text._print(
            NEW_X + 15,
            NEW_Y,
            `x:${parseInt(img.x.toString())} y:${parseInt(img.y.toString())} rot:${img.rotation}`
        );
        //end static label
        tad.context.rotate(tad.math.degreeToRadian(img.rotation));
        tad.colour.fill = COLOURS.IMG_ORANGE;

        tad.state.load();
    }
    static draw(tad) {}
}
