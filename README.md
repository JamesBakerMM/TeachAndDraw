
# TeachAndDraw.js
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
## [pen](www.github.com/jamesBakerMM) - the core everything builds from, this controls the canvas and holds all the other command sets. ##
#### Methods: ####
- **loadAnimation(x,y,...paths)**: 
- **loadImage(x,y,filepath)**:
- **loadTextFile(filepath)**: 
- **loadJsonFile(filepath)**: 
- **makeButton(x,y,w,h,label="btn")**: 
- **makeBoxCollider(x,y,w,h)**: sdfsd
- **makeCircleCollider(x,y,d)**: NOT DONE
## [state](www.github.com/jamesBakerMM) - saves and loads drawing states for the program ##
#### Methods: ####
- **save**
- **load**
## [camera](www.github.com/jamesBakerMM) - camera ##
#### Properties: ####
- **x**
- **y**
#### Methods: ####
- **on**
- **off**
## [math](www.github.com/jamesBakerMM) - set of degree based math functions and a few generally handy ones ##
#### Methods: ####
- **sin** works in degrees
- **cos** works in degrees
- **tan** works in degrees
- **atan** works in degrees
- **atan2** works in degrees
- **dist(x1,y1,x2,y2)** returns the dist between 2 points
- **random(firstVal,secondVal)** returns a random number
- **rescaleNumber(num,inMin,inMax,outMin,outMax)** rescales a number from one range to another
## [colour](www.github.com/jamesBakerMM)  - controls the colours of things ##
- #### Properties: ####
    - **fill**
    - **stroke**
## [shape](www.github.com/jamesBakerMM) - controls the drawing of various shapes and some config options ##
#### Properties: ####
- **xAlignment** ❓changes the origin point on x axis, valid values are: "left","center","right", considered for removal!
- **yAlignment** ❓same as above, considered for removal!
- **strokeWidth** takes an int sets the strokeWidth/strokeWeight that heavy
#### Methods: ####
- **rectangle(x,y,w,h)** - draws a rectangle, origin point adjustable by x and y alignment
- **oval(x,y,w,h)** - draws a oval at given coords
- **line(xStart, yStart, xEnd, yEnd)**
- **multiline(...coords)** draws a set of lines from point to point if given a sequence of x,y pairs
- **polygon(...coords)** name needs to be changed to polygon or something
- **arc(x, y, w, h, startAngle, endAngle)** 

  
## [text](www.github.com/jamesBakerMM) - controls the drawing of to the screen and has some config options ##
#### Properties: ####
- **alignment** ["left","center","right"]
- **baseline** ["top","middle","bottom","alphabetic"]
- **size** 
- **font**
#### Methods: ####
- draw(x,y,content,maxWidth)

# **Entities** - objects that maintain their own x and y properties #
- ##  [img](www.github.com/jamesBakerMM) actually a wrapper around an asset behind the scenes ## 
    - #### Properties: ####
        - id
        - w
        - h
        - rotation
    - #### Methods: ####
        - draw()
- ## [boxCollider && circleCollider](www.github.com/jamesBakerMM) ##
    - #### Properties: ####
        - id
        - velocity
        - mass
        - bounciness
        - prevX
        - prevY
        - x
        - y
        - h
        - w
        - rotation
        - attachment: an attached asset, like an img or animation
    - #### Methods: ####
        - draw()
        - collides()
        - overlaps()
        - pointInCollider
- ## [animation](www.github.com/jamesBakerMM) (extends array) ##
    - #### Properties: ####
      - **delay:** int 
      - **length:** int
      - **frame** int
      - **looping** boolean 
      - **x** int 
      - **y** int 
      - **w** int 
      - **h** int 
      - **playing** boolean 
      - **rotation** int 
    - #### Methods:
        - **progressFrame():int**
# **Controls** #
- ## [mouse](www.github.com/jamesBakerMM) ##
    - #### Properties:
        - x
        - y
        - prevX
        - prevY
      - **position:** Point Instance
      - **previous:** Point Instance
      - **isPressed:** boolean


- ## [keyboard](www.github.com/jamesBakerMM) ## 
- #### Methods:  ####
    - **pressed(key):boolean**
    - **down(key):boolean**
    - **howLongDown(key):int**

# **Media** #
- ## [sound](www.github.com/jamesBakerMM) ##  
    - #### Properties:  ####
        - isPlaying
        - time
        - volume
    - #### Methods:  ####
        - play
        - stop 
        - loop
        - pause
        - goto
- ## [video](www.github.com/jamesBakerMM) ##
    - #### Properties:  ####
        - x
        - y
        - w - not settable
        - h - not settable
        - rotation
        - scale - % scale
        - isPlaying
        - time
        - volume
    - #### Methods:  ####
        - play
        - stop
        - loop
        - pause
        - goto
## [group](www.github.com/jamesBakerMM) (extends array) - dynamic single type array with automated clean up for marked entries ##
- #### Properties:  ####
    - length
- #### Methods:  ####
    - **cleanup**: removes objects that have .remove===true
    - **push**: typechecks
    - **unshift**: typechecks
    - **draw**: typechecks
    - **overlaps**: typechecks
    - **collides**: typechecks
    - **getRandomEntry**: returns random entry
## License
To Be Determined
