import {
    tad,
    make,
    load,
    shape,
    mouse,
    keys,
    text,
} from "../../lib/TeachAndDraw.js";

tad.use(update);
tad.debug = true;

//Make the groups
let walls = make.group();
let pegs = make.group();
let balls = make.group();

//load all the images
let img_peg = tad.load.image(0, 0, "./images/peg.png");
let img_peg2 = tad.load.image(0, 0, "./images/peg2.png");
let img_ball = tad.load.image(0, 0, "./images/ball.png");
let img_wall = tad.load.image(0, 0, "./images/bucket_wall.png");
let img_wall_side = tad.load.image(0, 0, "./images/side_wall.png");
let img_floor = tad.load.image(0, 0, "./images/bucket_floor.png");

let img_10 = tad.load.image(0, 0, "./images/points_10.png");
let img_50 = tad.load.image(0, 0, "./images/points_50.png");
let img_100 = tad.load.image(0, 0, "./images/points_100.png");

//load the text font
const font = tad.load.font("../../fonts/ComicMono.ttf");

//make the walls and floor
let left_Wall = make.boxCollider(0, 400, 40, 800);
left_Wall.static = true;
left_Wall.image = img_wall_side;
walls.push(left_Wall);

let right_Wall = make.boxCollider(600, 400, 40, 800);
right_Wall.static = true;
right_Wall.image = img_wall_side;
walls.push(right_Wall);

let floor = make.boxCollider(300, 800, 600, 40);
floor.static = true;
floor.image = img_floor;
walls.push(floor);

// make the buckets at the bottom
let size = 118;
for (let i = size; i <= 500; i += size) {
    let bucket_Wall = make.boxCollider(i, 740, 20, 80);
    bucket_Wall.static = true;
    bucket_Wall.image = img_wall;
    walls.push(bucket_Wall);
}

//make all the pegs
let row = true;
for (let i = 150; i <= 650; i += 90) {
    let offset = 0;
    row = !row;
    if (row) offset = 40;

    for (let j = 30 + offset; j + offset <= 570; j += 90) {
        let peg = make.circleCollider(j, i, 20, 80);
        peg.static = true;
        peg.image = img_peg;
        pegs.push(peg);
    }
}

//make the points boxes in the buckets
let points1 = make.boxCollider(size / 2, 750, size, size);
points1.static = true;
points1.image = img_10;

let points2 = make.boxCollider(size / 2 + size, 750, size, size);
points2.static = true;
points2.image = img_50;

let points3 = make.boxCollider(size / 2 + size * 2, 750, size, size);
points3.static = true;
points3.image = img_100;

let points4 = make.boxCollider(size / 2 + size * 3, 750, size, size);
points4.static = true;
points4.image = img_50;

let points5 = make.boxCollider(size / 2 + size * 4, 750, size, size);
points5.static = true;
points5.image = img_10;

let keydown = false;
function update() {
    //Set screen size
    tad.w = 600;
    tad.h = 800;

    //do background colour
    shape.colour = "rgba(245,245,255)";
    shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);

    //Spawn balls if spacebar is pressed
    if (keys.down(" ") && !keydown) {
        keydown = true;
        let x = 20 + Math.random() * 560;
        let ball = make.circleCollider(x, 20, 40, 40);
        ball.image = img_ball;
        ball.mass = 1;
        ball.bounciness = 100;
        ball.friction = 2;
        balls.push(ball);
    } else if (!keys.down(" ")) {
        keydown = false;
    }

    //Collide with the walls and other balls
    balls.collides(balls);
    balls.collides(walls);

    //Countdown to reset peg image after it has been hit
    for (let i = 0; i < pegs.length; i++) {
        const peg = pegs[i];
        if (peg.life !== null) {
            peg.life -= 1;
            if (peg.life == 0) {
                peg.life = null;
                pegs[i].image = img_peg;
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
        } else if (ball.overlaps(points3)) {
            score += 100;
        }

        for (let j = 0; j < pegs.length; j++) {
            if (ball.collides(pegs[j])) {
                pegs[j].image = img_peg2;
                pegs[j].life = 10;
            }
        }
    }

    //Put text at the top of screen
    text.colour = "black";
    text.size = 64;
    text.font = font;
    text.print(300, 40, score.toString());
    text.size = 30;
    text.font = font;
    text.print(300, 90, "Press Space To Start!");

    tad.drawColliders();
}
