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
        this.#max=3;

        // Load audio data
        fetch(filepath)
            .then((response) => response.arrayBuffer())
            .then((data) => this.#audioContext.decodeAudioData(data))
            .then((buffer) => {
                this.#buffer = buffer;
                job.finish();

                delete this.filepath;
                delete this.job;
            })
            .catch((error) => {
                console.error("Error loading Sound file:", error);
                job.error = error;
            });
    }
    set maxCopies(value) {
        if (typeof value !== "number" || isNaN(value)) {
            throw new Error("max copies must be a number.");
        }
        if (value < 1) {
            throw new Error("max must be set to at least 1");
        }
        this.#max = value;
    }
    get maxCopies() {
        return this.#max;
    }

    play() {
        if (!this.#buffer) { 
            return
            // throw Error("The buffer hasn't ")
        }
        if (this.#sources.length >= this.#max) {
            console.log("You have the maximum number of copies play");
            return
        }

        const source = this.#audioContext.createBufferSource();
        source.buffer = this.#buffer;
        source.connect(this.#gainNode);
        this.#gainNode.connect(this.#audioContext.destination);
        source.start();

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
        for(let i=0; i<this.#sources.length; i++){
            this.#sources[i].stop();
        }
    }

    set volume(value) {
        if (typeof value !== "number" || isNaN(value)) {
            throw new Error("Volume must be a number.");
        }
        if (value < 0 || value > 100) {
            throw new Error("Volume must be between 0 and 100.");
        }
        this.#gainNode.gain.value = value / 100.0; // Convert volume to a scale of 0.0 to 1.0
    }

    get volume() {
        return this.#gainNode.gain.value * 100; // Convert gain value back to a 0-100 scale
    }

    get isPlaying(){
        return this.#sources.length>0;
    }
}
