import { tad, time, text, make, math, shape } from "../../lib/TeachAndDraw.js";

tad.use(update);

const SCREENS = {
    main: "main",
    grey: "grey",
    credits: "credits",
};

const dropdown = make.dropdown(tad.w / 2, 20, 200, ["main","grey","credits"]);

let currentScreen = dropdown.value;

function update() {
    currentScreen = dropdown.value; //update which screen is set
    if (currentScreen === SCREENS.main) {
        drawMenu();
    } else if (currentScreen === SCREENS.grey) {
        drawPulsingGrey();
    } else if (currentScreen === SCREENS.credits) {
        drawCredits();
    }
    dropdown.draw();
}

function drawMenu() {
    shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);
    text.colour = "white";
    text.print(tad.w / 2, tad.h / 2, "Use the dropdown to change screens!");
}

function drawPulsingGrey() {
    const grayscale_value = math.rescale(
        math.sin(time.frames),
        -1,
        1,
        0,
        255
    );

    shape.colour = `rgba(${grayscale_value},${grayscale_value},${grayscale_value},1)`;
    shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);
}

function drawCredits() {
    shape.rectangle(tad.w / 2, tad.h / 2, tad.w, tad.h);
    text.colour = "white";
    text.print(
        tad.w / 2,
        tad.h / 2,
        "Made by 12 goats in a very large trenchcoat"
    );
}