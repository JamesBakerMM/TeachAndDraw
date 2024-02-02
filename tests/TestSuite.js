export class TestSuite {
    constructor() {
        this.storedCanvas = null;
        this.results = [];
    }

    message(message){
        this.results.push({test:message, passed:undefined})
    }

    assertEqual(a, b, message = "Values are not equal") {
        try {
            if (a !== b) {
                throw new Error(message);
            }
            this.results.push({ test: `${message} | ${a}, ${b}`, passed: true });
        } catch (error) {
            this.results.push({ test: `${message} | ${a}, ${b}`, passed: false});
        }
    }

    assertTrue(func, message = "Condition is not true") {
        try {
            const result = func();
            if (!result) {
                throw new Error(message);
            }
            this.results.push({ test: message, passed: true });
        } catch (error) {
            this.results.push({ test: message, passed: false});
        }
    }
    
    assertFalse(func, message = "Condition is not false") {
        try {
            const result = func();
            if (result) {
                throw new Error(message);
            }
            this.results.push({ test: message, passed: true });
        } catch (error) {
            this.results.push({ test: message, passed: false});
        }
    }
    
    assertError(func, message = "Expected an error to be thrown") {
        try {
            func();
            this.results.push({ test: message, passed: false });
        } catch (error) {
            this.results.push({ test: message, passed: true });
        }
    }

    reportResults() {
        console.log("Test Results:");
        for(let result of this.results){
            let msg=`${result.test}`
            if(result.passed){
                console.log("✅ "+msg);
            } else if(result.passed===undefined) {
                console.log()
                console.log(msg.toUpperCase())
                console.log("------------------------------")
            } else  {
                console.error("❌ "+msg);
            }
        }
    }

    storeCanvasFrame(canvas) {
        const context = canvas.getContext('2d');
        this.storedCanvas = context.getImageData(0, 0, canvas.width, canvas.height);
    }

    compareWithStoredFrame(image) {
        //later
    }
}
