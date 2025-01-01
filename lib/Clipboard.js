
export class ClipBoard {
    /** Write text to the clipboard.
     * @param {string} text
     */
    static async write( text ) {
        if (typeof text !== "string") {
            throw new Error(`text must be a string, you supplied a ${typeof text}!`);
        }
        await navigator.clipboard.writeText(text);
    }

    /** Write text to the clipboard.
     * @param {string} text
     */
    async write(text){
        return ClipBoard.write(text);
    }

    /** Read text from the clipboard.
     * @returns {Promise<string>} previously written string
     */
    async read() {
        if (document.hasFocus()) {
            return await navigator.clipboard.readText();
        } else {
            console.error("Failed reading, document not focused");
        }
    }

    /** Clear the clipboard.
     */
    async clear() {
        await ClipBoard.write("");
    }
}
