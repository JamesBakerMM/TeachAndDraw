import { $, shape, colour, mouse, keys, text } from "../../lib/Pen.js";

$.use(draw);

// $.debug=true;
//screen code
    $.w = 800;
    $.h = 800;

    const SCREENS = {
        SPLASH: 0,
        MENU: 1,
        GAME: 2,
        CREDITS: 3,
    };
    let currentScreen = SCREENS.SPLASH;
//end screen

//player code
//end player code

//edges
    let edges = $.makeGroup();

    // edges.push(makeEdge(0, $.h / 2));
    // edges.push(makeEdge($.w, $.h / 2));
//end edges

//buttons
    const BTN={
        home:$.makeButton($.w/2,$.h/2,100,60,"home"),
        toPlay:$.makeButton($.w/2,$.h/2,100,60,"play"),
        toCredits:$.makeButton($.w/2,$.h/2,100,60,"credits"),
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
        playerImg: $.loadImage(0, 0, "./images/fac0_refinery.png"),
        enemyImg: $.loadImage(0, 0, "./images/fac1_refinery.png"),
        bg: $.loadImage(0,0,"./images/bg.jpg"),
        bg_top: $.loadImage(0,$.h/2,"./images/bg.jpg"),
        bg_bottom: $.loadImage(0,$.h,"./images/bg.jpg"),
        shot:$.loadImage(0,0,"./images/fac0_wreckage1.png")
    };

    
    let player = makePlayer();

//end assets

const enemies = $.makeGroup();
const bullets = $.makeGroup();

function draw() {
    setup();

    //top row
    bgSpace($.w/2,$.h/2-assets.bg.h);
    bgSpace($.w/2-assets.bg.w,$.h/2-assets.bg.h);
    bgSpace($.w/2+assets.bg.w,$.h/2-assets.bg.h);
    
    //middle row
    bgSpace($.w/2,$.h/2);
    bgSpace($.w/2-assets.bg.w,$.h/2);
    bgSpace($.w/2+assets.bg.w,$.h/2);
    
    //bottom row
    bgSpace($.w/2,$.h/2+assets.bg.h);
    bgSpace($.w/2-assets.bg.w,$.h/2+assets.bg.h);
    bgSpace($.w/2+assets.bg.w,$.h/2+assets.bg.h);

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
    if ($.frameCount === 0) {
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
    text.print($.w / 2, $.h / 2, "Press a to start!");
    if (keys.howLongDown("any")>10) {
        currentScreen = SCREENS.MENU;
    }
}

function menuScreen() {
    colour.fill = "black";
    text.print($.w / 2, $.h / 2, "MENU");

    console.log("BTN.home "+BTN.home.clicked);
    console.log("BTN.toPlay "+BTN.toPlay.clicked);
    console.log("BTN.toCredits "+BTN.toCredits.clicked);

    if(BTN.toPlay.clicked){
        currentScreen=SCREENS.GAME;
    }

    if(BTN.toCredits.clicked){
        currentScreen=SCREENS.CREDITS;
    }

    BTN.toPlay.draw();
    BTN.toCredits.draw();

    BTN.toCredits.y=$.h/2+BTN.toCredits.h+20;
}

function bgSpace(x,y){
    assets.bg.x=x;
    assets.bg.y=y;
    assets.bg.draw();
}

function gameScreen() {
    if(BTN.home.clicked){
        currentScreen=SCREENS.MENU;
    }

    colour.fill="black";
    text.print(20,20,"TIMER WAVE"+ TIMERS.WAVE);

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
        let options=$.makeGroup(
            {
                x:100,
                y:-80,
                num:5,
                x_increment:140,
                y_increment:$.math.random(-10,70)
            },
            {
                x:100,
                y:-80,
                num:3,
                x_increment:295,
                y_increment:$.math.random(-10,70)
            },
            {
                x:100,
                y:-80,
                num:7,
                x_increment:100,
                y_increment:$.math.random(-10,70)
            }
        );
        const chosenOption=options.getRandomEntry();
        makeEnemyWave(chosenOption.x, chosenOption.y,chosenOption.num, chosenOption.x_increment,chosenOption.y_increment);
    }

    colour.fill = "black";

    controls();

    edgeEnforcement();
    
    //draw calls
    let randomX=$.math.random(-2,2);
    let randomY=$.math.random(-2,2);
    for (let enemy of enemies) {
        enemyEdgeEnforcement(enemy,randomX,randomY);
        for (let shot of player.shots) {
            if (shot.overlaps(enemy)) {
                shot.remove();
                enemy.remove();
            }
        }
    }

    for (let shot of player.shots) {
        const offset = 20;
        if (
            shot.x < 0 - offset ||
            shot.x > $.w + offset ||
            shot.y < 0 - offset ||
            shot.x > $.h + offset
        ) {
            shot.remove();
        }
        shot.draw();
        colour.stroke = "rgba(0,0,0,0)";
        shape.oval(shot.x, shot.y, shot.w * 0.3);
    }

    for (let edge of edges) {
        drawEdge(edge.x, edge.y, edge.w, edge.h);
    }

    chargedShot();
    hp();
    BTN.home.x=$.w-BTN.home.w;
    BTN.home.y=20+BTN.home.h/2;
    BTN.home.draw();
    $.drawAllColliders();
}

function enemyEdgeEnforcement(enemy,randomX,randomY) {
    if (enemy.y > $.h || enemy.y < -150) {
        enemy.velocity.y = -enemy.velocity.y;
        enemy.velocity.x = randomX;
    }
    if (enemy.x > $.h || enemy.x < 0) {
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

    const isAtRightEdge = player.x > $.w - 10;
    if (isAtRightEdge) {
        player.x = $.w - 10;
        const isGoingLeft = player.velocity.x > 0;
        if (isGoingLeft) {
            player.velocity.x -= 0.1;
        }
    }
}

function controls() {
    if (keys.down("a")) {
        player.velocity.x -= 0.1;
        player.x -= 1;
    }

    if (keys.down("d")) {
        player.velocity.x += 0.1; 
        player.x += 1;
    }

    if (keys.down("f")) {
        {
            if (player.charge < player.maxCharge) {
                player.charge++;
            }
        }
    }
    console.log('game',keys.down("f"))
    if (keys.up(" ") && keys.down("f")===false) {
        player.shots.push(makeShot(player.x, player.y - 100, player.charge));
        player.charge = 10;
    }
}

function hp() {
    const hpRectSize = player.hp;
    const barY = $.h - 40;
    colour.stroke = "rgba(0,0,0,0)";
    colour.fill = "red";
    shape.rectangle($.w / 2, barY, 200, 20);
    colour.fill = "green";
    shape.alignment.x="left";
    shape.rectangle($.w / 2-100, barY, hpRectSize, 20);
}

function background(col) {
    colour.fill = col;
    shape.rectangle($.w / 2, $.h / 2, $.w, $.h);
}

function chargedShot() {
    const x = 20;
    const y = $.w - 100;
    colour.fill = "orange";
    const chargeAngle=$.math.rescaleNumber(player.charge,0,100,0,360);
    const chargeSize=$.math.rescaleNumber(player.charge,0,100,5,25);
    shape.arc(x,y,chargeSize,chargeSize,0,chargeAngle);
}

function creditScreen() {
    if(BTN.home.clicked){
        currentScreen=SCREENS.MENU;
    }

    const credits=[
        "Ship Art - James",
        "Bg Art - Nasa"
    ];
    colour.fill = "white";
    text.size=40;
    text.print($.w / 2, $.h / 2 - 300, "CREDITS");
    text.size=26;

    text.alignment.x="left";
    for(let i=0; i<credits.length; i++){
        const increment=i*(text.size+10)+40;
        text.print($.w/2-100,$.h / 2 - 270+increment,credits[i]);
    }
    
    BTN.home.x=$.w-BTN.home.w;
    BTN.home.y=20+BTN.home.h/2;
    BTN.home.draw();
}

function makeEnemy(x, y) {
    let newEnemy = $.makeBoxCollider(x, y, 64, 95);
    newEnemy.asset=assets.enemyImg;
    newEnemy.rotation=180;
    newEnemy.direction=180;
    newEnemy.friction=0;
    newEnemy.speed = 8;
    return newEnemy;
}

function makeShot(x, y, charge) {
    //if multishot use charge for how many

    //if burst use charge for how long

    //if default use charge for size
    let tempShot = $.makeBoxCollider(x, y, charge, charge);
    // tempShot.attachement=assets.shot;
    tempShot.charge = charge;
    tempShot.direction=0;
    tempShot.friction=0;
    tempShot.speed=10;

    return tempShot;
}

function makePlayer(){
    let tempPlayer=$.makeBoxCollider($.w / 2, $.h - 100, 64, 95);

    tempPlayer.charge = 10;
    tempPlayer.maxCharge = 100;
    tempPlayer.shots = $.makeGroup();
    
    tempPlayer.hp = 200;
    tempPlayer.asset = assets.playerImg;
    
    window.player = tempPlayer;
    return tempPlayer;
} 

function makeEdge(x, y) {
    let tempEdge = $.makeBoxCollider(x, y, 30, $.h);
    return tempEdge;
}