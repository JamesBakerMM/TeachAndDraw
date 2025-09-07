import {
    tad,
    shape,
    camera,
    time,
    text,
    make,
    keys,
} from "../../lib/TeachAndDraw.js";

function mix(x, y, a) {
    return (1 - a) * x + a * y;
}

const state = {
    targetX: tad.w / 2,
    targetY: tad.h / 2,
    targetRot: 0,
    targetZoom: 1,

    statefn: gameEntry,
    transition: (fn) => {
        state.statefn = fn;
    },

    update: () => {
        shape.movedByCamera = true;
        camera.zoomTo(state.targetZoom);
        camera.rotateTo(state.targetRot, 0.05);
        camera.moveTo(state.targetX, state.targetY, 0.01);
        state.statefn();
    },
};

tad.use(state.update);

// Menu
const startButton = make.button(tad.w / 2, tad.h / 2, 125, 35, "Play");
startButton.rotation = 90;

let gameOverTimer = 0;
let gameOverMsg = "";

function gameEntry() {
    state.targetRot = 90;
    state.targetZoom = 2;
    camera.moveTo(state.targetX, state.targetY, 1.0);
    camera.rotation = state.targetRot;
    camera.zoom = state.targetZoom;
    state.transition(menuLoop);
}

function menuLoop() {
    state.targetY = tad.h / 2;
    state.targetRot = mix(state.targetRot, 90, 0.06);
    state.targetZoom = mix(state.targetZoom, 2, 0.06);
    text.movedByCamera = true;
    text.rotation = 90;
    text.colour = "white";
    text.print(tad.w / 2 + 75, tad.h / 2, "PONG");
    if (gameOverMsg != "") {
        startButton.label = "Play Again";
        text.colour = ball.colour;
        text.print(tad.w / 2 + 50, tad.h / 2, gameOverMsg);
    }
    startButton.draw();
    if (startButton.down) {
        state.transition(gameInit);
    }
    collisionsGroup.draw();
    leftLose.draw();
    rightLose.draw();
}
// --------------------------------------------------------------------

// Game
// --------------------------------------------------------------------
const playerWidth = 10;
let ball = make.circleCollider(tad.w / 2, tad.h / 2, 10);
ball.friction = 0;
const wallScale = 0.8;
const wallTop = 0 + 0.5 * (1 - wallScale) * tad.h;
const wallBot = tad.h - 1 - 0.5 * (1 - wallScale) * tad.h;
const wallLeft = 0 + 0.5 * (1 - wallScale) * tad.w;
const wallRight = tad.w - 1 - 0.5 * (1 - wallScale) * tad.w;
let leftPlayer = make.boxCollider(wallLeft + 25, 255, playerWidth, 100);
leftPlayer.colour = "blue";
let leftLose = make.boxCollider(wallLeft, tad.h / 2, 15, wallScale * tad.h);
leftLose.static = true;
let rightPlayer = make.boxCollider(wallRight - 25, 255, playerWidth, 100);
rightPlayer.colour = "red";
let rightLose = make.boxCollider(wallRight, tad.h / 2, 15, wallScale * tad.h);
rightLose.static = true;

let collisionsGroup = make.group(
    leftPlayer,
    rightPlayer,
    make.boxCollider(tad.w / 2, wallTop, wallScale * tad.w, 15),
    make.boxCollider(tad.w / 2, wallBot, wallScale * tad.w, 15)
);

for (let element of collisionsGroup) {
    element.static = true;
}

function gameInit() {
    ball.x = tad.w / 2;
    ball.y = tad.h / 2;
    ball.velocity.x = Math.random() < 0.5 ? -16 : +16;
    ball.velocity.y = 32 * Math.random() - 16;
    if (ball.velocity.x < 0) {
        ball.colour = rightPlayer.colour;
    } else {
        ball.colour = leftPlayer.colour;
    }
    state.transition(gameLoop);
}

function gameLoop() {
    state.targetY = 0.5 * (leftPlayer.y + rightPlayer.y);
    state.targetRot = mix(
        state.targetRot,
        0.025 * (leftPlayer.y - rightPlayer.y),
        0.1
    );
    state.targetZoom = mix(state.targetZoom, 1.0, 0.1);
    updateInput();
    ball.collides(collisionsGroup);
    leftPlayer.collides(collisionsGroup);
    if (ball.collides(leftPlayer)) {
        ball.colour = leftPlayer.colour;
        ball.velocity.x += 5;
        state.targetZoom = 1.2;
    } else if (ball.collides(rightPlayer)) {
        ball.colour = rightPlayer.colour;
        ball.velocity.x -= 5;
        state.targetZoom = 1.2;
    }

    // Collisions
    // ------------------------------------------
    if (ball.collides(leftLose)) {
        gameOver("Red Wins!");
    } else if (ball.collides(rightLose)) {
        gameOver("Blue Wins!");
    }
    collisionsGroup.draw();
    leftLose.draw();
    rightLose.draw();
    ball.draw();
}

function gameOver(msg) {
    gameOverTimer = 2000;
    gameOverMsg = msg;
    ball.x = tad.w / 2;
    ball.y = tad.h / 2;
    ball.velocity.x = 0;
    ball.velocity.y = 0;
    state.transition(menuLoop);
}
// --------------------------------------------------------------------

function updateInput() {
    const speed = 0.25 * time.msElapsed;
    if (keys.down("w") && leftPlayer.y - leftPlayer.h / 2 > wallTop) {
        leftPlayer.y -= speed;
    }
    if (keys.down("s") && leftPlayer.y + leftPlayer.h / 2 < wallBot) {
        leftPlayer.y += speed;
    }
    if (keys.down("upArrow") && rightPlayer.y - rightPlayer.h / 2 > wallTop) {
        rightPlayer.y -= speed;
    }
    if (keys.down("downArrow") && rightPlayer.y + rightPlayer.h / 2 < wallBot) {
        rightPlayer.y += speed;
    }
}
