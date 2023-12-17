export class Debug {
    static active = false;
    static COLOURS = {
        DEFAULT: {},
        BTN: {},
        IMG: {},
        ANIM: {},
        SPRITE: {},
    };
    static drawAnimation(pen, anim) {}
    static drawKeys(pen, keys) {}
    static drawMouse(pen, mouse) {}
    static drawFrames(pen) {
        //draw framecount
    }
    static drawGrid(pen) {
        pen.state.save();
        const INCREMENT = 50;
        pen.shape.alignment="corner"
        pen.text.alignment="left";
        for (let i = 0; i < pen.w / INCREMENT; i++) {
            pen.colour.fill = "rgba(0,55,0,0.5)";
            pen.colour.stroke = "rgba(0,255,0,0.1)";
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
        pen.state.load();
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
