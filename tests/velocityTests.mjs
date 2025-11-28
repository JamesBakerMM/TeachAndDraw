// Velocity.tests.js
import { Velocity } from "../lib/Velocity.js";

const EPSILON = 1e-6;

function expectClose(actual, expected, message) {
    if (Math.abs(actual - expected) > EPSILON) {
        console.error(`❌ ${message} (expected ~${expected}, got ${actual})`);
        throw new Error("Test failed");
    } else {
        console.log(`✅ ${message}`);
    }
}

function expectEqual(actual, expected, message) {
    if (actual !== expected) {
        console.error(`❌ ${message} (expected ${expected}, got ${actual})`);
        throw new Error("Test failed");
    } else {
        console.log(`✅ ${message}`);
    }
}

function testInitialDirections() {
    console.log("\n=== initial direction from x,y ===");

    // Zero vector: direction stays default 0
    const v0 = new Velocity(0, 0);
    expectEqual(v0.direction, 0, "zero vector keeps direction at 0°");

    // Up: (0, -1) → 0°
    const vUp = new Velocity(0, -5);
    expectEqual(vUp.direction, 0, "(0,-5) points 0° (up)");

    // Right: (5, 0) → 90°
    const vRight = new Velocity(5, 0);
    expectEqual(vRight.direction, 90, "(5,0) points 90° (right)");

    // Down: (0, 5) → 180°
    const vDown = new Velocity(0, 5);
    expectEqual(vDown.direction, 180, "(0,5) points 180° (down)");

    // Left: (-5, 0) → 270°
    const vLeft = new Velocity(-5, 0);
    expectEqual(vLeft.direction, 270, "(-5,0) points 270° (left)");
}

function testSpeedPreservesDirection() {
    console.log("\n=== setting speed preserves direction ===");

    const v = new Velocity(0, -10); // up
    const originalDir = v.direction;
    const originalSpeed = v.speed;

    expectEqual(originalDir, 0, "original direction is 0° (up)");
    expectClose(originalSpeed, 10, "original speed is 10");

    v.speed = 5;

    expectEqual(v.direction, 0, "direction still 0° after changing speed");
    expectClose(v.speed, 5, "speed updated to 5");
    expectClose(v.x, 0, "x ~ 0 when pointing up");
    expectClose(v.y, -5, "y ~ -5 when pointing up with speed 5");
}

function testDirectionPreservesSpeed() {
    console.log("\n=== setting direction preserves speed ===");

    const v = new Velocity(0, -10); // up
    const originalSpeed = v.speed;
    expectClose(originalSpeed, 10, "original speed is 10");

    // Turn to the right: 90°
    v.direction = 90;

    expectEqual(v.direction, 90, "direction set to 90° (right)");
    expectClose(v.speed, 10, "speed preserved after changing direction");
    expectClose(v.x, 10, "x ~ 10 when pointing right with speed 10");
    expectClose(v.y, 0, "y ~ 0 when pointing right");
}

function testCardinalDirectionsFromDirection() {
    console.log("\n=== constructing velocities via direction+speed ===");

    // 0°: up
    const vUp = new Velocity(0, 0);
    vUp.direction = 0;
    vUp.speed = 5;
    expectClose(vUp.x, 0, "0°: x ~ 0");
    expectClose(vUp.y, -5, "0°: y ~ -5 (up)");

    // 90°: right
    const vRight = new Velocity(0, 0);
    vRight.direction = 90;
    vRight.speed = 5;
    expectClose(vRight.x, 5, "90°: x ~ 5 (right)");
    expectClose(vRight.y, 0, "90°: y ~ 0");

    // 180°: down
    const vDown = new Velocity(0, 0);
    vDown.direction = 180;
    vDown.speed = 5;
    expectClose(vDown.x, 0, "180°: x ~ 0");
    expectClose(vDown.y, 5, "180°: y ~ 5 (down)");

    // 270°: left
    const vLeft = new Velocity(0, 0);
    vLeft.direction = 270;
    vLeft.speed = 5;
    expectClose(vLeft.x, -5, "270°: x ~ -5 (left)");
    expectClose(vLeft.y, 0, "270°: y ~ 0");
}

function testAdjustInverse() {
    console.log("\n=== adjust/unadjust are inverses ===");

    const samples = [0, 45, 90, 135, 180, 225, 270, 315];

    for (const deg of samples) {
        const adjusted = Velocity._adjustDegreesSoTopIsZero(deg);
        const unadjusted = Velocity._unadjustDegreesFromZero(adjusted);
        // Depending on whether you normalize, you might want to wrap here,
        // but for now just check they're close.
        expectClose(
            Velocity._normalizeDegree(unadjusted),
            Velocity._normalizeDegree(deg),
            `unadjust(adjust(${deg})) ~= ${deg}`
        );
    }
}

function runAllTests() {
    try {
        testInitialDirections();
        testSpeedPreservesDirection();
        testDirectionPreservesSpeed();
        testCardinalDirectionsFromDirection();
        testAdjustInverse();
        console.log("\n🎉 All tests passed!");
    } catch (e) {
        console.error("\n💥 Test suite aborted due to failure.");
        console.error(e);
        process.exit?.(1);
    }
}

runAllTests();
