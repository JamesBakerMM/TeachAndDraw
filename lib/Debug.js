// @ts-nocheck
import { Collider } from "./Collider.js";
import { Group } from "./Group.js";
import { Paint } from "./Paint.js";
import { Tad } from "./TeachAndDraw.js";
import { Vector } from "./Vector.js";

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
            const value = Group.all[i].deref();
            if(value){
                html += `<li>${value.name || ""} Group(${value.length}):${
                    value.type
                }</li>`;
            }
        }
        html += "</ul>";
        return html;
    }

    /**
     * Constructs the camera information pane for the debug information.
     * @param {camera} camera - The camera object to display information for.
     * @returns {string} - The HTML structure for the camera information pane.
     * @static
     */
    static constructCameraInfoPane(camera) {
        let html = `
            <strong>Camera:</strong>
            <br/>
            <hr>
            <strong>Center</strong><br>x:<strong>${camera.x}</strong> |  y:<strong>${camera.y}</strong>
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
            Math.floor(tad.time.running) || "nope"
        }/${tad.fps})
                    <hr>
                    <strong>MsElapsed</strong>:(${Math.floor(
                        tad.time.msElapsed
                    )})
                    <hr>
                    <strong>Shape Colour</strong><br>Colour:
                    <div class='prev' style='background:${tad.shape.colour}'>
                        <strong style='color:${
                            tad.shape.colour
                        }; filter: invert(100%);'>${tad.shape.colour}</strong>
                    </div>Stroke:
                    <div class='prev' style='background:${tad.shape.border};'>
                        <strong style='color:${
                            tad.shape.border
                        }; filter: invert(100%);'>${tad.shape.border}</strong>
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
        // tad.state.reset();
        tad.shape.alignment.x = "center";
        tad.shape.alignment.y = "center";
        tad.shape.border = COLOURS.COLLIDER.STROKE;
        tad.shape.colour = Paint.clear;
        // tad.context.translate(collider.x,collider.y)
        const x = collider.x;
        const y = collider.y;

        tad.shape.border = Paint.paleaqua;
        tad.shape.strokeWidth = 3;

        tad.shape.colour = `rgba(20,250,250,0.1)`;

        if (collider.shape === "box" && collider.vertices != null) {
            tad.shape.movedByCamera = collider.movedByCamera;

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
            // tad.text.print(collider.x, collider.y, `x:${parseInt(collider.x)}`);
            // tad.text.print(collider.x, collider.y+tad.text.size*1, `y:${parseInt(collider.y)}`);
        }

        if (collider.exists === false) {
            tad.text.print(x, y, "💀");
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
        // tad.state.reset();
        tad.shape.movedByCamera = false;
        tad.shape.rotation = 0;
        tad.text.movedByCamera = false;
        tad.text.rotation = 0;
        Debug.drawGrid(tad);

        //setup
        tad.text.alignment.x = "left";
        tad.shape.alignment.x = "left";
        tad.shape.alignment.y = "top";
        tad.shape.colour = COLOURS.BLACK_90_OPACIITY;
        tad.shape.border = COLOURS.INVISIBLE;

        tad.shape.rectangle(LEFT, TOP, BAR_WIDTH, BAR_HEIGHT);

        tad.text.colour = COLOURS.GREEN;
        tad.text.print(2, 10, `frame:${tad.frameCount}`);

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
        // tad.state.reset();

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
        tad.shape.colour = Paint.green;
        tad.shape.border = "grey";
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
            tad.shape.border = "red";
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
            // tad.state.reset();
            
            //setup
            tad.text.alignment.x = "left";
            tad.text.alignment.y = "center";
            tad.text.size = TEXT_SIZE;
            tad.shape.border = COLOURS.INVISIBLE;
            tad.shape.alignment.x = "left";
            tad.shape.alignment.y = "center";

            //calculations
            const BOX_WIDTH = 100;
            const BOX_HEIGHT = 15;
            const X = tad.canvas.width - BOX_WIDTH / 2 - 50;
            const Y = tad.canvas.height - BOX_HEIGHT / 2 + inputCount;
            const BOX_X = X;

            tad.shape.colour = Paint.black;
            tad.shape.rectangle(BOX_X, Y, BOX_WIDTH + 100, BOX_HEIGHT);

            tad.text.colour = COLOURS.GREEN;
            tad.text.print(X, Y, `⌨️ ${key}: ${keys.keys[key].frames} fr`);

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
        // tad.state.reset();
        tad.shape.movedByCamera = false;
        tad.text.movedByCamera  = false;

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
            tad.shape.colour = COLOURS.BLACK;
            tad.shape.border = COLOURS.INVISIBLE;
            tad.shape.alignment.x = "center";
            tad.shape.alignment.y = "center";
            tad.text.alignment.x = "center";

            tad.shape.rectangle(mouse.x, mouse.y, MOUSEWIDTH, MOUSEHEIGHT);
            tad.shape.colour = Paint.grey;
            if (mouse.leftDown) {
                tad.shape.colour = Paint.white;
            }

            tad.shape.alignment.x = "right";
            tad.shape.rectangle(
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3,
                MOUSEWIDTH / 2,
                MOUSEHEIGHT / 2
            );
            tad.shape.colour = Paint.grey;
            if (mouse.rightDown) {
                tad.shape.colour = Paint.white;
            }
            tad.shape.alignment.x = "left";
            tad.shape.rectangle(
                mouse.x,
                mouse.y - MOUSEHEIGHT / 3,
                MOUSEWIDTH / 2,
                MOUSEHEIGHT / 2
            );

            tad.shape.alignment.x = "center";
            tad.shape.colour = Paint.black;
            tad.shape.border = Paint.black;
            //black box behind the text
            tad.shape.rectangle(X, Y - 5, BOX_WIDTH, BOX_HEIGHT);

            //green text on top
            tad.text.colour = Paint.white;
            tad.text.print(X, Y - tad.text.size, `x:${parseInt(mouse.x.toString())}`);
            tad.text.print(X, Y, `y:${parseInt(mouse.y.toString())}`);
        }

        tad.shape.colour = Paint.red;
        tad.shape.border = Paint.clear;
        tad.shape.alignment.x = "center";

        if (mouse.wheel.up) {
            tad.shape.colour = Paint.black;
            tad.shape.border = Paint.black;

            if (mouse.leftDown === false && mouse.rightDown === false) {
                tad.shape.rectangle(mouse.x, mouse.y, MOUSEWIDTH, MOUSEHEIGHT);
                tad.shape.border = Paint.white;
                tad.shape.colour = Paint.white;
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
            tad.shape.colour = COLOURS.BLACK;
            tad.shape.border = COLOURS.INVISIBLE;
            tad.shape.alignment.x = "center";
            tad.shape.alignment.y = "center";
            tad.text.alignment.y = "center";

            tad.shape.colour = Paint.black;
            tad.shape.border = Paint.black;
            if (mouse.leftDown === false && mouse.rightDown === false) {
                tad.shape.rectangle(mouse.x, mouse.y, MOUSEWIDTH, MOUSEHEIGHT);
                tad.shape.border = Paint.white;
                tad.shape.colour = Paint.white;
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
        tad.shape.colour = mouse.colour;
        tad.shape.border = mouse.border;
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
        tad.shape.border = colour;
        tad.shape.strokeWidth = 1;
        tad.shape.line(x - 5, y, x + 5, y);
        tad.shape.line(x, y - 5, x, y + 5);
    }

    /**
     * Draws debug information for the camera object to the canvas.
     * @param {Tad} tad - The tad object to draw with.
     * @param { {x: number, y: number} } center - The camera position.
     * @static
     */
    static drawCamera(tad) {
        // if (offset.x === 0 && offset.y === 0) {
        //     return;
        // }
        tad.state.save();
        tad.shape.movedByCamera = true;
        tad.text.movedByCamera  = false;
        const center = Vector.temp(tad.w/2, tad.h/2);

        //center point.
        tad.shape.alignment.x = "center";
        tad.shape.alignment.y = "center";
        tad.shape.oval(tad.camera.x, tad.camera.y, 15);
        tad.shape.strokeWidth = 1;
        tad.shape.border = Paint.white;
        tad.shape.colour = Paint.clear;
        tad.shape.rectangle(
            center.x,
            center.y,
            tad.w,
            tad.h
        );
        tad.shape.colour = Paint.white;
        tad.shape.strokeDash = 2;
        tad.shape.line(
            center.x,
            center.y,
            center.x + (tad.camera.x - center.x),
            center.y + (tad.camera.y - center.y)
        );
        //current location
        tad.shape.oval(center.x, center.y, 4);
        Debug.cross(tad, center.x, center.y);
        tad.text.alignment.x = "center";
        tad.text.alignment.y = "center";
        tad.text.print(center.x, center.y + 4, "🎥");
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
        tad.shape.border = "rgba(0,0,0,0)";
        // Drawing vertical tags
        for (let i = 0; i < tad.w / INCREMENT; i++) {
            tad.shape.colour = WHITE_05_OPACITY;
            tad.shape.rectangle(
                i * INCREMENT,
                INCREMENT - PADDING_OFFSET,
                LABELWIDTH,
                LABELHEIGHT
            );

            tad.shape.colour = DULL_GREEN;
            tad.text.print(i * INCREMENT, INCREMENT - 5, `${i * INCREMENT}`);
        }

        // Drawing horizontal tags
        for (let y = 0; y < tad.h / INCREMENT; y++) {
            if (y * INCREMENT !== 50) {
                //prevent overlapping tag
                tad.shape.colour = WHITE_05_OPACITY;
                tad.shape.rectangle(
                    INCREMENT,
                    INCREMENT * y - PADDING_OFFSET,
                    LABELWIDTH,
                    LABELHEIGHT
                );
                tad.shape.colour = DULL_GREEN;
                tad.text.print(INCREMENT, INCREMENT * y - 5, `${y * INCREMENT}`);
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
        // tad.state.reset();

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
        // tad.state.reset();
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

        tad.text.print(btn.x, btn.y + 20, btn.label);
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
        tad.text.print(btn.x, btn.y, `${btn.id}`);

        tad.shape.rectangle(
            btn.x,
            btn.y - VERTICAL_OFFSET + 7,
            btn.w,
            tad.text.size * 1.5
        );
        tad.colour.fill = COLOURS.GREEN;
        tad.text.print(btn.x, btn.y - VERTICAL_OFFSET + 7, `👆 Btn`);
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
        // tad.state.reset();
        tad.text.size = TEXT_SIZE;
        let fillColour = btn.colour;
        let strokeColour = "rgba(0,155,0,0.5)";
        fillColour = COLOURS.GREEN;
        tad.colour.fill = fillColour;
        tad.colour.stroke = COLOURS.BLACK;

        tad.shape.rectangle(btn.x, btn.y, btn.w, btn.h);
        tad.colour.fill = COLOURS.BLACK;
        tad.text.print(btn.x, btn.y + 20, btn.label);

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
        tad.text.print(btn.x, btn.y, `${btn.id}`);

        tad.colour.fill = COLOURS.BLACK;
        tad.shape.rectangle(btn.x, btn.y - btn.h / 2 + 7, btn.w, 15);
        tad.colour.fill = COLOURS.GREEN;
        tad.text.print(btn.x, btn.y - btn.h / 2 + 7, `👆 Btn`);
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
        // tad.state.reset();
        tad.text.movedByCamera = false;
        tad.shape.movedByCamera = false;

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

        tad.text.print(
            NEW_X - 36,
            NEW_Y - halfHeight - 5,
            `x:${parseInt(img.x.toString())}, y:${parseInt(img.y.toString())}`
        );
        tad.colour.fill = COLOURS.BLACK;
        tad.shape.rectangle(NEW_X, NEW_Y - halfHeight, img.w, 15);
        tad.colour.fill = COLOURS.IMG_ORANGE;
        tad.text.alignment.x = "center";
        tad.text.print(NEW_X, NEW_Y - halfHeight, `🎨 Img`);

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
        tad.text.print(NEW_X, NEW_Y, `${img.id}`);
        tad.colour.fill = COLOURS.IMG_ORANGE;

        tad.text.alignment.x = "left";
        tad.text.print(
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
