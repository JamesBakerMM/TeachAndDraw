import { $ } from "../../lib/TeachAndDraw.js";
// $.debug = true;

$.use(update);
const slider = $.makeSlider(    
    $.w / 2,
    $.h / 2,
    350
);
slider.min = -10;
slider.value = 50;
slider.max = 100;

const button = $.makeButton(
    $.w/2-200,
    $.h/2,
    100,
    50,
	"Multiple lined button!"
)

const textArea = $.makeTextArea(400, 200, 300, 150);
// const font = $.loadCustomFont("Comic Mono", "fonts/ComicMono.ttf");
// $.text.font = font;
textArea.value = `Write your great message here...`;
function update() {
    button.draw();
    slider.draw();
	textArea.draw();
	$.text.print(400, 300, "Testing!");
	// $.text.print(400, 250, "Testing with max width!", 100);
	textArea.characterLimit = 300;

	$.text.alignment.y = "top";
	$.text.alignment.x = "left";
	$.text.print(100, 50, "Top Left");
	$.text.alignment.x = "center";
	$.text.print(100, 80, "Top Center");
	$.text.alignment.x = "right";
	$.text.print(100, 110, "Top Right");

	//testing wrapping
	$.text.print(450, 50, "Y alignment is top, X is right, this is how it wraps", 150);

	$.text.alignment.y = "center";
	$.text.alignment.x = "left";
	$.text.print(100, 160, "Center Left");
	$.text.alignment.x = "center";
	$.text.print(100, 190, "Center Center");
	$.text.alignment.x = "right";
	$.text.print(100, 220, "Center Right");

	//testing wrapping
	$.text.alignment.x = "left";
	// $.text.print(450, 150, "Y alignment is center, X is left, this is how it wraps", 150);

	$.text.alignment.y = "bottom";
	$.text.alignment.x = "left";
	$.text.print(100, 270, "Bottom Left");
	$.text.alignment.x = "center";
	$.text.print(100, 300, "Bottom Center");
	$.text.alignment.x = "right";
	$.text.print(100, 330, "Bottom Right");

	//testing wrapping
	$.text.alignment.x = "center";
	// $.text.print(450, 250, "Y alignment is bottom, X is center, this is how it wraps", 150);
	// $.text.hyphenation = false;

	$.text.maxWidth = null;
	$.text.print(400, 400, "Incomprehensible and incalculable monstrocities with antidisestablishmentarianismandevenbiggersonextline it's working?", 100);

	$.text.maxWidth = 200;
	$.text.print(400, 500, "Incomprehensible and incalculable monstrocities with antidisestablishmentarianismandevenbiggersonextline it's working?", 100);

}
