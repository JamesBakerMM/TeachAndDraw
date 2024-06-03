import { ErrorMsgManager } from "./ErrorMessageManager.js";

export class SoundFileAsset {
    #sources;
    #gainNode;
    #buffer;
    #audioContext;
    #max;

    constructor(filepath, job, audioContext) {
        this.#audioContext = audioContext;
        this.#gainNode = this.#audioContext.createGain();
        this.filepath = filepath;
        this.#buffer = undefined;
        this.#sources = [];
        this.#max = 3;

        fetch(filepath)
            .then((response) => {
                const OK = 200;
                if (response.status !== OK) {
                    const errorMessage = ErrorMsgManager.loadFileFailed(filepath, "sound")
                    throw new Error("Loading Sound:" + errorMessage);
                }
                console.log("got response", response.status, response)
                return response
            })
            .then((response) => {
                return response.arrayBuffer()
            })
            .then((data) => { return this.#audioContext.decodeAudioData(data) })
            .then((buffer) => {
                this.#buffer = buffer;
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
            throw new Error(ErrorMsgManager.numberCheckFailed(value, "maxCopies must be a number."));
        }
        if (value < 1) {
            throw new Error("maxCopies must be set to at least 1");
        }
        this.#max = value;
        return this.#max
    }
    get maxCopies() {
        return this.#max;
    }

    playFrom(timestamp) {
        if (Number.isFinite(timestamp) === false) {
            throw new Error(ErrorMsgManager.numberCheckFailed(timestamp, "timestamp must be a number."));
        }
        const source = this.#audioContext.createBufferSource();
        source.buffer = this.#buffer;
        source.connect(this.#gainNode);

        //spawn a source starting from given time frame
    }

    play() {
        if (!this.#buffer) {
            return
        }
        if (this.#sources.length >= this.#max) {
            console.warn(`You've tried to spawn too many copies of ${this.soundFileName}, sounds have a maximum number of instances they can have playing at any one time if you want to play more copies at once change the .maxCopies for this sound`);
            return
        }

        const source = this.#audioContext.createBufferSource();
        source.buffer = this.#buffer;
        source.connect(this.#gainNode);
        this.#gainNode.connect(this.#audioContext.destination);
        source.use();

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
            throw new Error(ErrorMsgManager.numberCheckFailed(value, "Volume must be a number."));
        }
        if (value < 0 || value > 100) {
            throw new Error("Volume must be between 0 and 100.");
        }
        this.#gainNode.gain.value = value / 100.0;
        return this.#gainNode.gain.value
    }

    get volume() {
        return this.#gainNode.gain.value * 100;
    }

    get isPlaying() {
        return this.#sources.length > 0;
    }
}
