import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { AssetJob } from "./AssetManager.js";

export class SoundFileAsset {
    /**
     * @type {AudioBufferSourceNode[]}
     */
    #sources;
    #gainNode;
    /**
     * @type {AudioBuffer}
     */
    #buffer;
    #audioContext;
    #max;
    #hasWarnedAboutMaxCopies
    #filepath
    #startTime;
    #endTime;

    /**
     * @param {string} filepath
     * @param {AssetJob} job
     * @param {AudioContext} audioContext
     */
    constructor(filepath, job, audioContext) {
        this.#audioContext = audioContext;
        this.#gainNode = this.#audioContext.createGain();
        this.filepath = filepath;
        this.#filepath = filepath; // this hidden private copy of the filepath is kept so we can refer to the sounds filepath for errors later in the program without the user having to worry about the property
        this.#buffer = undefined;
        this.#startTime = 0;
        this.#endTime = 1;

        this.#hasWarnedAboutMaxCopies=false;
        this.#sources = [];
        this.#max = 3;
        this.job = job;
        fetch(filepath)
            .then((response) => {
                const OK = 200;
                if (response.status !== OK) {
                    const errorMessage = ErrorMsgManager.loadFileFailed(
                        filepath,
                        "sound"
                    );
                    throw new Error("Loading Sound:" + errorMessage);
                }
                return response;
            })
            .then((response) => {
                return response.arrayBuffer();
            })
            .then((data) => {
                return this.#audioContext.decodeAudioData(data);
            })
            .then((buffer) => {
                this.#buffer = buffer;
                this.endTime = buffer.duration;
                job.finish();

                delete this.filepath;
                delete this.job;
            })
            .catch((error) => {
                console.error(error);
                job.error = error;
            });
    }
    set maxCopies(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "maxCopies must be a number."
                )
            );
        }
        if (value < 1) {
            throw new Error("maxCopies must be set to at least 1");
        }
        this.#max = value;
        return;
    }
    get maxCopies() {
        return this.#max;
    }

    set startTime( startTime ) {
        if (Number.isFinite(startTime) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(startTime, "startTime must be a positive finite number!")
            )
        }
        if (startTime < 0) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(startTime, "startTime must be a positive finite number!")
            )
        }
        if (startTime >= this.#endTime) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    startTime, "startTime must be less than endTime!"
                )
            );
        }
        this.#startTime = startTime;
    }
    get startTime() {
        return this.#startTime;
    }

    set endTime( endTime ) {
        if (Number.isFinite(endTime) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(endTime, "endTime must be a positive finite number!")
            )
        }
        if (endTime < 0) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(endTime, "endTime must be a positive finite number!")
            );
        }
        if (endTime <= this.#startTime) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    endTime, "endTime must be greater than startTime!"
                )
            );
        }
        this.#endTime = endTime;
    }
    get endTime() {
        return this.#endTime;
    }

    /**
     * @param {unknown} timestamp
     */
    playFrom(timestamp) {
        if (Number.isFinite(timestamp) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    timestamp,
                    "timestamp must be a number."
                )
            );
        }
        const source = this.#audioContext.createBufferSource();
        source.buffer = this.#buffer;
        source.connect(this.#gainNode);

        //spawn a source starting from given time frame
    }

    play() {
        if (!this.#buffer) {
            return;
        }
        if (this.#sources.length >= this.#max) {
            if(!this.#hasWarnedAboutMaxCopies) { //ensures warning only happens once per sound so we don't flood the console
                this.#hasWarnedAboutMaxCopies=true;
                console.warn(
                    `You've tried to spawn too many copies of ${this.#filepath}, sounds have a maximum number of instances they can have playing at any one time if you want to play more copies at once change the .maxCopies for this sound`
                );
            }

            return; //leave play as we are at max copies
        }

        const source = this.#audioContext.createBufferSource();
        source.buffer = this.#buffer;
        source.connect(this.#gainNode);
        this.#gainNode.connect(this.#audioContext.destination);
        source.start(0, this.startTime, this.endTime - this.startTime);

        source.onended = () => {
            source.disconnect();
            this.#gainNode.disconnect();

            const index = this.#sources.indexOf(source);
            if (index !== -1) {
                this.#sources.splice(index, 1);
            }
        };

        this.#sources.push(source);
    }

    stop() {
        if (!this.#sources) {
        }
        for (let i = 0; i < this.#sources.length; i++) {
            this.#sources[i].stop();
        }
    }

    //volume is a wrapper around the gainNode's gain.value, this lets the user set the volume on a scale of 0 to 100
    set volume(value) {
        if (Number.isFinite(value) === false) {
            throw new Error(
                ErrorMsgManager.numberCheckFailed(
                    value,
                    "Volume must be a number."
                )
            );
        }
        if (value < 0 || value > 100) {
            throw new Error("Volume must be between 0 and 100.");
        }
        this.#gainNode.gain.value = value / 100.0;
        return;
    }

    get volume() {
        return this.#gainNode.gain.value * 100;
    }

    get isPlaying() {
        return this.#sources.length > 0;
    }
}
