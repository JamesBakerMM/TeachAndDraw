import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { Img, Stamp } from "./Img.js";
import { MovingStamp } from "./Animation.js";
//assets
import { AssetManager, AssetJob } from "./AssetManager.js";
import { TextFileAsset } from "./TextFileAsset.js";
import { JsonFileAsset } from "./JsonFileAsset.js";
import { SoundFileAsset } from "./SoundFileAsset.js";
import { FontFileAsset } from "./FontFileAsset.js";

import { Video } from "./Video.js";
/**
 * @typedef {import("./TeachAndDraw.js").Tad} Tad
 */
//entities

export class Load {
    #assets;
    /**
     * @type {string} - Any overall css styling needing to be added. Don't overwrite, add on to the property.
     */
    #overallStyle = "";
    #soundsLoaded = 0;

    /**
     * @param {Tad} tad
     */
    constructor(tad) {
        this.tad = tad;
        this.#assets = new AssetManager(tad);
    }

    /**
     * Loads an image from a given file path, wraps it in an Stamp object, and returns the wrapper.
     * This method checks if the image has already been loaded to avoid duplication.
     * If the image is new, it creates a new AssetJob for loading and tracking the image's loading state.
     *
     * @param {number} x - The x-coordinate where the image will be positioned upon rendering.
     * @param {number} y - The y-coordinate where the image will be positioned upon rendering.
     * @param {string} filepath - The file path of the image to be loaded.
     * @returns {Stamp} The Stamp object containing the loaded image.
     * @throws {Error} If x or y are not finite numbers, indicating incorrect positioning parameters.
     * @throws {Error} If the filepath argument is not a string, indicating an invalid file path.
     */
    image(x, y, filepath) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (typeof filepath !== "string") {
            throw new Error(
                `Filepath is not a string! You gave: ${filepath}|${typeof filepath}.`
            );
        }
        if (this.tad.frameCount >= 0) {
            throw new Error(
                "You can't load after draw has started, load assets before hand and store the result in a variable, object property or group!"
            );
        }
        for (let file of this.#assets.jobs) {
            if (file.filepath === filepath) {
                //check if the filepath is already being loaded!
                // @ts-ignore
                const nuStamp = new Stamp(this, x, y, file.asset);
                // @ts-ignore
                file.asset.wrapper.push(nuStamp);
                return nuStamp;
            }
        }
        const job = new AssetJob(filepath);
        const img = new Img(filepath, job);
        const nuStamp = new Stamp(this.tad, x, y, img);
        img.wrapper.push(nuStamp);
        // @ts-ignore
        job.asset = img;
        this.#assets.jobs.push(job);
        return nuStamp;
    }
    /**
     * Loads a text file from the specified filepath. If the file is already in the process of loading or has been loaded, it returns the existing TextFileAsset instance; otherwise, it starts a new load process.
     *
     * @param {string} filepath - The path to the text file to load.
     * @returns {TextFileAsset} The TextFileAsset instance for the loaded text file.
     * @throws {Error} If the filepath argument is not a string.
     */
    text(filepath) {
        if (typeof filepath !== "string") {
            throw new Error(
                `Filepath is not a string! You gave: ${filepath}|${typeof filepath}.`
            );
        }
        if (this.tad.frameCount >= 0) {
            throw new Error(
                "You can't load after draw has started, load assets before hand and store the result in a variable, object property or group!"
            );
        }
        for (let file of this.#assets.jobs) {
            if (file.filepath === filepath) {
                // @ts-ignore
                return file.asset;
            }
        }

        const job = new AssetJob(filepath);
        const text = new TextFileAsset(filepath, job);
        // @ts-ignore
        job.asset = text;
        this.#assets.jobs.push(job);
        return text;
    }
    /**
     * Used to load a custom font for use in the program. Must be file type ttf, otf, woff or woff2.
     * If the custom font doesn't work, you will see symbols (Webdings) instead of your font, or an error.
     * @param {string} name - The desired name for the font. Try to use the official font name (case sensitive)
     * @param {string} filepath - The local filepath to the font file.
     * @returns {string} - The name of the font, given successful.
     */
    font(name, filepath) {
        if (typeof name !== "string") {
            throw new Error(
                `Name is not a string! You gave: ${name}|${typeof name}.`
            );
        }
        if (typeof filepath !== "string") {
            throw new Error(
                `Filepath is not a string! You gave: ${filepath}|${typeof filepath}.`
            );
        }

        //Check whether file path is local
        const filepathStart = filepath.split(":")[0];
        if (filepathStart === "http" || filepathStart === "https") {
            throw new Error(
                `Filepaths given for custom fonts must be local filepaths that lead to files you have downloaded and added into your` +
                    `folder structure. You gave ${filepath}, which is trying to access an online resource.`
            );
        }

        // Check whether a common font type is being overwritten
        const commonFonts = [
            "Arial",
            "Verdana",
            "Tahoma",
            "Trebuchet MS",
            "Times New Roman",
            "Georgia",
            "Garamond",
            "Courier New",
            "Brush Script MT",
        ];
        if (commonFonts.includes(name)) {
            throw new Error(
                `${name} cannot be used as a custom font name, as it is already the name of a common web font. ` +
                    `Either change the name, or if you're trying to use the common font called ${name}, then you don't ` +
                    `need to load the font.`
            );
        }

        for (let file of this.#assets.jobs) {
            if (file.filepath === filepath) {
                return name;
            }
        }

        // Check that file exists and can be loaded with no errors
        const job = new AssetJob(filepath);
        const font = new FontFileAsset(filepath, job);
        job.asset = font;
        this.#assets.jobs.push(job);

        // All checks passed, so add to font
        const newStyle = `
            @font-face {
                font-family: "${name}";
                src:
                    local("${name}"),
                    url("${filepath}")
            }

        `;
        this.#overallStyle += newStyle;
        this.#updateStylesheet();

        this.tad.text._addCustomFont(name);
        return name;
    }
    /**
     * Used to update the stylesheet attached to head in html with the current overallStyle text.
     */
    #updateStylesheet() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = this.#overallStyle;
        document.head.appendChild(styleSheet);
    }
    /**
     * Loads an animation consisting of multiple images from given file paths.
     * This method creates a new Animation object, loads each image specified in the filepaths,
     * and returns the assembled animation.
     * @param {number} x - The x-coordinate where the animation will be positioned.
     * @param {number} y - The y-coordinate where the animation will be positioned.
     * @param {...string} filepaths - File paths of images to be loaded for the animation.
     * @returns {MovingStamp} The newly created Animation object.
     * @throws {Error} If x or y are not finite numbers.
     * @throws {Error} If any of the filepaths are not strings or if no filepaths are provided.
     */
    animation(x, y, ...filepaths) {
        if (Number.isFinite(x) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(x, "x has to be a number!")
            );
        }
        if (Number.isFinite(y) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(y, "y has to be a number")
            );
        }
        if (filepaths.length === 0) {
            throw new Error(
                "no images provided! animations need photos! photos of spiderman!"
            );
        }
        if (this.tad.frameCount >= 0) {
            throw new Error(
                `You can't load after draw has started, load assets before hand and store the result in a variable, object property or group!\n
                ---------------------
For more information on common mistakes with loading visit:
${Video.loading.title} | ${Video.loading.url}
                `
            );
        }
        for (let i = 0; i < filepaths.length; i++) {
            const path = filepaths[i];
            if (typeof path !== "string") {
                throw new Error(
                    `Filepath at index ${i} is not a string. You gave: ${path}|${typeof path}`
                );
            }
        }
        const images = [];
        for (let path of filepaths) {
            images.push(this.image(x, y, path));
        }
        const newAnim = new MovingStamp(this.tad, x, y, ...images);
        return newAnim;
    }
    /**
     * Loads a JSON file from the specified filepath. If the file is already being loaded or has been loaded,
     * it returns the existing {@link JsonFileAsset} instance; otherwise, it initiates a new load and creates a new {@link JsonFileAsset}.
     *
     * @param {string} filepath - The path to the JSON file to load.
     * @returns {JsonFileAsset} The JsonFileAsset instance for the loaded JSON file.
     * @throws {Error} If the filepath argument is not a string.
     */
    json(filepath) {
        if (typeof filepath !== "string") {
            throw new Error(
                `Filepath is not a string! You gave: ${filepath}|${typeof filepath}.`
            );
        }
        if (this.tad.frameCount >= 0) {
            throw new Error(
                "You can't load after draw has started, load assets before hand and store the result in a variable, object property or group!"
            );
        }
        for (let file of this.#assets.jobs) {
            if (file.filepath === filepath) {
                // @ts-ignore
                return file.asset;
            }
        }
        const job = new AssetJob(filepath);
        const json = new JsonFileAsset(filepath, job);
        // @ts-ignore
        job.asset = json;
        this.#assets.jobs.push(job);
        return json;
    }
    /**
     * Loads a Audio file from the specified filepath. If the file is already loaded or being loaded it returns that existing {@link SoundFileAsset} instead. Otherwise it will create a new loading job/{@link SoundFileAsset} and return that.
     * @param {string} filepath
     * @returns {SoundFileAsset}
     * * @throws {Error} If the filepath argument is not a string.
     */
    sound(filepath) {
        if (typeof filepath !== "string") {
            throw new Error(
                `Filepath is not a string! You gave: ${filepath}|${typeof filepath}.`
            );
        }
        if (this.tad.frameCount >= 0) {
            throw new Error(
                "You can't load after draw has started, load assets before hand and store the result in a variable, object property or group!"
            );
        }
        for (let file of this.#assets.jobs) {
            if (file.filepath === filepath) {
                // @ts-ignore
                return file.asset;
            }
        }

        this.#soundsLoaded += 1;
        const job = new AssetJob(filepath);

        const soundAsset = new SoundFileAsset(
            filepath,
            job,
            this.tad.sound.context
        );
        // @ts-ignore
        job.asset = soundAsset;
        this.#assets.jobs.push(job);
        return soundAsset;
    }
    /**
     * @private
     */
    get soundsLoaded() {
        return this.#soundsLoaded;
    }

    /**
     * @private
     */
    get _jobsDone() {
        return this.#assets.isLoaded();
    }

    /**
     * @private
     */
    drawLoadingScreen() {
        this.#assets.drawLoadingScreen();
    }
}
