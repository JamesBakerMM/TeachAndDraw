import { $, shape, colour, mouse, keys, text } from "../../lib/Pen.js";
import { makeGroup } from "../../lib/Group.js";
import { Paint } from "../../lib/Paint.js";

$.use(draw);
$.width=1000;
$.height=2100;
// $.debug=true;
const convenors = 2;
const students = 400;
const tutors = 3;

function draw(){
    colour.fill="grey";
    shape.rectangle($.width/2,$.height/2,$.width,$.height);

    colour.stroke="black"
    shape.strokeWidth=2;
    for(let i=0; i<convenors; i++){
        const size=20;
        const x=size+i*size*1.5;
        const y=size;
        // colour.stroke=Paint.clear
        colour.fill=Paint.blue.dark[0];
        shape.oval(x,y,size);
        colour.fill=Paint.blue.pale[0];
        text.print(x,y,"c")
    }

    for(let i=0; i<tutors; i++){
        const size=20;
        const x=size+i*size*1.5;
        const y=size*3;
        // colour.stroke=Paint.clear
        colour.fill=Paint.red.pale[0];
        shape.oval(x,y,size);
        colour.fill=Paint.pink.dark[0];
        text.print(x,y,"t")
    }

    let x=-10;
    let y=100;
    const size=20;
    for(let i=0; i<students; i++){
        x+=size+10;
        if(x>$.width-100){
            x=size;
            y+=size*1.5;
        }
        // colour.stroke=Paint.clear
        colour.fill=Paint.purple.pale[0];
        shape.oval(x,y,size);
        colour.fill=Paint.purple.dark[0];
        text.print(x,y,"s")
    }
    $.drawAllEntities();
}