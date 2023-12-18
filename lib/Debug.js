export class Debug {
    static active = false;
    static COLOURS = {
        DEFAULT: {},
        BTN: {},
        IMG: {},
        ANIM: {},
        SPRITE: {},
    };
    static drawPen(pen) {
        
        //calculations
        const LEFT=0;
        const TOP=0;
        const BAR_WIDTH=150;
        const BAR_HEIGHT=20;
        
        pen.state.save();
        Debug.drawGrid(pen);
        
        //setup
        pen.text.alignment = "left";
        pen.shape.alignment = "corner";
        pen.colour.fill = "rgba(0,0,0,0.9)";
        pen.colour.stroke = "rgba(0,0,0,0)";

        pen.shape.rectangle(LEFT, TOP, BAR_WIDTH, BAR_HEIGHT);

        pen.colour.fill = "green";
        pen.colour.stroke = "green";
        pen.text.draw(2, 10, `frame:${pen.frameCount}`);
        pen.state.load();
    }
    static drawAnimation(pen, anim) {}
    static drawKeys(pen, kb, key, inputCount) {
        if (kb.keys[key].down) {
            pen.state.save();

            //setup
            pen.text.alignment = "left";
            pen.text.baseline = "middle";
            pen.text.size = 12;
            pen.colour.stroke = "rgba(0,0,0,0)";

            //calculations
            const BOX_WIDTH = 80;
            const BOX_HEIGHT  = 15;
            const X = pen.canvas.width - BOX_WIDTH / 2 - 50;
            const Y = pen.canvas.height - BOX_HEIGHT  / 2 + inputCount;
            const BOX_X= X + BOX_WIDTH / 2;

            pen.colour.fill = "black";
            pen.shape.rectangle(BOX_X, Y, BOX_WIDTH, BOX_HEIGHT );

            pen.colour.fill = "green";
            pen.text.draw(X, Y, `⌨️ ${key}: ${kb.keys[key].frames} fr`);

            pen.state.load();
        }
    }
    static drawMouse(pen, mouse) {
        if (mouse.isPressed) {
            //calculations
            const BOX_WIDTH=100;
            const BOX_HEIGHT=20;
            const VERTICAL_PADDING=10;
            const X=mouse.x;
            const Y=mouse.y-VERTICAL_PADDING;

            //colours
            const INVISIBLE="rgba(0,0,0,0)";
            const BLACK = "black";
            const GREEN = "green";

            pen.state.save(); 

            //setup
            pen.text.size = 12;
            pen.colour.fill = BLACK;
            pen.colour.stroke = INVISIBLE;
            pen.text.alignment = "center";

            //black box behind the text
            pen.shape.rectangle(X, Y, BOX_WIDTH, BOX_HEIGHT);

            //green text on top
            pen.colour.fill = GREEN;
            pen.text.draw(
                X,
                Y,
                `🖱️ x:${parseInt(mouse.x)} y:${parseInt(mouse.y)}`
            );
            pen.state.load();
        }
    }
    static drawGrid(pen) {
        //calculations
        const INCREMENT = 50;
        const TOP = 0;
        const LEFT = 0;
        const LABELWIDTH = 30;
        const LABELHEIGHT = 20;
        const PADDING_OFFSET = 10;

        //setup
        pen.shape.alignment = "corner";
        pen.text.alignment = "left";

        //colours
        const WHITE_50_OPACITY="rgba(255,255,255,0.5)";
        const DULL_GREEN="rgba(0,55,0,1)";
        const DULL_GREEN_50_OPACITY="rgba(0,55,0,0.5)"
        const GREEN_002_OPACITY="rgba(0,255,0,0.02)";

        for (let i = 0; i < pen.w / INCREMENT; i++) {
            pen.colour.fill = DULL_GREEN_50_OPACITY;
            pen.colour.stroke = GREEN_002_OPACITY;
            for (let y = 0; y < pen.h / INCREMENT; y++) {
                //vertical line
                pen.shape.line(i * INCREMENT, TOP, i * INCREMENT, pen.h);

                pen.colour.fill = WHITE_50_OPACITY;
                pen.shape.rectangle(
                    i * INCREMENT,
                    INCREMENT - PADDING_OFFSET,
                    LABELWIDTH,
                    LABELHEIGHT
                );

                pen.colour.fill = DULL_GREEN;
                pen.text.draw(i * INCREMENT, INCREMENT, i * INCREMENT);

                //horitontal line
                pen.shape.line(LEFT, INCREMENT * y, pen.w, INCREMENT * y);
                pen.colour.fill = WHITE_50_OPACITY;
                pen.shape.rectangle(
                    INCREMENT,
                    INCREMENT * y - PADDING_OFFSET,
                    LABELWIDTH,
                    LABELHEIGHT
                );
                pen.colour.fill = DULL_GREEN;
                pen.text.draw(INCREMENT, INCREMENT * y, y * INCREMENT);
            }
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

        //colours
        const BLACK = "black";
        const GREEN = "rgb(0,255,0)";
        const strokeColour = GREEN;
        const fillColour = "rgba(0,155,0,0.5)";

        const VERTICAL_OFFSET=btn.h/2;
        const HORIZONTAL_OFFSET=btn.w/2;

        pen.text.size = 10;
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
        pen.colour.fill = BLACK;
        pen.text.draw(btn.x, btn.y, `${btn.id}`);


        pen.shape.rectangle(btn.x, btn.y - VERTICAL_OFFSET + 7, btn.w, pen.text.size*1.5);
        pen.colour.fill = GREEN;
        pen.text.draw(btn.x, btn.y - VERTICAL_OFFSET + 7, `👆 Btn`);
    }
    static drawHoveredButton(pen, btn) {
        const BLACK="black";

        pen.text.size = 10;
        let strokeColour = btn.stroke;
        let fillColour = btn.fill;
        strokeColour = "rgba(0,155,0,0.5)";
        fillColour = "rgba(0,255,0)";
        pen.colour.fill = fillColour;
        pen.colour.stroke = BLACK;

        pen.shape.rectangle(btn.x, btn.y, btn.w, btn.h);
        pen.colour.fill = BLACK;
        pen.text.draw(btn.x, btn.y + 20, btn.label);
        for (let i = 0; i < btn.w / 10; i++) {
            let x1 = btn.x - btn.w / 2 + i * 10 + 20;
            let y1 = btn.y - btn.h / 2;
            let x2 = btn.x - btn.w / 2 + i * 10;
            let y2 = btn.y + btn.h / 2;

            if (x1 > btn.x + btn.w / 2 === false) {
                pen.shape.line(x1, y1, x2, y2);
            }
        }

        pen.shape.oval(btn.x, btn.y, 10);
        pen.colour.fill = "rgb(0,255,0)";
        pen.text.draw(btn.x, btn.y, `${btn.id}`);

        pen.colour.fill = BLACK;
        pen.shape.rectangle(btn.x, btn.y - btn.h / 2 + 7, btn.w, 15);
        pen.colour.fill = "rgb(0,255,0)";
        pen.text.draw(btn.x, btn.y - btn.h / 2 + 7, `👆 Btn`);
    }
    static drawImg(pen, img) {
        //colour
        const INVISIBLE="rgba(0,0,0,0)";
        const BLACK_50_OPACITY="rgba(0,0,0,0.5)";
        const IMG_ORANGE="rgb(255, 185, 0)";
        const BLACK="black";

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
        pen.text.size = 10;


        pen.colour.fill = BLACK_50_OPACITY;
        pen.shape.rectangle(NEW_X, NEW_Y, img.w, img.h);
        pen.colour.stroke = IMG_ORANGE;
        pen.colour.fill = INVISIBLE;
        pen.shape.rectangle(NEW_X, NEW_Y, img.w, img.h);
        //x lines
        pen.shape.line(halfWidth, -halfHeight, -halfWidth, halfHeight);
        pen.shape.line(-halfWidth, -halfHeight, halfWidth, halfHeight);

        pen.text.draw(
            NEW_X - 36,
            NEW_Y - halfHeight - 5,
            `x:${parseInt(img.x)}, y:${parseInt(img.y)}`
        );
        pen.colour.fill = BLACK;
        pen.shape.rectangle(NEW_X, NEW_Y - halfHeight, img.w, 15);
        pen.colour.fill = IMG_ORANGE;
        pen.text.alignment="center";
        pen.text.draw(NEW_X, NEW_Y - halfHeight, `🎨 Img`);

        //static label
        const LABELWIDTH = 115;
        const LABELHEIGHT = 15;

        pen.context.rotate(-pen.math.degreeToRadian(img.rotation));
        pen.colour.fill = BLACK;
        pen.shape.rectangle(NEW_X + LABELWIDTH/2, NEW_Y, LABELWIDTH, LABELHEIGHT);
        pen.colour.fill = IMG_ORANGE;
        pen.shape.oval(NEW_X, NEW_Y, 10);
        pen.colour.fill = BLACK;
        pen.text.draw(NEW_X, NEW_Y, `id:${img.id}`);
        pen.colour.fill = IMG_ORANGE;
        
        pen.text.alignment="left";
        pen.text.draw(
            NEW_X + 15,
            NEW_Y,
            `x:${parseInt(img.x)} y:${parseInt(img.y)} rot:${img.rotation}`
        );
        //end static label
        pen.context.rotate(pen.math.degreeToRadian(img.rotation));
        pen.colour.fill = IMG_ORANGE;
    }
    static draw(pen) {}
}
