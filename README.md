
# DRAFTNAME Workout.js
## *A Simplified Canvas Library for learning to Code*
This library is a small canvas library providing a set of drawing commands, asset loading commands, math functions and some basic 2d colliders. It is designed from the ground up for educational use.

It is also it should be noted a reaction to p5 and p5.play. I have taught for a course using these 2 libraries multiple times since 2020 for Griffith University, as well as run 4, 2 week long gamejams using various versions of p5.play. 

While I think p5 and p5.play are excellent teaching tools I feel they suffer from feature creep leading to large instruction sets that are intimidating to new students. By contrast this library is focused on a limited command set to reduce initial complexity.

## Core Principles
- **Consistency is valuable** it is a great feeling when new assuming how something works and being correct based on prior experience. Below are some examples of how that influences the library design:
	-  Anything that uses x,y has those as the first 2 parameters. 
	-  All shapes are drawn from their center point.
	- There is a basic set of maths instructions that only uses degrees, the whole library works in degrees, no need for radians.
	-  Unlike canvas, degrees 0 starts from the top rather than the right so students can use a 360 degree protractor as a quick reference mentally with no additional steps.
- **Errors need to occur close to the source of the issue**,  this requires type checks and other measures throughout to provide feedback when something breaks as close to the problem as we can. 
-  **Familiarity builds confidence, confidence builds engagement, engagement builds learning** a second reason for the limited instruction set is it will allow students to gain awareness of all of the options of the library quite quickly and be able to build a good understanding of the tools they have access to for solving problems.
- Controversially this library **also disables several core features of js** such as .reduce, .filter, .map (there will be a [full list provided](www.github.com/jamesBakerMM)). This library is  purely as an educational tool with a limited instruction set. If you feel you need these features so your students can have access to more ways to solve problems p5 and p5.play may be a more suitable choice for your hypothetical course :).
## Getting Started
    git clone https://www.github.com/JamesBakerMM/nolinkyet
something something change the main.js file to see changes

[Demo Video](www.github.com/jamesBakerMM) - You can watch a video tutorial on how to get started here! :)

## Documentation
**Core**- basic drawing commands
- [pen](www.github.com/jamesBakerMM) - the core everything builds from, his controls the canvas and holds all the other command sets.
- [colour](www.github.com/jamesBakerMM) - controls the colours of things
- [shape](www.github.com/jamesBakerMM) - controls the drawing of various shapes and some config options
- [text](www.github.com/jamesBakerMM) - controls the drawing of to the screen and has some config options

**Entities** - objects that maintain their own x and y properties
- [img](www.github.com/jamesBakerMM) - 
- [collider](www.github.com/jamesBakerMM) - 
- [animation](www.github.com/jamesBakerMM) - 

**Controls** - sfsd
- [mouse](www.github.com/jamesBakerMM) - 
- [keyboard](www.github.com/jamesBakerMM) - 

**Media** - sfsd
- [sound](www.github.com/jamesBakerMM) - 
- [video](www.github.com/jamesBakerMM) - 
## License
something something GPL 3.0 something something complete
