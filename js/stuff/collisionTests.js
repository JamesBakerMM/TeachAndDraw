import { $, shape, colour, mouse, kb, text } from "../../lib/Pen.js";
import { makeGroup } from "../../lib/Group.js";

$.start(draw);

$.debug=true;
let edges = makeGroup();
let squares = makeGroup();
// let leftEdge=$.makeBoxCollider(0,$.h/2,20,$.h);
// leftEdge.static=true;
// let rightEdge=$.makeBoxCollider($.w,$.h/2,20,$.h);
// rightEdge.static=true;

// edges.push(leftEdge);
// edges.push(rightEdge);


let leftSquare=$.makeBoxCollider($.w/2-300,$.h/2-20,80,80);
leftSquare.velocity.x = 6;
leftSquare.mass = 2;
leftSquare.friction = 10;
squares.push(leftSquare);

const START_NUM=-35;
for (let i = START_NUM; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2+200,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}

for (let i = START_NUM; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2+150,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}

for (let i = START_NUM; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2+100,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}

for (let i = START_NUM; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2+50,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}
for (let i = START_NUM; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2+2,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}
for (let i = START_NUM; i < 5; i++) {
    let rightSquare=$.makeBoxCollider($.w/2-39,$.h/2 + i * 60,40,40);
    rightSquare.velocity.x = 0;
    rightSquare.mass = 1;
    rightSquare.friction = 10;
    squares.push(rightSquare);
}

function draw(){
    // if($.frameCount>50){

    // $.text.font="arial";
        // $.paused=true;
    // }
    squares.draw();
    //edges.draw();
    if(mouse.isPressed){
        leftSquare.x=mouse.x;
        leftSquare.y=mouse.y;
        leftSquare.velocity.x=0;
        leftSquare.velocity.y=0;
    }

    if(kb.isDown("arrowup")){
        leftSquare.velocity.y--
    }
    if(kb.isDown("arrowdown")){
        leftSquare.velocity.y++
    }
    if(kb.isDown("arrowleft")){
        leftSquare.velocity.x--
    }
    if(kb.isDown("arrowright")){
        leftSquare.velocity.x++
    }

    // if(leftSquare.x>$.width || leftSquare.x<0){
    //     leftSquare.velocity.x=-leftSquare.velocity.x
    // }
    // if(leftSquare.y>$.height || leftSquare.y<0){
    //     leftSquare.velocity.y=-leftSquare.velocity.y
    // }
    
    squares.collides(squares);
    for (let i = 0; i < squares.length; i++) {
        if(squares[i].x>$.width){
            squares[i].x=$.width;
            squares[i].velocity.x=-squares[i].velocity.x
        }
        if(squares[i].x<0){
            squares[i].x=0;
            squares[i].velocity.x=-squares[i].velocity.x
        }
        if(squares[i].y>$.height){
            squares[i].y=$.height-1
            squares[i].velocity.y=-squares[i].velocity.y
        }
        
        // if(leftSquare.collides(squares[i])){
        //     squares[i].remove=true
        // }
        // for (let j = 0; j < squares.length; j++) {
        //     if (i != j) {
        //         if(squares[i].collides(squares[j])){
        //             squares[j].remove=true;
        //         }
        //     }
        // }

        $.colour.fill = "#00000000";
        $.colour.stroke = "#FFFF00FF";
        $.shape.oval(squares[i].x, squares[i].y, squares[i].radius, squares[i].radius);
    }
}