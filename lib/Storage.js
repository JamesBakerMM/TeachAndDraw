import { ErrorMsgManager } from "./ErrorMessageManager.js";
import { makeGroup, Group } from "./Group.js";
import { Collider } from "./Collider.js";
import { Video } from "./Video.js";
const DEFAULT_SLOT = "slot1";
const PREFIX = "-storage--";
const RESERVED = new Set([
    "hasSlot",
    "createSlot",
    "deleteSlot",
    "slots",
    "clear",
    "clearAll",
]);

class Storage {
    _activeSlot;
    constructor() {
        this._activeSlot = DEFAULT_SLOT;
    }
    toString() {
        return "this is a test!";
    }
    get slot() {
        return this._activeSlot;
    }

    /** @param {String} name */
    set slot(name) {
        if (typeof name !== "string" || !name) {
            throw new Error(
                `slot must be a non-empty string., you gave ${name}:${typeof name}`
            );
        }
        if (!this.hasSlot(name)) {
            this.makeSlot(name);
        }
        updateSlot(name);
    }

    /**
     * Returns if there is a slot with the given name
     * @param {String} name
     */
    hasSlot(name) {
        return this.slots.includes(name);
    }

    /**
     * Creates a slot with the given string value
     * @param {String} name
     */
    makeSlot(name) {
        const slots = this.slots;
        for (const slot of slots) {
            if (name === slot) {
                throw new Error(
                    `There is already a slot with the given name ${name}`
                );
            }
            if (name.toLowerCase() === slot.toLowerCase()) {
                console.warn(
                    `Just a heads up! Given slot name of ${name} is very similar to ${slot} which is already a slot name!`
                );
            }
        }
        localStorage.setItem(
            `${PREFIX}${name}-__meta__`,
            Date.now().toString()
        );
    }

    /**
     * Takes a given slot name, clears out all keys for that slot from {@link LocalStorage}, then if we were on that slot, sets us back to the default slot.
     * With handling for if we just cleared the default slot we were on.
     * @param {String} name  */
    clearSlot(name) {
        const toRemove = [];
        for (let i = 0; i < localStorage.length; i += 1) {
            const key = localStorage.key(i);
            if (key.startsWith(`${PREFIX}${name}-`)) {
                toRemove.push(key);
            }
        }
        for (const item of toRemove) {
            localStorage.removeItem(item);
        }

        if (this._activeSlot === name) {
            if (!this.slots.includes(DEFAULT_SLOT)) {
                this.makeSlot(DEFAULT_SLOT);
            }
            updateSlot(DEFAULT_SLOT);
        }
    }

    get slots() {
        const slots = new Set();
        for (const key in localStorage) {
            if (key.startsWith(PREFIX)) {
                slots.add(key.slice(PREFIX.length).split("-")[0]);
            }
        }
        return [...slots];
    }

    clear() {
        this.clearSlot(this._activeSlot);
    }

    /* ───────── internal helpers ───── */
    /**
     * Constructs the internal key from the given propertyName.
     * @param {String} propertyName
     */
    _key(propertyName) {
        return `${PREFIX}${this._activeSlot}-${propertyName}`;
    }

    get data() {
        const out = {};
        const prefix = `${PREFIX}${this._activeSlot}-`;
        for (let i = 0; i < localStorage.length; i += 1) {
            const fullKey = localStorage.key(i);
            if (fullKey.startsWith(prefix)) {
                const prop = fullKey.slice(prefix.length);
                try {
                    out[prop] = JSON.parse(localStorage.getItem(fullKey));
                } catch {
                    throw new Error(
                        "Oh no storage has corrupted somehow :( try clearing out your current slot!"
                    );
                }
            }
        }
        return Object.freeze(out);
    }
}

const storageCore = new Storage();

/**
 * Handles confirming that a value is storable and then converting it to a stored state.
 * @param {String} _ - key
 * @param {any} value - value we wish to convert.
 */
function replacer(_, value) {
    if (value instanceof Group) {
        /**
         * @todo add a check that a groups internals are valid for converting
         * Colliders should be invalid and explained why.
         * Assets should be invalid and explained why.
         * Functions should be invalid and explained why.
         */
        for (const val of value) {
            isStorable("", val);
        }
        const convertedGroup = {
            __type__: "Group",
            elements: [...value],
            name: value.name,
            colour: value.colour,
        };
        return convertedGroup;
    }
    return value;
}

/**
 * Checks if something is storable and if not throws an error.
 * @param {string} propertyName
 * @param {any} value
 */
function isStorable(propertyName, value) {
    if (
        value === undefined ||
        typeof value === "function" ||
        typeof value === "symbol" ||
        typeof value === "bigint"
    ) {
        let error_msg = `Cannot store ${typeof value}, invalid type.`;
        if (propertyName !== "") {
            error_msg = `Cannot store ${typeof value} in $.storage.${propertyName}, invalid type.`;
        }
        throw new Error(error_msg);
    }
    if (value instanceof Collider) {
        throw new Error(
            `We can't store Colliders directly in storage, for more info see:\n ${Video.howToStoreCollidersInStorage.title} | ${Video.howToStoreCollidersInStorage.url}`
        );
    }
    if (value === null || typeof value !== "object") {
        return true;
    }
    return true;
}
/**
 * @todo - fix up how tad scope is accessed here.
 * @param {String} _
 * @param {Object} value
 */
function reviver(_, value) {
    if (value === undefined) {
        throw new Error("Uh oh! Failed to reconstruct from Storage!");
    }
    //primitives and null just return no need to check!
    if (typeof value !== "object" || value === null) {
        return value;
    }
    if (value.__type__ && value.__type__ === "Group") {
        /**
         * We HAVE to fix this to be via tad passed in to this modules scope.
         * But for now this will do.
         */
        const tempGroup = makeGroup(window.$, ...value.elements);
        tempGroup.name = value.name;
        tempGroup.colour = value.colour;
        return tempGroup;
    }
    return value;
}

/**
 * This is purely here becuase I got sick of trying to work out _activeSlot with the get and set traps.
 * @param {String} name
 */
function updateSlot(name) {
    storageCore._activeSlot = name;
}

/** We wrap {@link StorageCore} in our {@link Proxy} so we can trap get and sets to it's values and instead route those to {@link LocalStorage}. 
 * 
 * @example
 * console.log($.storage.slot); //"slot1"
 * $.storage.slot="slot2";
 * $.storage.message="hi";
 * console.log($.storage.message); //"hi"
 * $.storage.clear()
 * console.log($.storage.slot); //"slot1"
 * 
*/
const storage = new Proxy(storageCore, {
    /**
     *
     * @param { Storage } target
     * @param { String } propertyName
     * @param { Function } receiver
     * @returns
     */
    get(target, propertyName, receiver) {
        if (propertyName in target || RESERVED.has(propertyName)) {
            return Reflect.get(target, propertyName, receiver);
        }

        const raw = localStorage.getItem(target._key(propertyName));
        if (raw !== null) {
            try {
                // return JSON.parse(raw);
                return JSON.parse(raw, reviver);
            } catch (err) {
                console.error(err);
                console.log(localStorage.getItem(target._key(propertyName)));
                console.error(`Corrupt data in storage for ${propertyName}`);
            }
        }
        return undefined;
    },

    /**
     *
     * @param {Object} target
     * @param {string} propertyName
     * @param {any} value
     * @param {any} receiver
     * @returns
     */
    set(target, propertyName, value, receiver) {
        if (propertyName === "slot") {
            return Reflect.set(target, propertyName, value, receiver);
        }
        if (RESERVED.has(propertyName)) {
            throw new Error(`"${propertyName}" is a reserved API name.`);
        }
        if (value === undefined) {
            throw new Error(
                `Cannot store "undefined" in storage.${propertyName}. ` +
                    `Use null or delete the key instead.`
            );
        }
        let json;
        try {
            json = JSON.stringify(value, replacer);
        } catch (err) {
            throw new Error(
                `Value for "${propertyName}" cannot be stringified for storage: ${err.message}`
            );
        }

        try {
            const probe = `${PREFIX}__quota_test__`;
            localStorage.setItem(probe, json);
            localStorage.removeItem(probe);
        } catch (err) {
            if (err.name === "QuotaExceededError") {
                throw new Error(
                    "Saving this value would exceed the browsers localStorage quota (this is usually around 5 MB)."
                );
            }
        }

        isStorable(propertyName, value);

        localStorage.setItem(target._key(propertyName), json);
        return true;
    },

    /**
     * @param {Storage} target
     * @param {String} propertyName
     * @returns
     */
    deleteProperty(target, propertyName) {
        localStorage.removeItem(target._key(propertyName));
        return true;
    },
});
export { storage };
