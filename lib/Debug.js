export class Debug {
    static active = false;
    static COLOURS = {
        DEFAULT: {},
        BTN: {},
        IMG: {},
        ANIM: {},
        SPRITE: {},
    };
    static drawPen(pen){
        pen.state.save();
        Debug.drawGrid(pen);
        pen.text.alignment="left";
        pen.shape.alignment="corner";
        pen.colour.fill = "rgba(0,0,0,0.9)";
        pen.colour.stroke="rgba(0,0,0,0)";
        pen.shape.rectangle(0, 0, 150, 20);
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
            pen.text.alignment="left";
            pen.text.baseline="middle";
            pen.text.size=12;
            pen.colour.stroke="rgba(0,0,0,0)";

            //calculations
            const boxWidth = 80;
            const boxHeight = 15;
            const boxX = pen.canvas.width - boxWidth/2-50;
            const boxY = pen.canvas.height - boxHeight/2+inputCount;

            pen.colour.fill="black";
            pen.shape.rectangle(boxX+boxWidth/2,boxY,boxWidth,boxHeight)

            pen.colour.fill = "green";
            pen.text.draw(boxX, boxY, `⌨️ ${key}: ${kb.keys[key].frames} fr`);

            pen.state.load();
        }
    }
    static drawMouse(pen, mouse) {
        if (mouse.isPressed) {
            pen.state.save();
            pen.text.size=12;
            pen.colour.fill="black";
            pen.colour.stroke="rgba(0,0,0,0)";
            pen.shape.rectangle(
                mouse.x, 
                mouse.y-10,
                100,
                20
            )
            pen.colour.fill = "green";
            pen.text.alignment="center";
            pen.text.draw(
                mouse.position.x,
                mouse.position.y - 10,
                `🖱️ x:${parseInt(mouse.x)} y:${parseInt(mouse.y)}`
            );
            pen.state.load();
        }
    }
    static drawFrames(pen) {
        //draw framecount
    }
    static drawGrid(pen) {
        const INCREMENT = 50;
        pen.shape.alignment="corner"
        pen.text.alignment="left";
        for (let i = 0; i < pen.w / INCREMENT; i++) {
            pen.colour.fill = "rgba(0,55,0,0.5)";
            pen.colour.stroke = "rgba(0,255,0,0.02)";
            for (let y = 0; y < pen.h / INCREMENT; y++) {
                //vertical line
                pen.shape.line(i * INCREMENT, 0, i * INCREMENT, pen.h);

                
                pen.colour.fill = "white";
                pen.shape.rectangle(i * INCREMENT, INCREMENT-10, 30, 20);
                
                pen.colour.fill = "rgba(0,55,0,1)";
                pen.text.draw(i * INCREMENT, INCREMENT, i * INCREMENT);

                //horitontal line
                pen.shape.line(0, INCREMENT * y, pen.w, INCREMENT * y);
                pen.colour.fill = "white";
                pen.shape.rectangle(INCREMENT, INCREMENT * y-10, 30, 20);
                pen.colour.fill = "rgba(0,55,0,1)";
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
        pen.text.size = 10;
        const strokeColour = "rgb(0,255,0)";
        const fillColour = "rgba(0,155,0,0.5)";
        pen.colour.fill = fillColour;
        pen.colour.stroke = strokeColour;

        pen.shape.rectangle(btn.x, btn.y, btn.w, btn.h);
        pen.colour.fill = strokeColour;
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
        pen.colour.fill = "rgb(0,0,0)";
        pen.text.draw(btn.x, btn.y, `${btn.id}`);

        pen.colour.fill = "black";
        pen.shape.rectangle(btn.x, btn.y - btn.h / 2 + 7, btn.w, 15);
        pen.colour.fill = "rgb(0,255,0)";
        pen.text.draw(btn.x, btn.y - btn.h / 2 + 7, `👆 Type:Btn`);
    }
    static drawHoveredButton(pen, btn) {
        pen.text.size = 10;
        let strokeColour = btn.stroke;
        let fillColour = btn.fill;
        strokeColour = "rgba(0,155,0,0.5)";
        fillColour = "rgba(0,255,0)";
        pen.colour.fill = fillColour;
        pen.colour.stroke = "black";

        pen.shape.rectangle(btn.x, btn.y, btn.w, btn.h);
        pen.colour.fill = "black";
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

        pen.colour.fill = "black";
        pen.shape.rectangle(btn.x, btn.y - btn.h / 2 + 7, btn.w, 15);
        pen.colour.fill = "rgb(0,255,0)";
        pen.text.draw(btn.x, btn.y - btn.h / 2 + 7, `👆 Type:Btn`);
    }
    static drawImg(pen, img) {
        pen.context.translate(img.x, img.y);
        pen.context.rotate(pen.math.degreeToRadian(img.rotation));
        pen.text.size = 10;
        const halfWidth = img.w / 2;
        const halfHeight = img.h / 2;

        pen.text.alignment = "left";
        pen.text.baseline = "middle";
        pen.colour.fill = "rgba(0,0,0,0.5)";
        pen.shape.rectangle(0, 0, img.w, img.h);
        pen.colour.stroke = "#ffb900";
        pen.colour.fill = "rgba(0,0,0,0)";
        pen.shape.rectangle(0, 0, img.w, img.h);
        //x lines
        pen.shape.line(halfWidth, -halfHeight, -halfWidth, halfHeight);
        pen.shape.line(-halfWidth, -halfHeight, halfWidth, halfHeight);

        pen.text.draw(
            0 - 36,
            0 - img.h / 2 - 5,
            `x:${parseInt(img.x)}, y:${parseInt(img.y)}`
        );
        pen.colour.fill = "black";
        pen.shape.rectangle(0, 0 - img.h / 2 + 15, img.w, 15);
        pen.colour.fill = "#ffb900";
        pen.text.draw(0 - 36, 0 - img.h / 2 + 18, `🎨 Type:Image`);

        //static label
        pen.context.rotate(-pen.math.degreeToRadian(img.rotation));
        pen.colour.fill = "black";
        pen.shape.rectangle(0 + 60, 0, 115, 15);
        pen.colour.fill = "#ffb900";
        pen.shape.oval(0, 0, 10);
        pen.colour.fill = "black";
        pen.text.draw(0 - 8, 0, `id:${img.id}`);
        pen.colour.fill = "#ffb900";
        pen.text.draw(
            0 + 15,
            0,
            `x:${img.x.toFixed(0)} y:${img.y.toFixed(0)} rot:${img.rotation}`
        );
        //end static label
        pen.context.rotate(pen.math.degreeToRadian(img.rotation));
        pen.colour.fill = "#ffb900";
    }
    static draw(pen) {}
}
