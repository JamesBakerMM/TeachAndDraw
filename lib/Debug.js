export class Debug {
    static active=false;
    static drawAnimation(pen,anim){

    }
    static drawKeys(pen,keys){

    }
    static drawMouse(pen,mouse){

    }
    static drawFrames(pen){
        //draw framecount
    }
    static drawGrid(pen){

    }
    static drawButton(pen,btn){
        //draw debug for this button
    }
    static drawIdleButton(pen,btn){

    }
    static drawHoveredButton(pen,btn){

    }
    static drawImg(pen,img){
        

        pen.context.translate(img.x, img.y);
        pen.context.rotate(pen.math.degreeToRadian(img.rotation));
        pen.text.size=10;


        const halfWidth=img.w/2;
        const halfHeight=img.h/2;

        pen.text.alignment="left";
        pen.text.baseline="bottom";
        pen.colour.fill = "rgba(0,0,0,0.5)";
        pen.shape.rectangle(
            0,
            0,
            img.w,
            img.h
        );
        pen.colour.stroke = "#ffb900";
        pen.colour.fill = "rgba(0,0,0,0)";
        pen.shape.rectangle(
            0,
            0,
            img.w,
            img.h
        );
        //x lines
        pen.shape.line(
            halfWidth,
            -halfHeight,
            -halfWidth,
            halfHeight
        );
        pen.shape.line(
            -halfWidth,
            -halfHeight,
            halfWidth,
            halfHeight
        );

        
        pen.text.draw(
            0-36,
            0 - img.h/2-5,
            `x:${parseInt(img.x)}, y:${parseInt(img.y)}`
        );
        pen.colour.fill = "black";
        pen.shape.rectangle(
            0,
            0 - img.h/2+15,
            img.w,
            15
        );
        pen.colour.fill = "#ffb900";
        pen.text.draw(0-36, 0 - img.h/2+18, `🎨 Type:Image`);

        //static label
        pen.context.rotate(-pen.math.degreeToRadian(img.rotation));
        pen.colour.fill = "black";
        pen.shape.rectangle(
            0+60,
            0,
            115,
            15
        );
        pen.colour.fill = "#ffb900";
        pen.shape.oval(0, 0, 10);
        pen.colour.fill = "black";
        pen.text.draw(0 - 8, 0 + 3, `id:${img.id}`);
        pen.colour.fill = "#ffb900";
        pen.text.draw(0+15, 0 + 3, `x:${img.x.toFixed(0)} y:${img.y.toFixed(0)} rot:${img.rotation}`);
        //end static label
        pen.context.rotate(pen.math.degreeToRadian(img.rotation));
        pen.colour.fill = "#ffb900";
    }
    static draw(pen){

    }
}