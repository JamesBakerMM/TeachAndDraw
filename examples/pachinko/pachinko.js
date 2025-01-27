import { $, shape, colour, mouse, keys, text } from "../../lib/TeachAndDraw.js";

$.use(update);
$.debug=true;

//Make the groups
let walls = $.makeGroup();
let pegs = $.makeGroup();
let balls = $.makeGroup();

//load all the images
let img_peg=$.loadImage(0,0,"./images/peg.png");
let img_peg2=$.loadImage(0,0,"./images/peg2.png");
let img_ball=$.loadImage(0,0,"./images/ball.png");
let img_wall=$.loadImage(0,0,"./images/bucket_wall.png");
let img_wall_side=$.loadImage(0,0,"./images/side_wall.png");
let img_floor=$.loadImage(0,0,"./images/bucket_floor.png");

let img_10=$.loadImage(0,0,"./images/points_10.png");
let img_50=$.loadImage(0,0,"./images/points_50.png");
let img_100=$.loadImage(0,0,"./images/points_100.png");

//load the text font
const font = $.loadCustomFont("Comic Mono", "../../fonts/ComicMono.ttf");

//make the walls and floor
let left_Wall=$.makeBoxCollider(0,400,40,800);
left_Wall.static = true;
left_Wall.asset = img_wall_side;
walls.push(left_Wall);

let right_Wall=$.makeBoxCollider(600,400,40,800);
right_Wall.static = true;
right_Wall.asset = img_wall_side;
walls.push(right_Wall);

let floor=$.makeBoxCollider(300,800,600,40);
floor.static = true;
floor.asset = img_floor;
walls.push(floor);

// make the buckets at the bottom
let size = 118;
for (let i = size; i <= 500; i += size) {
    let bucket_Wall=$.makeBoxCollider(i,740,20,80);
    bucket_Wall.static = true;
    bucket_Wall.asset = img_wall;
    walls.push(bucket_Wall);
}

//make all the pegs
let row = true;
for (let i = 150; i <= 650; i += 90) {
    let offset = 0;
    row = !row;
    if (row)
        offset = 40;
        
    for (let j = 30+offset; j+offset <= 570; j += 90) {
        let peg=$.makeCircleCollider(j,i,20,80);
        peg.static = true;
        peg.asset = img_peg;
        pegs.push(peg);
    }
}

//make the points boxes in the buckets
let points1=$.makeBoxCollider(size/2,750,size,size);
points1.static = true;
points1.asset = img_10;

let points2=$.makeBoxCollider(size/2 + size,750,size,size);
points2.static = true;
points2.asset = img_50;

let points3=$.makeBoxCollider(size/2 + size*2,750,size,size);
points3.static = true;
points3.asset = img_100;

let points4=$.makeBoxCollider(size/2 + size*3,750,size,size);
points4.static = true;
points4.asset = img_50;

let points5=$.makeBoxCollider(size/2 + size*4,750,size,size);
points5.static = true;
points5.asset = img_10;

let keydown = false;
function update() {
    //Set screen size
    $.w=600;
    $.h=800;

    //do background colour
    $.colour.fill="rgba(245,245,255)";
    $.shape.rectangle($.width/2,$.height/2,$.width,$.height);

    //Spawn balls if spacebar is pressed
    if(keys.down(" ") && !keydown){
        keydown = true;
        let x = 20 + (Math.random() * 560);
        let ball=$.makeCircleCollider(x,20,40,40);
        ball.asset = img_ball;
        ball.mass = 1;
        ball.bounciness = 100;
        ball.friction=2;
        balls.push(ball);
    }
    else if (!keys.down(" "))
    {
        keydown = false;
    }
    
    //Collide with the walls and other balls
    balls.collides(balls);
    balls.collides(walls);

    //Countdown to reset peg image after it has been hit
    for (let i = 0; i < pegs.length; i++) {
        const peg = pegs[i];
        if (peg.life != null) {
            peg.life -= 1;
            if (peg.life == 0) {
                peg.life = null;
                pegs[i].asset = img_peg;
            }
        }
    }

    //Do all the ball checks
    let score = 0;
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        ball.velocity.y += 1;

        if (ball.overlaps(points1) || ball.overlaps(points5)) {
            score += 10;
        } else if (ball.overlaps(points2) || ball.overlaps(points4)) {
            score += 50;
        }  else if (ball.overlaps(points3)) {
            score += 100;
        }

        for (let j = 0; j < pegs.length; j++) {
            if (ball.collides(pegs[j])) {
                pegs[j].asset = img_peg2;
                pegs[j].life = 10;
            }
        }
    }


    //Put text at the top of screen
    $.colour.fill = "black";
    $.text.size = 64;
    $.text.font = font;
    $.text.print(300, 40, score.toString());
    $.text.size = 30;
    $.text.font = font;
	$.text.print(300, 90, "Press Space To Start!");

    $.drawColliders();
}