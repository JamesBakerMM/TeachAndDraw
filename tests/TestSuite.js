export class TestSuite {
    constructor() {
        this.storedCanvas = null;
        this.results = [];
    }

    message(message){
        this.results.push({test:message, passed:undefined})
    }

    simulateKeyDown(targetElement,key){
        const keyDownEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: key,
            code: `Key${key.toUpperCase()}`,
            keyCode: key.toUpperCase().charCodeAt(0),
            charCode: key.toUpperCase().charCodeAt(0),
            which: key.toUpperCase().charCodeAt(0),
        });
        targetElement.dispatchEvent(keyDownEvent);
    }
    simulateKeyPress(targetElement,key){
        this.simulateKeyDown(targetElement,key);
        
        setTimeout(() => {
            console.log(targetElement,key);
            console.log("event time");
            const keyUpEvent = new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                key: key,
                code: `Key${key.toUpperCase()}`,
                keyCode: key.toUpperCase().charCodeAt(0),
                charCode: key.toUpperCase().charCodeAt(0),
                which: key.toUpperCase().charCodeAt(0),
            });
            targetElement.dispatchEvent(keyUpEvent);
        }, 2000);

    }
    simulateMouseMove(targetElement, x, y) {
        const mouseMoveEvent = new MouseEvent('mousemove', {
            bubbles: true,   
            cancelable: true, 
            clientX: x,      
            clientY: y,       
        });
        targetElement.dispatchEvent(mouseMoveEvent);
    }
    simulateMouseClick(targetElement, x, y) {
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
        });
        targetElement.dispatchEvent(mouseDownEvent);
    
        setTimeout(() => {
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
            });
            targetElement.dispatchEvent(mouseUpEvent);
        }, 100);
    }
    simulateTouchStart(targetElement, x, y) {
        const touchStartEvent = new TouchEvent('touchstart', {
            bubbles: true,
            cancelable: true,
            touches: [new Touch({
                identifier: Date.now(),
                target: targetElement,
                clientX: x,
                clientY: y,
                radiusX: 2.5,
                radiusY: 2.5,
                rotationAngle: 0,
                force: 0.5,
            })]
        });
        targetElement.dispatchEvent(touchStartEvent);
    }
    simulateTouchEnd(targetElement, x, y) {
        this.simulateTouchStart(targetElement,x,y);
        
        setTimeout(() => {
            const touchEndEvent = new TouchEvent('touchend', {
                bubbles: true,
                cancelable: true,
                changedTouches: [new Touch({
                    identifier: Date.now(),
                    target: targetElement,
                    clientX: x,
                    clientY: y,
                    radiusX: 2.5,
                    radiusY: 2.5,
                    rotationAngle: 0,
                    force: 0.5,
                })]
            });
            targetElement.dispatchEvent(touchEndEvent);
        }, 2000);
        
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
                console.info(msg.toUpperCase())
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
