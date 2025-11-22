import { tad, load, shape, make, keys, text } from "../../lib/TeachAndDraw.js";

tad.use(update);
// tad.debug = true;

//Make the groups
const walls = make.group();
walls.name = "walls";
const pegs = make.group();
pegs.name = "pegs";
const pins = make.group();
pins.name = "pins";
const balls = make.group();
balls.name = "balls";

//load all the images
const img_peg = load.image(0, 0, "./images/peg.png");
const img_peg2 = load.image(0, 0, "./images/peg2.png");
const img_pin = load.image(0, 0, "./images/pin.png");
const img_pin2 = load.image(0, 0, "./images/pin2.png");
const img_ball = load.image(0, 0, "./images/ball.png");
const img_wall = load.image(0, 0, "./images/bucket_wall.png");
const img_wall_side = load.image(0, 0, "./images/side_wall.png");
const img_wall_thin = load.image(0, 0, "./images/side_wall_thin.png");
const img_floor = load.image(0, 0, "./images/bucket_floor.png");
const img_arrows = load.image(0, 0, "./images/arrows.png");
const img_flipperL = load.image(0, 0, "./images/flipperL.png");
const img_flipperR = load.image(0, 0, "./images/flipperR.png");
const img_background = load.image(0, 0, "./images/background.png");
const img_sweeper = load.image(0, 0, "./images/sweeper.png");

//load the text font
const font = load.font("Comic Mono", "../../fonts/ComicMono.ttf");

let arrows = make_static_asset_box(460, 700, 40, 220, img_arrows);

//walls

//left wall
walls.push(make_static_asset_box(0, 400, 40, 800, img_wall_side));
//right wall
walls.push(make_static_asset_box(500, 400, 40, 800, img_wall_side));
//right wall thing
walls.push(make_static_asset_box(430, 600, 20, 800, img_wall_thin));

walls.push(make_sweeper(100, 410, -10));
walls.push(make_sweeper(340, 330, 10));

let floor = make_static_asset_box(300, 800, 600, 40, img_floor);
walls.push(floor);

//ceiling
walls.push(make_static_asset_box(300, 0, 600, 40, img_floor));

//curved box at top
walls.push(make_curve_box(25, 110, 22.5));
walls.push(make_curve_box(60, 60, 45));
walls.push(make_curve_box(110, 25, 67.5));
walls.push(make_curve_box(475, 110, -22.5));
walls.push(make_curve_box(440, 60, -45));
walls.push(make_curve_box(390, 25, -67.5));

//right slides
walls.push(make_slide(405, 650, 40));
walls.push(make_slide(350, 550, 0));

//left slides
walls.push(make_slide(35, 650, -40));
walls.push(make_slide(90, 550, 0));

//make pegs
pegs.push(make_peg(350, 500));
pegs.push(make_peg(350, 600));
pegs.push(make_peg(90, 500));
pegs.push(make_peg(90, 600));
pegs.push(make_peg(125, 50));
pegs.push(make_peg(75, 80));
pegs.push(make_peg(45, 130));
pegs.push(make_peg(430, 190));

//make pins
pins.push(make_pin(225, 100));
pins.push(make_pin(125, 200));
pins.push(make_pin(325, 200));
pins.push(make_pin(125, 300));

let flipper_left = tad.make.boxCollider(50, 680, 280, 30);
flipper_left.static = true;
flipper_left.rotation = 20;
flipper_left.friction = 0;
flipper_left.asset = img_flipperL;

let flipper_right = make.boxCollider(390, 680, 280, 30);
flipper_right.static = true;
flipper_right.rotation = -20;
flipper_right.friction = 0;
flipper_right.asset = img_flipperR;

//Setup the ball
let ball = make.circleCollider(450, 700, 35, 35);
ball.asset = img_ball;
balls.push(ball);

//Control variables
const maxBallSpeed = 100;
const flipperSpeed = 50;

let score = 0;
let showScore = false;

let moveFlipperUp = false;

let respawning = 0;
let respawnTime = 60;

tad.w = 500;
tad.h = 800;
function update() {
    img_background.draw();
    shape.colour = "rgba(245,245,255)";
    shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);

    if (respawning > 0) {
        respawning -= 1;
        if (respawning === 0) {
            score = 0;
            ball.x = 450;
            ball.y = 700;
            ball.velocity.x = 0;
            ball.velocity.y = 0;
        } else {
            ball.x = -100;
            ball.y = -100;
            ball.velocity.x = 0;
            ball.velocity.y = 0;
        }
    } else {
        if (ball.x <= 0 || ball.x >= 500) {
            respawning = respawnTime;
        }
        if (ball.y <= 0 || ball.y >= 800) {
            respawning = respawnTime;
        }
    }


    if (ball.overlaps(arrows)) {
        if (keys.down(" ")) {
            showScore = true;
            ball.velocity.y -= 20;
        }
    } else {
        if (ball.collides(floor)) {
            respawning = respawnTime;
        }

        const hitLeft = ball.collides(flipper_left);
        const hitRight = ball.collides(flipper_right);
        if (keys.down(" ") && (hitLeft || hitRight)) {
            ball.velocity.y = Math.abs(ball.velocity.y) * -1.3;
        }
    }

    if (showScore) {
        text.colour = "black";
        text.size = 64;
        text.font = font;
        text.print(220, 760, score.toString());
    } else {
        text.colour = "black";
        text.size = 30;
        text.font = font;
        text.print(225, 760, "Press Space To Start!");
    }

    if (moveFlipperUp) {
        let angle = flipper_right.rotation;
        if (angle > 180) {
            angle -= 360;
        }
        if (angle > 45) {
            flipper_right.rotation = 45;
            flipper_left.rotation = -45;
            flipper_left.rotationalVelocity = flipperSpeed;
            flipper_right.rotationalVelocity = -flipperSpeed;
            moveFlipperUp = false;
        }
    }

    if (!moveFlipperUp) {
        let angle = flipper_right.rotation;
        if (angle > 180) {
            angle -= 360;
        }
        if (angle < -20) {
            flipper_right.rotation = -20;
            flipper_left.rotation = 20;
            flipper_left.rotationalVelocity = 0;
            flipper_right.rotationalVelocity = 0;
        }
    }

    if (keys.down(" ") && !moveFlipperUp) {
        flipper_left.rotationalVelocity = -flipperSpeed;
        flipper_right.rotationalVelocity = flipperSpeed;
        moveFlipperUp = true;
    }

    balls.collides(walls);

    for (let i = 0; i < pegs.length; i++) {
        const peg = pegs[i];
        if (peg.life !== null) {
            peg.life -= 1;
            if (peg.life == 0) {
                peg.life = null;
                pegs[i].asset = img_peg;
            }
        }
    }

    for (let i = 0; i < pins.length; i++) {
        const pin = pins[i];
        if (pin.life !== null) {
            pin.life -= 1;
            if (pin.life == 0) {
                pin.life = null;
                pins[i].asset = img_pin;
            }
        }
    }

    ball.velocity.y += 1;

    for (let j = 0; j < pegs.length; j++) {
        if (ball.collides(pegs[j])) {
            pegs[j].asset = img_peg2;
            pegs[j].life = 10;
            score += 10;
        }
    }

    for (let j = 0; j < pins.length; j++) {
        if (ball.collides(pins[j])) {
            pins[j].asset = img_pin2;
            pins[j].life = 10;
            score += 25;
        }
    }

    let length = ball.speed;
    if (length > maxBallSpeed) {
        ball.velocity.x = (ball.velocity.x / length) * maxBallSpeed;
        ball.velocity.y = (ball.velocity.y / length) * maxBallSpeed;
    }

    tad.drawColliders();
}

function make_static_asset_box(x, y, w, h, asset) {
    const staticAssetBox = make.boxCollider(x, y, w, h);
    staticAssetBox.static = true;
    staticAssetBox.asset = asset;
    return staticAssetBox;
}

function make_peg(x, y) {
    const peg = make.circleCollider(x, y, 30, 30);
    peg.static = true;
    peg.asset = img_peg;
    return peg;
}

function make_pin(x, y) {
    const pin = make.circleCollider(x, y, 50, 50);
    pin.static = true;
    pin.asset = img_pin;
    return pin;
}

function make_curve_box(x, y, rotation) {
    const curveBox = make.circleCollider(x, y, 20, 80);
    curveBox.rotation = rotation;
    curveBox.static = true;
    curveBox.asset = img_wall;
    return curveBox;
}

function make_sweeper(x, y, rotationalVelocity) {
    const sweeper = make.boxCollider(x, y, 150, 16);
    sweeper.asset = img_sweeper;
    sweeper.static = true;
    sweeper.friction = 0;
    sweeper.rotationalVelocity = rotationalVelocity;
    return sweeper;
}

function make_slide(x, y, rotation) {
    const slide = make.boxCollider(x, y, 20, 80);
    slide.static = true;
    slide.asset = img_wall;
    slide.rotation = rotation;
    return slide;
}