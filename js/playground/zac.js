import { 
    tad,
    keys,
    mouse,
    make 
} from "../../lib/TeachAndDraw.js";

tad.use(update);

const player = make.boxCollider(tad.w / 2, tad.h / 2, 20, 20);
const bullets = make.group();
const targets = make.group();

let INCREMENT_SIZE = tad.w / 5;
for (let x = INCREMENT_SIZE / 2; x < tad.w; x += INCREMENT_SIZE) {
    targets.push(newTarget(x, 50));
}

//timer stuff
let shootTimer = 0;
function update() {
    if (keys.down("a")) {
        player.direction = 270;
        player.speed += 2;
    } else if (keys.down("d")) {
        player.direction = 90;
        player.speed += 2;
    }
    if (keys.down(" ") && shootTimer < 0) {
        shootTimer = 30;
        bullets.push(newBullet(player.x, player.y - player.h, 0));
    }

    if (player.speed > 30) {
        player.speed = 30;
    }
    shootTimer -= 1;
    for (const bullet of bullets) {
        for (const target of targets) {
            if (bullet.collides(target)) {
                bullet.remove();
                target.remove();
            }
        }
    }
    player.draw();
    bullets.draw();
    targets.draw();
}

function newBullet(x, y, direction) {
    const bullet = make.boxCollider(x, y, 5, 10);
    bullet.colour = "blue";
    bullet.direction = direction;
    bullet.friction = 0;
    bullet.speed = 10;
    bullet.lifespan = 3;
    return bullet;
}

function newTarget(x, y) {
    const enemy = make.circleCollider(x, y, 50);
    return enemy;
}
