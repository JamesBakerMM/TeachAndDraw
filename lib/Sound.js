import { Tad } from "./TeachAndDraw.js";
export class Sound {
    #tad;
    #muteButton;
    /**
     *
     * @param {Tad} tad
     */
    constructor(tad) {
        this.#tad = tad;
        this.#muteButton = tad.make.button(0, 0, 100, 100, " ");
        this.context = new AudioContext();
        this.validTypes = new Set();
        this.validTypes.add("mp3");
    }
    /**
     * @param {string} filepath
     */
    isValidType(filepath) {
        const splitPath = filepath.split("/");
        const filename = splitPath.splice(splitPath.length - 1)[0];
        const splitname = filename.split(".");
        let filetypeFromPath = splitname[splitname.length - 1];
        return this.validTypes.has(filetypeFromPath.toLowerCase());
    }

    draw() {
        if (this.context.state === "suspended") {
            this.#muteButton.x = this.#tad.w - 30;
            this.#muteButton.y = this.#tad.h - 30;
            this.#muteButton.draw();
            this.#muteButton.w = 50;
            this.#muteButton.h = 50;
            this.#tad.text.size = 30;
            this.#tad.text.print(this.#muteButton.x, this.#muteButton.y, "🔇");
            if (this.#muteButton.down) {
                this.context.resume();
            }
        }
    }
}
