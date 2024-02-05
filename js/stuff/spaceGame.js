import { $ as p, shape, colour, mouse, kb, text } from "../../lib/Pen.js";
import { Group } from "../../lib/Group.js";

p.start(draw);

p.debug=true;
//screen code
    p.w = 800;
    p.h = 800;

    const SCREENS = {
        SPLASH: 0,
        MENU: 1,
        GAME: 2,
        CREDITS: 3,
    };
    let currentScreen = SCREENS.SPLASH;
//end screen

//player code
    let player = makePlayer();
//end player code

//edges
    let edges = new Group();

    edges.push(makeEdge(0, p.h / 2));
    edges.push(makeEdge(p.w, p.h / 2));
//end edges

//buttons
    const BTN={
        home:p.makeButton(p.w/2,p.h/2,100,60,"home"),
        toPlay:p.makeButton(p.w/2,p.h/2,100,60,"play"),
        toCredits:p.makeButton(p.w/2,p.h/2,100,60,"credits"),
    }

    BTN.home.onClick=()=>{
        currentScreen=SCREENS.MENU;
    }

    BTN.toPlay.onClick=()=>{
        currentScreen=SCREENS.GAME;
    }

    BTN.toCredits.onClick=()=>{
        currentScreen=SCREENS.CREDITS;
    }
//end buttons

const TIMERS={
    WAVE:-1
};

const COUNTERS={
    WAVES:4,
    MIN_ENEMIES:2,
    BOSSES:1
};

//assets
    let assets = {
        enemyImg: p.loadImage(0, 0, "./images/fac0_refinery.png"),
        bg: p.loadImage(0,0,"./images/bg.png"),
        bg_top: p.loadImage(0,p.h/2,"./images/bg.png"),
        bg_bottom: p.loadImage(0,p.h,"./images/bg.png"),
        shot:p.loadImage(0,0,"./images/fac0_wreckage1.png")
    };

    assets.enemyImg.rotation = 90;
//end assets

let enemies = new Group();

function draw() {
    setup();

    //top row
    bgSpace(p.w/2,p.h/2-assets.bg.h);
    bgSpace(p.w/2-assets.bg.w,p.h/2-assets.bg.h);
    bgSpace(p.w/2+assets.bg.w,p.h/2-assets.bg.h);
    
    //middle row
    bgSpace(p.w/2,p.h/2);
    bgSpace(p.w/2-assets.bg.w,p.h/2);
    bgSpace(p.w/2+assets.bg.w,p.h/2);
    
    //bottom row
    bgSpace(p.w/2,p.h/2+assets.bg.h);
    bgSpace(p.w/2-assets.bg.w,p.h/2+assets.bg.h);
    bgSpace(p.w/2+assets.bg.w,p.h/2+assets.bg.h);

    switch (currentScreen) {
        case SCREENS.SPLASH:
            splashScreen();
            break;
        case SCREENS.MENU:
            menuScreen();
            break;
        case SCREENS.GAME:
            gameScreen();
            break;
        case SCREENS.CREDITS:
            creditScreen();
            break;
    }
}

function setup() {
    if (p.frameCount === 0) {
        makeEnemyWave(100, -50, 3, 295);
    }
}

function drawEdge(x, y, w, h) {
    colour.stroke = "rgba(0,0,0,0)";
    colour.fill = "rgba(0,155,255,0.5)";
    shape.rectangle(x, y, w, h + 20);
}

function makeEnemyWave(x, y, amount = 5, x_increment = 100, y_increment=10) {
    for (let i = 0; i < amount; i++) {
        enemies.push(makeEnemy(x + i * x_increment, y + i*y_increment));
    }
}

function splashScreen() {
    colour.fill = "white";
    text.draw(p.w / 2, p.h / 2, "Press a to start!");
    if (kb.pressed("a")) {
        currentScreen = SCREENS.MENU;
    }
}

function menuScreen() {
    colour.fill = "black";
    text.draw(p.w / 2, p.h / 2, "MENU");
    BTN.toPlay.draw();
    BTN.toCredits.draw();
    BTN.toCredits.y=p.h/2+BTN.toCredits.h+20;
}

function bgSpace(x,y){
    assets.bg.x=x;
    assets.bg.y=y;
    assets.bg.draw();
}

function gameScreen() {
    colour.fill="black";
    text.draw(20,20,"TIMER WAVE"+ TIMERS.WAVE);

    if(TIMERS.WAVE>0){
        TIMERS.WAVE--
    }

    if(COUNTERS.WAVES===0){
        COUNTERS.WAVES--
        //spawn the boss
        makeEnemyWave(100, -80, 3, 295);
        makeEnemyWave(100, -30, 3, 295);
        makeEnemyWave(100, 0, 3, 295);

    }

    if(enemies.length <= COUNTERS.MIN_ENEMIES){
        COUNTERS.WAVES--
        let options=new Group(
            {
                x:100,
                y:-80,
                num:5,
                x_increment:140,
                y_increment:p.math.random(-10,70)
            },
            {
                x:100,
                y:-80,
                num:3,
                x_increment:295,
                y_increment:p.math.random(-10,70)
            },
            {
                x:100,
                y:-80,
                num:7,
                x_increment:100,
                y_increment:p.math.random(-10,70)
            }
        );
        const chosenOption=options.getRandomEntry();
        makeEnemyWave(chosenOption.x, chosenOption.y,chosenOption.num, chosenOption.x_increment,chosenOption.y_increment);
    }

    colour.fill = "black";

    controls();

    edgeEnforcement();
    
    //draw calls
    let randomX=p.math.random(-2,2);
    let randomY=p.math.random(-2,2);
    for (let enemy of enemies) {
        enemyEdgeEnforcement(enemy,randomX,randomY);
        for (let shot of player.shots) {
            if (shot.overlaps(enemy)) {
                shot.remove = true;
                enemy.remove = true;
            }
        }
    }

    for (let shot of player.shots) {
        const offset = 20;
        if (
            shot.x < 0 - offset ||
            shot.x > p.w + offset ||
            shot.y < 0 - offset ||
            shot.x > p.h + offset
        ) {
            shot.remove = true;
        }
        shot.draw();
        colour.stroke = "rgba(0,0,0,0)";
        shape.oval(shot.x, shot.y, shot.w * 0.3);
    }

    for (let edge of edges) {
        drawEdge(edge.x, edge.y, edge.w, edge.h);
    }
    enemies.draw();
    edges.draw();
    player.draw();

    chargedShot();
    hp();
    BTN.home.x=p.w-BTN.home.w;
    BTN.home.y=20+BTN.home.h/2;
    BTN.home.draw();
}

function enemyEdgeEnforcement(enemy,randomX,randomY) {
    if (enemy.y > p.h || enemy.y < -150) {
        enemy.velocity.y = -enemy.velocity.y;
        enemy.velocity.x = randomX;
    }
    if (enemy.x > p.h || enemy.x < 0) {
        enemy.velocity.x = -enemy.velocity.x;
        enemy.velocity.y = randomY;
    }
}

function edgeEnforcement() {
    const isAtLeftEdge = player.x < 10;
    if (isAtLeftEdge) {
        player.x = 10;
        const isGoingRight = player.velocity.x < 0;
        if (isGoingRight) {
            player.velocity.x += 0.1;
        }
    }

    const isAtRightEdge = player.x > p.w - 10;
    if (isAtRightEdge) {
        player.x = p.w - 10;
        const isGoingLeft = player.velocity.x > 0;
        if (isGoingLeft) {
            player.velocity.x -= 0.1;
        }
    }
}

function controls() {
    if (kb.down("a")) {
        player.velocity.x -= 0.1;
        player.x -= 1;
    }

    if (kb.down("d")) {
        player.velocity.x += 0.1;
        player.x += 1;
    }

    if (kb.down(" ") || kb.down("f")) {
        {
            if (player.charge < player.maxCharge) {
                player.charge++;
            }
        }
    }

    if (kb.pressed(" ") || kb.pressed("f")) {
        player.shots.push(makeShot(player.x, player.y - 100, player.charge));
        player.charge = 10;
    }
}

function hp() {
    const hpRectSize = player.hp;
    const barY = p.h - 40;
    colour.stroke = "rgba(0,0,0,0)";
    colour.fill = "red";
    shape.rectangle(p.w / 2, barY, 200, 20);
    colour.fill = "green";
    shape.xAlignment="left";
    shape.rectangle(p.w / 2-100, barY, hpRectSize, 20);
}

function background(col) {
    colour.fill = col;
    shape.rectangle(p.w / 2, p.h / 2, p.w, p.h);
}

function chargedShot() {
    const x = 20;
    const y = p.w - 100;
    shape.colour.fill = "orange";
    const chargeAngle=p.math.rescaleNumber(player.charge,0,100,0,360);
    const chargeSize=p.math.rescaleNumber(player.charge,0,100,5,25);
    shape.arc(x,y,chargeSize,chargeSize,0,chargeAngle);
}

function creditScreen() {
    const credits=[
        "Ship Art - James",
        "Bg Art - Nasa"
    ];
    colour.fill = "white";
    text.size=40;
    text.draw(p.w / 2, p.h / 2 - 300, "CREDITS");
    text.size=26;

    text.alignment="left";
    for(let i=0; i<credits.length; i++){
        const increment=i*(text.size+10)+40;
        text.draw(p.w/2-100,p.h / 2 - 270+increment,credits[i]);
    }
    
    BTN.home.x=p.w-BTN.home.w;
    BTN.home.y=20+BTN.home.h/2;
    BTN.home.draw();
}

function makeEnemy(x, y) {
    let newEnemy = p.makeBoxCollider(x, y, 64, 95);
    newEnemy.attachement=assets.enemyImg;
    newEnemy.velocity.y = 2;
    return newEnemy;
}

function makeShot(x, y, charge) {
    let tempShot = p.makeBoxCollider(x, y, charge, charge);
    tempShot.attachement=assets.shot;
    tempShot.charge = charge;
    tempShot.velocity.y = -5;

    return tempShot;
}


function makePlayer(){
    let tempPlayer=p.makeBoxCollider(p.w / 2, p.h - 100, 64, 95);

    tempPlayer.charge = 10;
    tempPlayer.maxCharge = 100;
    tempPlayer.shots = new Group();
    
    tempPlayer.hp = 200;
    tempPlayer.attachement = p.loadImage(0, 0, "./images/fac1_refinery.png");
    tempPlayer.attachement.rotation = 270;
    
    window.player = tempPlayer;
    return tempPlayer;
} 

function makeEdge(x, y) {
    let tempEdge = p.makeBoxCollider(x, y, 30, p.h);
    return tempEdge;
}