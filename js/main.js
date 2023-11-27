function setup() {
    // Example setup code
    pen.canvas.width=1200;
    pen.canvas.height=1200;
}

let x = 0;
function draw() {
    // Example drawing code
    pen.shape.rectangle(0,0,pen.canvas.width,pen.canvas.height);
    pen.colour.fill="red";
    pen.shape.rectangle(x,200,100,50);
    pen.shape.oval(200, 100, 50, 30); // Draws an oval
    pen.shape.line(300, 50, 400, 150); // Draws a line

    x += 1; // Move the circle
    if (x > pen.canvas.width)  {
        x = 0; // Reset position
    }
}
