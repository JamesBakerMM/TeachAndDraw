import { $, shape, colour, mouse, keys, text } from "../../lib/Pen.js"
$.use(draw)
$.width = 900
$.height = 600
// $.debug = true

let playerCar = $.makeBoxCollider(200, 200, 20, 20)
// playerCar.asset = $.loadImage(165,200,  "./assets/carSmol.png")

let grass = $.makeBoxCollider(20, 20, 82.5, 82.5)
// grass.asset = $.loadImage(0,0, "assets/g1Scale.png")



// Textures
// let playerCar =         $.loadImage(165,200,  "./assets/carSmol.png")
// let texture_track_01 =  $.loadImage(200,200, "assets/r1Scale.png")
// let texture_grass_01 =  $.loadImage(200,200, "assets/g1Scale.png")
// let texture_sf1_01 =    $.loadImage(200,200, "assets/sf1Scale.png")
// let texture_strip_01 =  $.loadImage(200,200, "assets/strip1.png")
// let texture_strip_02 =  $.loadImage(200,200, "assets/strip2.png")
// let texture_strip_03 =  $.loadImage(200,200, "assets/strip3.png")
// let texture_strip_04 =  $.loadImage(200,200, "assets/strip4.png")
// let texture_tree_01 =   $.loadImage(200,200, "assets/tree1.png")
// let texture_tree_02 =   $.loadImage(200,200, "assets/tree2.png")

// // File Imports and Storage
// let fileImport_track_01 =   $.loadTextFile('./assets/track.txt')
// let fileImport_track_01_a = $.loadTextFile('./assets/track_detail_01.txt')
// let fileImport_track_01_b = $.loadTextFile('./assets/track_detail_02.txt')
let fileTrack = ""
let fileTrackDetailStrips = ""
let fileTrackDetailTrees = ""
let trackTileSize

// Vehicle characteristics 
let playerCarSpec = {
    topSpeed: 25,           // Top speed of the car
    accelRate: 0.2,         // Speed increase rate on full throttle
    brakeRate: 0.22,        // Speed decrease rate on brake
    rollRate: 0.05,         // Speed decrease when no throttle input
    turnRate: 0.8,          // Rate that the car turns
    turnEfficiency: 1,      // Lowest car speed while turning
    turnSpeedScrub: 0.2,    // Speed decrease rate to turnEfficiency
}

//  Define Groups
let group_grass = $.makeGroup()
let group_road = $.makeGroup()
let group_startFinish = $.makeGroup()


function setup() {
    if ($.frameCount === 0) {

        fileTrack = [
            `1 1 1 1 2`,
            `1 0 0 0 1`,
            `1 0 0 0 1`,
            `1 0 0 0 1`,
            `1 1 1 1 1`,
        ]
        trackTileSize = 82.5;

        let baseLayerInstructions = [
            {
                symbol: "0",
                func: (currentX, currentY) => {
                    group_grass.push(makeGrass(currentX, currentY))
                }
            }, {
                symbol: "1",
                func: (currentX, currentY) => {
                    group_road.push(makeRoad(currentX, currentY))
                }
            }, {
                symbol: "2",
                func: (currentX, currentY) => {
                    group_start.push(makeStart(currentX, currentY))
                }
            },
        ];
        let detailLayerInstructions = [
            {
                symbol: "0",
                func: (currentX, currentY) => {

                }
            }
        ]
        makeTrack(fileTrack, baseLayerInstructions)

        // createGroup(fileTrack, group_grass, 0)
        // createGroup(fileTrack, group_road, 1)
        // createGroup(fileTrack, group_startFinish, 2)

    } // END Magic loady framecount James-ism 

}


function makeTrack(trackFile, instructions) {
    for (let y = 0; y < trackFile.length; y++) {
        const currentline = trackFile[y].split(" ")
        for (let x = 0; x < currentline.length; x++) {
            const currentX = x * trackTileSize + 82.5
            const currentY = y * trackTileSize + 50
            for (let instruct of instructions) {
                if (instruct.symbol === currentline[x]) {
                    instruct.func(currentX, currentY);
                }
            }
        }
    }
}

function draw() {
    setup()

    // // Main Track Parts

    // createTile(fileTrack, texture_grass_01, trackTileSize,  "0")
    // createTile(fileTrack, texture_track_01, trackTileSize,  "1")
    // createTile(fileTrack, texture_sf1_01,   trackTileSize,  "2")

    // // Track Detail - Rumble Strips
    // createTile(fileTrackDetailStrips, texture_strip_01, trackTileSize,  "2")
    // createTile(fileTrackDetailStrips, texture_strip_02, trackTileSize,  "1")
    // createTile(fileTrackDetailStrips, texture_strip_03, trackTileSize,  "4")
    // createTile(fileTrackDetailStrips, texture_strip_04, trackTileSize,  "3")

    // // Track Details - Trees
    // createTile(fileTrackDetailTrees, texture_tree_01, trackTileSize,  "1")
    // createTile(fileTrackDetailTrees, texture_tree_02, trackTileSize,  "2")

    playerCarControl()

    //is the car on top of ANY of the strips

    let hasOverlappedStrip=false;
    for (let i = 0; i < group_strips.length; i++) {
        if (playerCar.overlaps(group_strips[i])) {
            hasOverlappedStrip=true;
        }
    }

    if(hasOverlappedStrip){
        playerCar.friction = 1000;
    } else {
        playerCar.friction = 0;
    }

    for (let i = 0; i < grass.length; i++) {
        grass[i].collides(playerCar)
    }

    playerCar.draw()
    group_grass.draw()
    $.drawAllColliders();
}


function makeGrass(x, y) {
    let grass = $.makeBoxCollider(x, y, 80, 80)

    return grass
}



// Create Tile on Canvas
function createTile(trackDataFile, texture_name, trackTileSize, id) {

    for (let y = 0; y < trackDataFile.length; y++) {
        const currentline = trackDataFile[y].split("")

        for (let x = 0; x < currentline.length; x++) {
            const currentX = x * trackTileSize + 82.5
            const currentY = y * trackTileSize + 50

            // Draw the Track
            if (currentline[x] === id) {
                texture_name.draw(currentX, currentY)
            }
        }
    }

}

// Set Groups
//  Takes 3 Parameters:
//  - The trackFile.txt
//  - The group name.
//  - An identifier from a text file.
function createGroup(trackDataFile, group_name, id) {
    trackDataFile = fileTrack.toString().split("")

    for (let i = 0; i < trackDataFile.length; i++) {
        if (trackDataFile[i] == id) {
            group_name.push(i)

        }
    }

}


function playerCarControl() {
    playerCar.rotation = playerCar.direction
    let currentPlayerCarDirection = playerCar.direction

    // ============================================= Right - Turn
    if ($.keys.down("d")) {
        playerCar.direction += playerCarSpec.turnRate

        // So the car can still tight turn from a stop 
        if (playerCar.speed >= playerCarSpec.turnEfficiency) {
            playerCar.speed -= playerCarSpec.turnSpeedScrub
        }

        // Prevent car from turning if not moving
        if (playerCar.speed == 0) {
            playerCar.direction = currentPlayerCarDirection
        }
    }

    // ============================================= Left - Turn
    if ($.keys.down("a")) {
        playerCar.direction -= playerCarSpec.turnRate

        // So the car can still tight turn from a stop 
        if (playerCar.speed >= playerCarSpec.turnEfficiency) {
            playerCar.speed -= playerCarSpec.turnSpeedScrub
        }

        // Prevent car from turning if not moving
        if (playerCar.speed == 0) {
            playerCar.direction = currentPlayerCarDirection
        }
    }

    // // ============================================= Up - Accelerate
    if ($.keys.down("w")) {
        playerCar.speed += playerCarSpec.accelRate
        if (playerCar.speed >= playerCarSpec.topSpeed) {
            playerCar.speed = playerCarSpec.topSpeed
        }
    }

    else {
        // IF key released, roll to zero speed over time
        playerCar.speed -= playerCarSpec.rollRate

        // Prevents speed from dipping under 0 due to rollRate
        if (playerCar.speed <= 0) {
            playerCar.speed = 0;
        }
    }

    // ============================================= Down - Brake
    if ($.keys.down("s")) {
        playerCar.speed -= playerCarSpec.brakeRate

        // Prevents speed from dipping under 0 due to brakeRate
        if (playerCar.speed <= 0) {
            playerCar.speed = 0
        }
    }



}