# TeachAndDraw
##
Please Note TeachAndDraw is under active development.
This JavaScript library has been developed as a teaching and learning tool and is deliberately simple, to minimise the mental overhead while learning programming. The aim of this library is to provide a set of easy to use functions to draw shapes and images onto a HTML5 Canvas, while providing support for loading resources, handling various native events and providing simple 2D physics.

The original concept was inspired by the [P5js](https://p5js.org/) and [P5Play](https://p5play.org/) libraries, but with a more controlled and consistent feature set. We felt that the P5 libraries have suffered from scope creep over time, which has led to them straying from the original design, and introducing inconsistencies as developers changed. The design choices within this library have a focus on making it easy for new programmers to understand, allowing simple code to produce interesting and complex applications.

Despite providing error checking and additional layers of abstraction, being lightweight and performant is still important for us, as we need to cater for low-end hardware that students often have access to. 

## Core Principles
### Consistency supports learning
Consistent patterns of behaviour help learners build a more accurate mental model, and their confidence as coders.

The most significant impact this has on the design of TeachAndDraw is that the library has a limited instruction set. This allows learners to become familiar with all of their options and build a good understanding of the tools available for solving problems.

Other elements of TeachAndDraw that support consistency include:

- If a function takes x, y coordinates as parameters, they will be the first 2 parameters.
- All shapes are drawn from their centre point.
- All visual entities (images, animations, colliders) use the same properties.
- The in-built maths library uses degrees for all angle mathematics; and 0 degrees is at the top of a shape. This is to take advantage of recent high school grads’ prior mathematics experience.

### Errors need to occur close to the source of the issue
We use runtime type checking and detailed error messages throughout the library to give learners quick feedback close to where errors occur. This means they can both address the error and learn from it.

### Performance matters
Students are famously poor. Many learners will be working on low-power, low-RAM and/or older computers. TeachAndDraw has been optimised for performance to support users on a wider range of hardware.

### Code doesn’t have to rot
TeachAndDraw has no dependencies and is written in raw JavaScript to facilitate this. 

## Getting Started
TeachAndDraw is still under development and isn’t ready to be used yet. 

While a good chunk of the library is functional and able to be used, there are many known bugs that are listed to be fixed, and some core features missing. This means that while it is under development, there may be structural and namespace changes that would break applications built on the current version.

## Documentation
Please refer to our [current student facing API](https://learntad.com/).
