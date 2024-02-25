export class Paint {
        static clear = "rgba(0,0,0,0)";
        static white={
            warm:[
                "#fbf1e5",
                "#fff3e5",
                "#f5f4ef",
                "#feeff2"
            ],
            cool:[
                "#f9f9f9",
                "#ecf2f0",
                "#f6f7f9",
                "#e7e9f6"
            ]
        };
        static black={
            warm:[
                "#150c0d",
                "#0e0b0e",
                "#100e0d"
            ],
            cool:[
                "#05050f",
                "#06060a",
            ]
        }
        static blue={
            pale:[
                "#a8b6dd",
                "#b3c1f2"
            ],
            mid:[
                "#3199a4",
                "#437fb1",
                "#40448e"
            ],
            dark:[
                "#031630",
                "#121429",
                "#0b0c21"
            ]
        }
        static aqua={
            pale:[
                "#b0fff5",
                "#81ecf2",
                "#37c2df",
            ],
            mid:[
                "#3ca3c6",
                "#72d8c0",
                "#2ee2b5",
            ],
            dark:[
                "#3c6d74",
                "#132c54"
            ]
        }
        static grey={
            pale:[
                "#eceff3",
                "#cac0e3",
                "#cbbac4",
            ],
            mid:[
                "#605752",
                "#4c4c4c",
                "#3e3645",
            ],
            dark:[
                "#342522",
                "#292931",
                "#232126"
            ]
        }
        static green={
            pale:[
                "#92d2af",
                "#f3ffab",
                "#ecf872"
            ],
            mid:[
                "#6cab52",
                "#89cf52",
                "#5ac632"
            ],
            dark:[
                "#408a6f",
                "#318527",
                "#446808"
            ]
        }
        static pink={
            pale:[
                "#f4d0de",
                "#fd969a",
                "#faaeb2"
            ],
            mid:[
                "#e4007b",
                "#cd337b",
                "#f250a5",
            ],
            dark:[
                "#501028",
                "#990033"
            ]
        }
        static red={
            pale:[
                "#f46c70",
                "#e93a29",
                "#e52532",
            ],
            mid:[
                "#a7202f",
                "#ad1f1e",
                "#ac2826",
            ],
            dark:[
                "#401117",
                "#55080e",
                "#711112",
            ]
        }
        static purple={
            pale:[
                "#eac5f9",
                "#cd80e0",
                "#e48fea",
            ],
            mid:[
                "#c23667",
                "#91155e",
                "#7849a5",
            ],
            dark:[
                "#561928",
                "#270f33",
            ]
        }
        static brown={
            pale:[
                "#eac1ad",
                "#f9a581",
                "#bc6055",
            ],
            mid:[
                "#97776c",
                "#8a4c51",
            ],
            dark:[
                "#382a2a",
                "#5b1d04"
            ]
        }
        static yellow={
            pale:[
                "#fae79b",
                "#e7c891",
                "#eadfbf",
            ],
            mid:[
                "#ffd744",
                "#eeb54a",
                "#f9b234"
            ],
            dark:[
                "#8a450a",
                "#bd821a"
            ]
        }
        static orange={ 
            pale:[
                "#ffd8b7",
                "#f7d4b8",
                "#f4d8c2"
            ],
            mid:[ 
                "#ef7b56",
                "#f46d35",
                "#f8651f"
            ],
            dark:[
                "#c7371d",
            ]
        }
        static draw(pen) {
            //temp gpt generated garbage
            const ctx=pen.context
            const squareSize = 10;
            const padding = 5;
            let x = 100+padding;
            let y = padding;
            const lineHeight = 15; // Height for the text labels
    
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas before drawing
    
            Object.keys(this).forEach(color => {
                const shades = this[color];
                ctx.fillStyle = '#FFFFFF'; // Set the font color
                ctx.fillText(color.toUpperCase(), x, y + lineHeight); // Draw the label for the color category
    
                y += lineHeight + padding; // Move down to start drawing squares
    
                Object.keys(shades).forEach(shadeKey => {
                    shades[shadeKey].forEach(hex => {
                        ctx.fillStyle = hex;
                        ctx.fillRect(x, y, squareSize, squareSize);
                        x += squareSize + padding; // Move right for the next square
                    });
    
                    y += squareSize + padding; // Move down after a row of shades
                    x = 100+padding; // Reset x to the leftmost position after each row
                });
    
                y += padding; // Extra padding after each color category
            });
        }
}