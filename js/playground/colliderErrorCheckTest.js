import { $ } from "../../lib/TeachAndDraw.js";

$.use(update);

const grp = $.makeGroup();
grp.push(1);

const emptyGrp = $.makeGroup();
emptyGrp.name = "empty";

const goodGrp = $.makeGroup();
goodGrp.push($.makeBoxCollider(20, 20, 20, 20));
goodGrp.push($.makeBoxCollider(50, 20, 20, 20));
goodGrp.push($.makeBoxCollider(80, 20, 20, 20));
goodGrp.name = "good";

const otherGoodGrp = $.makeGroup();
otherGoodGrp.push($.makeBoxCollider(50,50,20,20));

const sampleCollider = $.makeCircleCollider(20, 20, 20);

grp.name = "hi";
$.debug = true;
function update() {
    if($.frameCount === 1) {
        try {
            if(emptyGrp.overlaps(sampleCollider)){

            }
            // emptyGrp.overlaps(1);
            emptyGrp.draw();
            sampleCollider.draw();
            goodGrp.draw();
            // goodGrp.overlaps({thingHolder:{collider:sampleCollider}});
            if (goodGrp.overlaps(sampleCollider)) {
                console.log("woo");
            }
            if (emptyGrp.overlaps(sampleCollider)) {
                //this should be fine
            }

            goodGrp.overlaps(goodGrp);
            goodGrp.overlaps(otherGoodGrp);
            emptyGrp.overlaps(goodGrp);
            // if(grp.overlaps(sampleCollider)){
            //     console.log("woo");
            // }
        } catch (err) {
            console.error(err);
        }
    }
}
