import { $ } from "../../lib/TeachAndDraw.js";

$.use(update);

//$.debug = true;

$.width = 2000;
$.height = 1200;

const pathGroup = $.makeGroup(
    {x:1574, y:949, width:52, height:100},
    {x:1374, y:949, width:350, height:100},
    {x:1249, y:749, width:100, height:300},
    {x:1399, y:649, width:200, height:100},
    {x:1449, y:399, width:100, height:400},
    {x:1249, y:249, width:300, height:100},
    {x:1149, y:399, width:100, height:200},
    {x:999, y:449, width:200, height:100},
    {x:949, y:623, width:100, height:250},
    {x:999, y:699, width:200, height:100},
    {x:1049, y:874, width:100, height:250},
    {x:849, y:949, width:300, height:100},
    {x:749, y:549, width:100, height:700},
    {x:599, y:249, width:200, height:100},
    {x:549, y:499, width:100, height:500},
    {x:474, y:699, width:50, height:100},
    {x:424, y:699, width:50, height:100},
);

const enemyGroup = $.makeGroup()
const turretGroup = $.makeGroup();
const bulletGroup = $.makeGroup();

let currentLife = 200;
let waves = [
    {wave: 20},
    {wave: 40},
    {wave: 70},
    {wave: 90},
    {wave: 120},
];
let currentWave = 0;
let spawnEmemies = true;
let gameStart = false;
let startWave = false;
let currentPoints = 540;
let currentHeldTurret = {name: "", colour: "", size: 0, cost: 0, damage: 0, speed: 0, attackRangeCircleSize: 0, attackAngleLead: 0, shotDelay: 0};
let lastEnemySpawnFrame = 0;
let currentCreatedEnemies = 0;
let seeRange = false;

//where all the drawing happens
function update(){
    makeGameSpace();
    if($.keys.released(" ")){
        if(startWave === false){
            startWave = true;
        }
    }
}

//make the game space
function makeGameSpace(){
    if(gameStart === true){
        if(currentLife > 0){
            drawActiveGame();
        }else{
            drawLostGame();
        }
    }else{
        startGame();
    }
}

//screen before the game starts
function startGame(){
    $.colour.fill= "#052a5e";
    $.colour.stroke = "rgba(1,1,1,0)";
    $.shape.rectangle($.width/2, $.height/2, 1200, 1000);

    $.text.size = 80;
    $.colour.fill= "#1abaeb";
    $.text.bold = true;
    $.text.print($.width/2,$.height/2 - 100,"Click anywhere to start");

    if($.mouse.leftDown === true){
        gameStart = true;
    }
}

//draw the active game
function drawActiveGame(){
    //make background
    $.colour.fill= "#076066";
    $.colour.stroke = "rgba(1,1,1,0)";
    $.shape.rectangle($.width/2, $.height/2, 1200, 1000);

    makePath();

    if(startWave === true){
        startSpawningEnemies();
        makeEnemies()
        enemyGroup.draw();
    }else{
        pressSpacebar();
    }

    if(currentCreatedEnemies === waves[currentWave].wave && enemyGroup.length === 0){
        currentWave++;
        currentCreatedEnemies = 0;
        startWave = false;
    }

    $.text.size = 30;
    $.colour.fill= "#00c8f5";
    $.text.print(1690,125,"Current Life:");
    $.colour.fill= "#00ff15";
    $.text.print(1634,160,currentLife);

    $.text.size = 30;
    $.colour.fill= "#00c8f5";
    $.text.print(1707,225,"Current Points:");
    $.colour.fill= "#ded600";
    $.text.print(1634,255,currentPoints);

    if(currentHeldTurret.name !== ""){
        if($.mouse.leftUp === true){
            if(whereTurretCanPlace() === true && currentHeldTurret.cost <= currentPoints){
                turretGroup.push(placeTurret());
                currentHeldTurret = {name: "", colour: "", bulletSize: 0, cost: 0, damage: 0, speed: 0, attackRangeCircleSize: 0, attackAngleLead: 0, shotDelay: 0};
            }
        }
        if($.mouse.rightUp === true){
            currentHeldTurret = {name: "", colour: "", bulletSize: 0, cost: 0, damage: 0, speed: 0, attackRangeCircleSize: 0, attackAngleLead: 0, shotDelay: 0};
        }
        holdingTurret();
    }

    makeTurretSelection();

    for (let turret of turretGroup) {
        turret.draw();
        //draw the attackRangeCircle of the turrets, can be made visible or invisible
        if(seeRange === true){
            turret.attackRangeCircle.fill="rgba(0, 77, 4,0.25)";
        }else{
            turret.attackRangeCircle.fill="rgba(0, 77, 4,0)";
        }
        //draw the attack range circle
        turret.attackRangeCircle.draw();

        //shoot at enemies
        for(let enemy of enemyGroup){
            if(turret.attackRangeCircle.collides(enemy)){
                turretShoot(turret, enemy);
            }
        }
    }

    for (let bullet of bulletGroup) {
        if($.frameCount > bullet.spawned + 200){
            removeBullet(bullet);
        }else{
            bullet.draw();

            for(let enemy of enemyGroup){
                if(bullet.collides(enemy)){
                    bulletHit(bullet, enemy);
                }
            }
        }
    }
}

//press spacebar to start the wave
function pressSpacebar(){
    $.text.size = 40;
    $.colour.fill= "#00c8f5";
    $.text.print($.width/2,85,"Press spacebar to spawn the enemy wave");
}

//spawn enemies
function startSpawningEnemies(){
    if($.frameCount > lastEnemySpawnFrame +100 && currentCreatedEnemies < waves[currentWave].wave && spawnEmemies === true){
        enemyGroup.push(makeEnemy())
        lastEnemySpawnFrame = $.frameCount;
        currentCreatedEnemies++;
    }

    if(enemyGroup.length === waves[currentWave].wave){
        spawnEmemies = false;
    }
}

//make the enemies
function makeEnemies(){
    for (let enemy of enemyGroup) {
        if(enemy.currentLife > 0){
            $.colour.fill= "#000000";
            moveEnemy(enemy)
            /*enemy.fullHealthbar = $.makeBoxCollider(enemy.x,enemy.y-30, enemy.maxLife/2, 10)
            enemy.fullHealthbar.fill = "#910110";
            enemy.fullHealthbar.draw();
            enemy.currentHealthbar = $.makeBoxCollider(enemy.x,enemy.y-30, enemy.currentLife/2, 10)
            enemy.currentHealthbar.fill = "#0afa16";
            enemy.currentHealthbar.draw();*/
        }else{
            currentPoints += enemy.points;
            enemy.remove();
        }
    }
}

//draw the lost game screen
function drawLostGame(){
    $.colour.fill= "red";
    $.colour.stroke = "rgba(1,1,1,0)";
    $.shape.rectangle($.width/2, $.height/2, 1200, 1000);

    $.text.size = 120;
    $.colour.fill= "black";
    $.text.bold = true;
    $.text.print($.width/2,$.height/2,"Game Over!");
}

//make the traversable path
function makePath(){
    for(let i = 0; i < pathGroup.length; i++){
        //fill for the base
        if(i === 0){
            $.colour.fill= "#7a0474";
        //fill for the enemy entrance
        }else if(i === pathGroup.length-1){
            $.colour.fill= "#000478";
        //fill for the path
        }else{
            $.colour.fill= "#454545";
        }
        $.shape.rectangle(pathGroup[i].x, pathGroup[i].y, pathGroup[i].width, pathGroup[i].height);
    }
}

//make the enemies
function makeEnemy(){
    let enemy = $.makeCircleCollider(380,699,30)
    enemy.fill = "red";
    enemy.static = true;
    enemy.maxLife = 100;
    enemy.currentLife = 100;
    enemy.points = 10;
    return enemy;
}

//enemy movement directions
function moveEnemy(enemy){
    enemy.speed=20;
    if(enemy.x === 380 && enemy.y === 699){
        enemy.direction = 90;
    }else if(enemy.x >547 && enemy.x <747 && enemy.y > 250){
        enemy.direction = 0;
    }else if(enemy.x >547 && enemy.x <747 && enemy.y < 400){
        enemy.direction = 90;
    }else if(enemy.x >600 && enemy.x <750 && enemy.y < 260){
        enemy.direction = 180;
    }else if(enemy.x >547 && enemy.x <755 && enemy.y > 948 && enemy.y < 980){
        enemy.direction = 90;
    }else if(enemy.x >1050 && enemy.x <1084 && enemy.y > 948 && enemy.y < 980){
        enemy.direction = 0;
    }else if(enemy.x >1050 && enemy.x <1084 && enemy.y > 650 && enemy.y < 700){
        enemy.direction = 270;
    }else if(enemy.x >900 && enemy.x <950 && enemy.y > 650 && enemy.y < 700){
        enemy.direction = 0;
    }else if(enemy.x >900 && enemy.x <950 && enemy.y > 400 && enemy.y < 450){
        enemy.direction = 90;
    }else if(enemy.x >1150 && enemy.x <1190 && enemy.y > 400 && enemy.y < 450){
        enemy.direction = 0;
    }else if(enemy.x >1150 && enemy.x <1190 && enemy.y > 200 && enemy.y < 250){
        enemy.direction = 90;
    }else if(enemy.x >1450 && enemy.x <1480 && enemy.y > 200 && enemy.y < 250){
        enemy.direction = 180;
    }else if(enemy.x >1450 && enemy.x <1480 && enemy.y > 650 && enemy.y < 700){
        enemy.direction = 270;
    }else if(enemy.x >1200 && enemy.x <1250 && enemy.y > 650 && enemy.y < 700){
        enemy.direction = 180;
    }else if(enemy.x >1200 && enemy.x <1250 && enemy.y > 948 && enemy.y < 980){
        enemy.direction = 90;
    //if the enemy makes it here, then they passed the base, and the player should lose life
    }else if(enemy.x >1600 && enemy.x <1650 && enemy.y > 948 && enemy.y < 980){
        enemy.remove();
        currentLife -= 10;
    }
}

//a player picking a turret
function makeTurretSelection(){
    turretSelectionIcons();

    if($.mouse.leftUp === true){
        if($.mouse.x < 1700 && $.mouse.x > 1653 && $.mouse.y < 400 && $.mouse.y > 350){
            currentHeldTurret = {name: "firstTurret", colour: "#b714ba", bulletSize: 10, cost: 40, damage: 30, speed: 45, attackRangeCircleSize: 250, attackAngleLead: 25, shotDelay: 50};
        }else if($.mouse.x < 1800 && $.mouse.x > 1750 && $.mouse.y < 400 && $.mouse.y > 350){
            currentHeldTurret = {name: "secondTurret", colour: "#0ec792", bulletSize: 10, cost: 100, damage: 10, speed: 50, attackRangeCircleSize: 250, attackAngleLead: 15, shotDelay: 20};
        }else if($.mouse.x < 1700 && $.mouse.x > 1653 && $.mouse.y < 500 && $.mouse.y > 450){
            currentHeldTurret = {name: "thirdTurret", colour: "#d47902", bulletSize: 10, cost: 150, damage: 30, speed: 30, attackRangeCircleSize: 300, attackAngleLead: 35, shotDelay: 30};
        }else if($.mouse.x < 1800 && $.mouse.x > 1750 && $.mouse.y < 500 && $.mouse.y > 450){
            currentHeldTurret = {name: "fourthTurret", colour: "#00eeff", bulletSize: 20, cost: 250, damage: 70, speed: 50, attackRangeCircleSize: 400, attackAngleLead: 15, shotDelay: 70};
        }

        if($.mouse.x < 1970 && $.mouse.x > 1620 && $.mouse.y < 713 && $.mouse.y > 615){
            seeRange = !seeRange;
        }
    }
    seeTurretRange();
}

//toggle the turret range
function seeTurretRange(){
    $.text.size = 22;
    $.colour.fill= "#00c8f5";

    if(seeRange === true){
        $.text.print(1795,705,"Click me for untoggle turret attack range");
    }else{
        $.text.print(1790,705,"Click me for toggle turret attack range");
    }
}

//for if the player is holding a turret
function holdingTurret(){
    $.text.size = 25;
    $.colour.fill= "#00c8f5";
    $.text.print(1780,575,"Right click to let go of the turret");

    $.colour.fill= currentHeldTurret.colour;
    $.shape.oval($.mouse.x, $.mouse.y, 20)
}

//the icons for the turrets
function turretSelectionIcons(){
    $.text.size = 30;
    $.colour.fill= "#00c8f5";
    $.text.print(1718,335,"Choose a Turret:");

    $.colour.fill= "#b714ba";
    let firstTurret = {x:1674, y:374, width:20}
    $.shape.oval(firstTurret.x, firstTurret.y, firstTurret.width)

    $.text.size = 30;
    $.colour.fill= "#00c8f5";
    $.text.print(1670,430,"40");

    $.colour.fill= "#0ec792";
    let secondTurret = {x:1774, y:374, width:20}
    $.shape.oval(secondTurret.x, secondTurret.y, secondTurret.width)

    $.text.size = 30;
    $.colour.fill= "#00c8f5";
    $.text.print(1770,430,"100");

    $.colour.fill= "#d47902";
    let thirdTurret = {x:1674, y:474, width:20}
    $.shape.oval(thirdTurret.x, thirdTurret.y, thirdTurret.width)

    $.text.size = 30;
    $.colour.fill= "#00c8f5";
    $.text.print(1670,530,"150");

    $.colour.fill= "#00eeff";
    let fourthTurret = {x:1774, y:474, width:20}
    $.shape.oval(fourthTurret.x, fourthTurret.y, fourthTurret.width)

    $.text.size = 30;
    $.colour.fill= "#00c8f5";
    $.text.print(1770,530,"250");
}

//place the turret
function placeTurret(){
    let turret = $.makeCircleCollider($.mouse.x, $.mouse.y, 40);
    turret.attackRangeCircle = createTurretattackRangeCircle();
    turret.static = true;
    turret.stroke = "rgba(1,1,1,0)";
    turret.fill= currentHeldTurret.colour;
    turret.name = currentHeldTurret.name;
    turret.damage = currentHeldTurret.damage;
    turret.bulletSize = currentHeldTurret.bulletSize;
    turret.bulletSpeed = currentHeldTurret.speed;
    turret.shotDelay = currentHeldTurret.shotDelay;
    turret.attackAngleLead = currentHeldTurret.attackAngleLead;
    turret.lastShot = 0;
    currentPoints-= currentHeldTurret.cost;
    return turret;
}

//create the circle for where the turrets can shoot the enemies
function createTurretattackRangeCircle(){
    let attackRangeCircle = $.makeCircleCollider($.mouse.x, $.mouse.y, currentHeldTurret.attackRangeCircleSize);
    attackRangeCircle.static = true;
    return attackRangeCircle;
}

//bounds for where the turret can be placed
function whereTurretCanPlace(){
    //play area bounds
    if($.mouse.x < 400 || $.mouse.x > 1600 || $.mouse.y < 100 || $.mouse.y > 1100){
        return false;
    }
    return true;
}

//for the turrets shooting
function turretShoot(turret, enemy){
    if($.frameCount > turret.lastShot + turret.shotDelay){
        let angleYouWant = $.math.adjustDegressSoTopIsZero($.math.atan2(turret.y-enemy.y, turret.x-enemy.x))
        bulletGroup.push(createBullet(angleYouWant, turret, enemy));
        turret.lastShot = $.frameCount;
    }
}

//create turret bullet
function createBullet(angle, turret, enemy){
    let bullet = $.makeCircleCollider(turret.x,turret.y,turret.bulletSize)
    bullet.fill = "black";
    bullet.static = true;
    bullet.speed = turret.bulletSpeed;
    bullet.damage = turret.damage;
    bullet.spawned = $.frameCount;

    //enemy is on the left of the turret
    if(enemy.x < turret.x){
        if(enemy.direction === 0){
            bullet.direction = angle + turret.attackAngleLead;
        }else if(enemy.direction === 90){
            bullet.direction = angle + turret.attackAngleLead;
        }else if(enemy.direction === 180){
            bullet.direction = angle - turret.attackAngleLead;
        }else if(enemy.direction === 270){
            bullet.direction = angle - turret.attackAngleLead;
        }
    //if the enemy is on the right of the turret 
    }else if(enemy.x > turret.x){
        if(enemy.direction === 0){
            bullet.direction = angle - turret.attackAngleLead;
        }else if(enemy.direction === 90){
            bullet.direction = angle - turret.attackAngleLead;
        }else if(enemy.direction === 180){
            bullet.direction = angle + turret.attackAngleLead;
        }else if(enemy.direction === 270){
            bullet.direction = angle + turret.attackAngleLead;
        }
    }else{
        bullet.direction = angle;
    }

    bullet.friction = 0;
    return bullet;
}

//bullet hit an enemy
function bulletHit(bullet, enemy){
    enemy.currentLife -= bullet.damage;
    removeBullet(bullet);
}

//remove a bullet
function removeBullet(bullet){
    bullet.remove();
}