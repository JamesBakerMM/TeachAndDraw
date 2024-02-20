import { Point } from "./Point.js";
import { Group } from "./Group.js";
import { DrawState } from "./DrawStateManager.js";
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

export class Debug {
    static initialPaneBuild = true;
    static active = false;
    static constructMemoryPane(){
        if(performance && performance.memory){
            return `<strong>Memory</strong>
                <ul>
                    <li><strong>Total HeapSize:</strong>${performance.memory.totalJSHeapSize} Bytes </li>
                    <li><strong>Used HeapSize:</strong>${performance.memory.usedJSHeapSize} Bytes </li>
                    <li><strong>HeapSize Limit:</strong>${performance.memory.jsHeapSizeLimit} Bytes </li>
                </ul>`
        }
        return "" //the browser being used doesn't support memory
    }
    static constructGroupPane(){
        let html=`<strong>Group: ${Group.all.length} groups</strong>
            <ul id="groups">`
        for(let group of Group.all){
            html+=`<li>${group.name || ""} Group(${group.length}):${group.type}</li>`
        }
        html+="</ul>";
        return html
    }
    static async hideInfoPane(){
        //find and hide the info pane
    }
    static async constructInfoPane(pen) {
        // return
        if (!pen) {
            console.error("Pen instance not found.");
            return;
        }
        const debug = document.getElementById('debug');
        if(debug.classList.contains('hidden')){
            return
        }
        if(Debug.initialPaneBuild){
            const btn = document.querySelector('#showhidebtn');
            
            btn.addEventListener('click', () => {
                debug.classList.toggle('hidden');
            });
            Debug.initialPaneBuild=false;
        }
        let debugPane = document.querySelector("#debug section");

        //set it to visible
        Debug.constructGroupPane();
        const curState=new DrawState(pen);
        let html = `                    
            <strong>Canvas</strong> w:${pen.w} h:${pen.h}
            <hr>
                    <div><strong>Paused:</strong> ${pen.paused}</div>
                    <hr>
                    <strong>Fps</strong> count:${pen.frameCount}  actual:(${pen.actualFps||"nope"}/${pen.fps})
                    <hr>
                    <strong>Colour</strong><br>Fill:
                    <div class='prev' style='background:${curState.colour.fill}'>
                        <strong style='color:${curState.colour.fill}; filter: invert(100%);'>${curState.colour.fill}</strong>
                    </div>Stroke:
                    <div class='prev' style='background:${curState.colour.stroke};'>
                        <strong style='color:${curState.colour.stroke}; filter: invert(100%);'>${curState.colour.stroke}</strong>
                    </div>
                    <hr>
                    <strong>Shape</strong><br>xAlignment:<strong>${pen.shape.xAlignment}</strong> |  yAlignment:<strong>${pen.shape.yAlignment}</strong> StrokeWidth:<strong>${pen.shape.strokeWidth}</strong>
                    <hr>
                    <strong>Text</strong>
                    <br>
                        <div>${pen.text.font} | ${pen.text.size}px </div>
                        <strong>Alignment:</strong> ${pen.text.alignment} | 
                        <strong>Baseline:</strong> ${pen.text.baseline}
                    <hr>
        `;
        html+=Debug.constructMemoryPane();
        html+=Debug.constructGroupPane();
    
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

    static async applyDebugGrid(pen){
        const element=document.querySelector(".wrapper");
        element.classList.add("grid-overlay");
    }
    
    static async removeDebugGrid(pen){
        const element=document.querySelector(".wrapper");
        element.classList.remove("grid-overlay");
    }
    
    static drawCollider(pen, collider) {
        pen.state.save();
        pen.colour.stroke = COLOURS.COLLIDER.STROKE;
        pen.colour.fill = COLOURS.COLLIDER.FILL;
        // pen.context.translate(collider.x,collider.y)
        const x = collider.x;
        const y = collider.y;
        pen.colour.stroke = "aqua";
        pen.shape.strokeWidth = 3;
        // pen.shape.alignment="center";
        pen.colour.fill = "rgba(136,242,194,0.7)";
        pen.shape.rectangle(x, y, collider.w, collider.h);

        pen.colour.fill = "rgba(86,153,234,0.7)";
        let w = collider.w / 1.5;
        let h = collider.h / 1.5;
        if (
            Point.isInRect(
                pen.mouse.x,
                pen.mouse.y,
                collider.x,
                collider.y,
                collider.w,
                collider.h
            ) ||
            collider.hasOverlapped
        ) {
            w = collider.w / 1.25;
            h = collider.h / 1.25;
            pen.colour.stroke = "rgba(86,153,234,0.7)";
            pen.colour.fill = "rgba(136,242,194,1)";
        }
        pen.shape.rectangle(x, y, w, h);

        pen.state.load();
    }
    static drawPen(pen) {
        //calculations
        const LEFT = 0;
        const TOP = 0;
        const BAR_WIDTH = 150;
        const BAR_HEIGHT = 20;

        pen.state.save();
        Debug.drawGrid(pen);

        //setup
        pen.text.alignment = "left";
        pen.shape.xAlignment = "left";
        pen.shape.yAlignment = "top";
        pen.colour.fill = COLOURS.BLACK_90_OPACIITY;
        pen.colour.stroke = COLOURS.INVISIBLE;

        pen.shape.rectangle(LEFT, TOP, BAR_WIDTH, BAR_HEIGHT);

        pen.colour.fill = COLOURS.GREEN;
        pen.text.draw(2, 10, `frame:${pen.frameCount}`);

        pen.state.load();
    }
    static drawText(pen, x, y, text) {
        //calculate startX
        //adjust for alignment
        //adjust for pen.text.size
        //calculate startY
        //adjust for baseline
        //adjust for pen.text.size
        //calculate endX
        //adjust for alignment
        //adjust for pen.text.size
        //calculate endY
        //adjust for baseline
        //adjust for pen.text.size
    }
    static drawAnimation(pen, anim) {
        //draw like
    }
    static drawKeys(pen, kb, key, inputCount) {
        if (kb.keys[key].down) {
            pen.state.save();

            //setup
            pen.text.alignment = "left";
            pen.text.baseline = "middle";
            pen.text.size = TEXT_SIZE;
            pen.colour.stroke = COLOURS.INVISIBLE;

            //calculations
            const BOX_WIDTH = 80;
            const BOX_HEIGHT = 15;
            const X = pen.canvas.width - BOX_WIDTH / 2 - 50;
            const Y = pen.canvas.height - BOX_HEIGHT / 2 + inputCount;
            const BOX_X = X + BOX_WIDTH / 2;

            pen.colour.fill = COLOURS.BLACK;
            pen.shape.rectangle(BOX_X, Y, BOX_WIDTH, BOX_HEIGHT);

            pen.colour.fill = COLOURS.GREEN;
            pen.text.draw(X, Y, `⌨️ ${key}: ${kb.keys[key].frames} fr`);

            pen.state.load();
        }
    }
    static drawMouse(pen, mouse) {
        if (mouse.isPressed) {
            //calculations
            const BOX_WIDTH = 100;
            const BOX_HEIGHT = 20;
            const VERTICAL_PADDING = 10;

            //boundary mininums
            const MIN_LEFT_X = 0 + BOX_WIDTH / 2;
            const MIN_TOP_Y = 0 + BOX_HEIGHT / 2;
            const MIN_RIGHT_X = pen.w - BOX_WIDTH / 2;

            let X = mouse.x;
            let Y = mouse.y - VERTICAL_PADDING;

            const TOP_Y=Y - BOX_HEIGHT / 2;
            if (TOP_Y < MIN_TOP_Y) {
                Y = MIN_TOP_Y;
            }

            const LEFT_X=X - BOX_WIDTH / 2;
            if (LEFT_X < MIN_LEFT_X) {
                X = MIN_LEFT_X;
            }

            const RIGHT_X=X + BOX_WIDTH / 2;
            if (RIGHT_X > MIN_RIGHT_X) {
                X = MIN_RIGHT_X;
            }

            pen.state.save();

            //setup
            pen.text.size = TEXT_SIZE;
            pen.colour.fill = COLOURS.BLACK;
            pen.colour.stroke = COLOURS.INVISIBLE;
            pen.shape.xAlignment = "center";
            pen.shape.yAlignment = "center";
            pen.text.alignment = "center";

            //black box behind the text
            pen.shape.rectangle(X, Y, BOX_WIDTH, BOX_HEIGHT);

            //green text on top
            pen.colour.fill = COLOURS.GREEN;
            pen.text.draw(
                X,
                Y,
                `🖱️ x:${parseInt(mouse.x)} y:${parseInt(mouse.y)}`
            );
            pen.state.load();
        }
    }
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
        pen.text.alignment = "center";
        pen.text.baseline = "bottom";
        pen.text.size = 8;
    
        pen.colour.stroke="rgba(0,0,0,0)"
        // Drawing vertical tags
        for (let i = 0; i < pen.w / INCREMENT; i++) {
            pen.colour.fill = WHITE_05_OPACITY;
            pen.shape.rectangle(i * INCREMENT, INCREMENT - PADDING_OFFSET, LABELWIDTH, LABELHEIGHT);
    
            pen.colour.fill = DULL_GREEN;
            pen.text.draw(i * INCREMENT, INCREMENT, i * INCREMENT);
        }
    
        // Drawing horizontal tags
        for (let y = 0; y < pen.h / INCREMENT; y++) {
            pen.colour.fill = WHITE_05_OPACITY;
            pen.shape.rectangle(INCREMENT, INCREMENT * y - PADDING_OFFSET, LABELWIDTH, LABELHEIGHT);
    
            pen.colour.fill = DULL_GREEN;
            pen.text.draw(INCREMENT, INCREMENT * y, y * INCREMENT);
        }
    }
    
    static drawButton(pen, btn) {
        pen.state.save();

        if (btn.isHovered()) {
            Debug.drawIdleButton(pen, btn);
        } else {
            Debug.drawHoveredButton(pen, btn);
        }
        pen.state.load();
    }
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

        pen.text.draw(btn.x, btn.y + 20, btn.label);
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
        pen.text.draw(btn.x, btn.y, `${btn.id}`);

        pen.shape.rectangle(
            btn.x,
            btn.y - VERTICAL_OFFSET + 7,
            btn.w,
            pen.text.size * 1.5
        );
        pen.colour.fill = COLOURS.GREEN;
        pen.text.draw(btn.x, btn.y - VERTICAL_OFFSET + 7, `👆 Btn`);
        pen.state.load();
    }
    static drawHoveredButton(pen, btn) {
        pen.state.save();
        pen.text.size = TEXT_SIZE;
        let strokeColour = btn.stroke;
        let fillColour = btn.fill;
        strokeColour = "rgba(0,155,0,0.5)";
        fillColour = COLOURS.GREEN;
        pen.colour.fill = fillColour;
        pen.colour.stroke = COLOURS.BLACK;

        pen.shape.rectangle(btn.x, btn.y, btn.w, btn.h);
        pen.colour.fill = COLOURS.BLACK;
        pen.text.draw(btn.x, btn.y + 20, btn.label);

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
        pen.text.draw(btn.x, btn.y, `${btn.id}`);

        pen.colour.fill = COLOURS.BLACK;
        pen.shape.rectangle(btn.x, btn.y - btn.h / 2 + 7, btn.w, 15);
        pen.colour.fill = COLOURS.GREEN;
        pen.text.draw(btn.x, btn.y - btn.h / 2 + 7, `👆 Btn`);
        pen.state.load();
    }
    static drawImg(pen, img) {
        pen.state.save();
        //colour

        //initial setup
        pen.text.alignment = "left";
        pen.text.baseline = "middle";

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

        pen.text.draw(
            NEW_X - 36,
            NEW_Y - halfHeight - 5,
            `x:${parseInt(img.x)}, y:${parseInt(img.y)}`
        );
        pen.colour.fill = COLOURS.BLACK;
        pen.shape.rectangle(NEW_X, NEW_Y - halfHeight, img.w, 15);
        pen.colour.fill = COLOURS.IMG_ORANGE;
        pen.text.alignment = "center";
        pen.text.draw(NEW_X, NEW_Y - halfHeight, `🎨 Img`);

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
        pen.text.draw(NEW_X, NEW_Y, `${img.id}`);
        pen.colour.fill = COLOURS.IMG_ORANGE;

        pen.text.alignment = "left";
        pen.text.draw(
            NEW_X + 15,
            NEW_Y,
            `x:${parseInt(img.x)} y:${parseInt(img.y)} rot:${img.rotation}`
        );
        //end static label
        pen.context.rotate(pen.math.degreeToRadian(img.rotation));
        pen.colour.fill = COLOURS.IMG_ORANGE;

        pen.state.load();
    }
    static draw(pen) {}
}
