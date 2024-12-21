
export class EventCallbackID {
    /**
     * @param {any} channel 
     * @param {number} idx 
     */
    constructor( channel, idx ) {
        this.channel = channel;
        this.idx = idx;
    }
}


export class EventEmitter {
    /** @type {Map<any, Function[]>} */
    callbacks;

    constructor() {
        this.callbacks = new Map();
    }

    /**
     * Insert callback.
     * @param {any} channel Channel.
     * @param {Function} callback Callback.
     * @returns {EventCallbackID} Identifier.
     */
    #insert( channel, callback ) {
        const arr = this.callbacks.get(channel);

        for (let i=0; i<arr.length; i++) {
            if (arr[i] === undefined) {
                arr[i] = callback;
                return new EventCallbackID(channel, i);
            }
        }
    
        arr.push(callback);
        return new EventCallbackID(channel, arr.length-1);
    }

    /**
     * Delete callback.
     * @param {EventCallbackID} key Identifier.
     */
    #delete( key ) {
        if (this.callbacks.has(key.channel) === false) {
            throw new Error(`No such channel: ${key.channel}`);
        }
        const arr = this.callbacks.get(key.channel);
        delete arr[key.idx];
        arr[key.idx] = undefined;
    }

    /** @param {any} channel Channel. */
    #createChannel( channel ) {
        if (this.callbacks.has(channel) === false) {
            this.callbacks.set(channel, []);
        }
    }

    /** @param {any} channel Channel. */
    #deleteChannel( channel ) {
        if (this.callbacks.has(channel)) {
            this.callbacks.delete(channel);
        }
    }

    /**
     * @param {any} channel Channel.
     * @returns {boolean}
     */
    hasChannel( channel ) {
        return this.callbacks.has(channel);
    }

    /**
     * Add callback triggered by ch.
     * @param {any} channel Channel.
     * @param {Function} callback Callback.
     * @returns {EventCallbackID} Identifier.
     */
    on( channel, callback ) {
        if (this.hasChannel(channel) === false) {
            this.#createChannel(channel);
        }
        return this.#insert(channel, callback);
    }

    /**
     * @param {any} channel Channel.
     * @param {any} data Data to pass to each callback.
     */
    emit( channel, data ) {
        if (this.hasChannel(channel) === false) {
            this.#createChannel(channel);
        }
    
        const arr = this.callbacks.get(channel);
        for (let callback of arr) {
            if (callback !== undefined) {
                callback(data);
            }
        }
    }

    /**
     * @param {EventCallbackID} Identifier.
     */
    delete( ...keys ) {
        for (let key of keys) {
            this.#delete(key);
        }
    }

}
