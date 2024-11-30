

export class Performance {

    /**
     * 
     * @param {Function} work 
     * @returns {number} Milliseconds elapsed.
     */
    static measureExecutionTime( work ) {
        const A = performance.now();
        work();
        const B = performance.now();
        return B - A;
    }


    /**
     * @returns {boolean}
     */
    static groupFasterThanArray( pen ) {
        let G0 = pen.makeGroup();
        let G1 = pen.makeGroup();

        const COLLIDERS = 512;

        for (let i=0; i<COLLIDERS; i++) {
            const A = pen.makeCircleCollider(
                pen.math.random(0, pen.width), pen.math.random(0, pen.width), pen.math.random(8, 16)
            );

            A.velocity.x = pen.math.random(-16, +16);
            A.velocity.y = pen.math.random(-16, +16);
            A.friction = 0.025;

            A.fill = "rgb(150, 255, 150)";

            G0.push(A);
        }

        {
            const R0 = pen.makeBoxCollider(10, pen.h/2, 20, pen.h);
            const R1 = pen.makeBoxCollider(pen.w-10, pen.h/2, 20, pen.h);
            const R2 = pen.makeBoxCollider(pen.w/2, 10, pen.w, 20);
            const R3 = pen.makeBoxCollider(pen.w/2, pen.h-10, pen.w, 20);

            R0.static = true;
            R1.static = true;
            R2.static = true;
            R3.static = true;

            G1.push(R0, R1, R2, R3);
        }

        const msGroups = Performance.measureExecutionTime(() => {
            G0.collides(G0);
            G0.collides(G1);
        });

        const msArrays = Performance.measureExecutionTime(() => {
            for (let ball1 of G0) {
                for (let ball2 of G0) {
                    ball1.collides(ball2);
                }

                for (let wall of G1) {
                    ball1.collides(wall);
                }
            }
        });

        console.log(`Groups: ${msGroups} milliseconds`);
        console.log(`Arrays: ${msArrays} milliseconds`);

        // delete G0; ??
        // delete G1; ??

        return (msGroups < msArrays);
    }

}



