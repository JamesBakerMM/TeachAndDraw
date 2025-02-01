import { $ } from "../../lib/TeachAndDraw.js";  

$.use(update);

const stats = {
    "animal_handling":{
        normal:15,
        hard:7,
        extreme:3
    },
    "charm":{
        normal:15,
        hard:7,
        extreme:3
    },
    "climb":{
        normal:64,
        hard:32,
        extreme:13
    },
    "dodge":{
        normal:32,
        hard:16,
        extreme:6
    },
    "drive_horse/oxen":{
        normal:20,
        hard:10,
        extreme:4
    },
    "fast_talk":{
        normal:60,
        hard:30,
        extreme:12
    },
    "fighting_brawl":{
        normal:25,
        hard:12,
        extreme:5
    },  
    "insight":{
        normal:25,
        hard:12,
        extreme:5
    },
    "listen":{
        normal:30,
        hard:15,
        extreme:6
    },
    "stealth":{
        normal:50,
        hard:25,
        extreme:10
    },
    "spot hidden":{
        normal:25,
        hard:12,
        extreme:5
    },
    "luck":{
        normal:56,
        hard:56,
        extreme:56
    }
}

const skillDrop = $.makeDropdown(150,20,250,Object.keys(stats));

let result = 0;
const sides = 101;
function update() {
    $.colour.fill="black;"
    $.text.size=30;
    $.text.print($.w/2,$.h/2,result.toString());
    if($.mouse.leftReleased) {
        result = Math.floor($.math.random(0,sides));
    }

    $.text.alignment.x="right";
    const bandx=$.w/2-200;
    const normaly=$.h/2+100;
    const hardy=$.h/2+150;
    const extremey=$.h/2+200;
    $.text.print(bandx,normaly,`normal:${stats[skillDrop.value].normal}`);
    $.text.print(bandx,hardy,`hard:${stats[skillDrop.value].hard}`);
    $.text.print(bandx,extremey,`extreme:${stats[skillDrop.value].extreme}`);
    const tempbandx=bandx+50;
    if(result < stats[skillDrop.value].normal) {
        $.text.print(tempbandx,normaly,"✅");
    }
    if(result < stats[skillDrop.value].hard) {
        $.text.print(tempbandx,hardy,"✅");
    }
    if(result < stats[skillDrop.value].extreme) {
        $.text.print(tempbandx,extremey,"✅");
    }
    skillDrop.draw();
}