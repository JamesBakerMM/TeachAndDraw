import { $, shape, colour, mouse, kb, text } from "../../lib/Pen.js";

$.start(draw);

const file = $.loadTextFile("./data/fakeml.fakexml");
let stream;
// $.debug = true;

$.w = 800;
$.h = 800;

let doneSetup = false;
let scanner;
let parser;
let renderer;
let screen;
function setup() {
    if (doneSetup === false) {
        stream = file.join("\n");
        scanner = new Scanner(stream);
        scanner.scan();
        parser = new Parser(scanner.tokens);
        console.log(parser.parse());
        doneSetup = true;
    }
}

function draw() {
    setup();
    for(let node of nodes){
        node.draw();
    }
}

class Token {
    constructor(type, lexeme, literal, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }

    toString() {
        return `${this.type}  ${this.lexeme}  ${this.literal}`;
    }
}

const TokenType = {
    STRUCTURAL_OPEN: "STRUCTURAL_OPEN",
    STRUCTURAL_CLOSE: "STRUCTURAL_CLOSE",
    STRUCTURAL_CLOSE_END: "STRUCTURAL_CLOSE_END",
    INTERACTIVE_OPEN: "INTERACTIVE_OPEN",
    INTERACTIVE_OPEN_END: "INTERACTIVE_OPEN_END",
    INTERACTIVE_CLOSE: "INTERACTIVE_CLOSE",
    CONTENT_OPEN: "CONTENT_OPEN",
    CONTENT_OPEN_END: "CONTENT_OPEN_END",
    CONTENT_CLOSE: "CONTENT_CLOSE",
    GRID_OPEN: "GRID_OPEN",
    GRID_CLOSE: "GRID_CLOSE",
    LIST_OPEN: "LIST_OPEN",
    LIST_CLOSE: "LIST_CLOSE",
    TEXT_OPEN: "TEXT_OPEN",
    TEXT_CLOSE: "TEXT_CLOSE",
    IDENTIFIER: "IDENTIFIER",
    TEXT: "TEXT",
    EOF: "EOF",
};

class Scanner {
    constructor(source) {
        this.source = source;
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
    }

    scan() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    }

    isAtEnd() {
        return this.current >= this.source.length;
    }

    scanToken() {
        let char = this.advance();
        switch (char) {
            case "<":
                this.handleTag();
                break;
            case "[":
                this.handleStructuralTag();
                break;
            case "(":
                this.handleInteractiveTag();
                break;
            // Add more cases as necessary
            default:
                if (this.isWhitespace(char)) {
                    // Ignore whitespace or handle as needed
                } else {
                    this.handleText();
                }
                break;
        }
    }

    handleTag() {
        let attributes = {};
        let isClosingTag = this.match("/");
        let tagContent = this.consumeUntil(">");
        let tagName = tagContent.split(/\s+/)[0]; // Extract tag name
        attributes = this.extractAttributes(
            tagContent.substring(tagName.length).trim()
        );

        if (isClosingTag) {
            this.addToken(TokenType.CONTENT_CLOSE, tagName, attributes);
        } else {
            this.addToken(TokenType.CONTENT_OPEN, tagName, attributes);
        }
    }

    handleStructuralTag() {
        let attributes = {};
        let isClosingTag = this.match("/");
        let tagContent = this.consumeUntil("]");
        let tagName = tagContent.split(/\s+/)[0]; 
        attributes = this.extractAttributes(
            tagContent.substring(tagName.length).trim()
        );

        if (isClosingTag) {
            this.addToken(TokenType.STRUCTURAL_CLOSE, tagName, attributes);
        } else {
            this.addToken(TokenType.STRUCTURAL_OPEN, tagName, attributes);
        }
    }

    handleInteractiveTag() {
        let attributes = {};
        let isClosingTag = this.match("/");
        let tagContent = this.consumeUntil(")");
        let tagName = tagContent.split(/\s+/)[0]; // Extract function name
        attributes = this.extractAttributes(
            tagContent.substring(tagName.length).trim()
        );

        if (isClosingTag) {
            this.addToken(TokenType.INTERACTIVE_CLOSE, tagName, attributes);
        } else {
            this.addToken(TokenType.INTERACTIVE_OPEN, tagName, attributes);
        }
    }

    handleText() {
        let text = this.advanceWhileNot("<", "[", "(");
        this.addToken(TokenType.TEXT, text.trim());
    }

    addToken(type, lexeme = "", attributes = {}, line = this.line) {
        this.tokens.push(new Token(type, lexeme, attributes, line));
    }

    advance() {
        this.current++;
        return this.source.charAt(this.current - 1);
    }

    match(expected) {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) !== expected) return false;

        this.current++;
        return true;
    }

    consumeUntil(char) {
        let start = this.current;
        while (!this.isAtEnd() && this.source.charAt(this.current) !== char) {
            this.advance();
        }
        this.advance(); // Consume the closing char
        return this.source.substring(start, this.current - 1);
    }

    advanceWhileNot(...chars) {
        let start = this.current;
        while (
            !this.isAtEnd() &&
            !chars.includes(this.source.charAt(this.current))
        ) {
            this.advance();
        }
        return this.source.substring(start, this.current);
    }

    extractAttributes(attributeString) {
        let attributes = {};
        for (let attribute of attributeString.split("@")) {
            if (attribute.includes(":")) {
                let [key, value] = attribute.split(":");
                attributes[key] = value;
            }
        }
        return attributes;
    }
    isWhitespace(char) {
        return /\s/.test(char);
    }

    isAlphaNumeric(char) {
        return /^[a-z0-9]+$/i.test(char);
    }
}

class Node {
    constructor(type, attributes = {}, children = []) {
        this.type = type;
        this.attributes = attributes;
        this.children = children;
    }
}

class ContentNode extends Node {
    constructor(type, attributes, children) {
        super(type, attributes, children);
    }
}

class TextNode extends ContentNode {
    constructor(text) {
        super("Text", {}, []);
        this.text = text;
    }
}

class InteractiveNode extends Node {
    constructor(type, attributes, children) {
        super(type, attributes, children);
    }
}

class Button extends InteractiveNode {
    constructor(type, attributes, children) {
        super(type, attributes, children);
    }
}

class Slider extends InteractiveNode {
    constructor(type, attributes, children) {
        super(type, attributes, children);
    }
}

class StructuralNode extends Node {
    constructor(type, attributes, children) {
        super(type, attributes, children);
    }
}

class Grid extends StructuralNode {
    constructor(type, attributes, children) {
        super(type, attributes, children);
    }
}

class List extends StructuralNode {
    constructor(type, attributes, children) {
        super(type, attributes, children);
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    parse() {
        const nodes = [];
        while (!this.isAtEnd()) {
            const result = this.parseNode();
            nodes.push(result);
        }
        return nodes; // This will be an array of top-level nodes.
    }

    parseNode() {
        const token = this.peek();
        switch (token.type) {
            case TokenType.TEXT:
                console.log(token);
                return this.parseTextNode();
            case TokenType.CONTENT_OPEN:
                return this.parseNodesUntil(TokenType.CONTENT_CLOSE);
            case TokenType.STRUCTURAL_OPEN:
                return this.parseNodesUntil(TokenType.STRUCTURAL_CLOSE);
            case TokenType.INTERACTIVE_OPEN:
                return this.parseNodesUntil(TokenType.INTERACTIVE_CLOSE);
            case TokenType.EOF:
                this.current = 1000000000;
                break;
            default:
                throw new Error(`Unexpected token: ${token.type}`);
        }
    }
    parseStructuralNode() { 
        const token = this.advance();
        return new StructuralNode(token.lexeme);
    }
    parseTextNode() {
        const token = this.advance();
        return new TextNode(token.lexeme);
    }

    parseNodesUntil(END_TOKEN_TYPE) {
        console.log("Making",this.peek().type)
        const startToken = this.advance();
        const attributes = startToken.attributes;
        const children = [];
        let result;

        if(startToken.type==="STRUCTURAL_OPEN"){
            switch(startToken.lexeme){
                case "list":
                    console.log("make a list dumbass")
                    result = new ListNodes(0,0,$.w,$.h);
                    result.attributes //get and fill with attributes
                    break
            }
        }else if (this.peek().type === TokenType.TEXT) {
            let textToken = this.advance();
            startToken.value = textToken.lexeme;
            result=new TextNodes(0,0,$.w,$.h,textToken.lexeme)
        } else {
            result=new ContentNode(startToken.lexeme, attributes, children);
        }

        while (!this.checkType(END_TOKEN_TYPE) && !this.isAtEnd()) {
            children.push(this.parseNode());
            
        }

        //if its a structural open
            //add the children

        this.advance();
        return result;
    }

    peek() {
        return this.tokens[this.current];
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.tokens[this.current - 1];
    }

    checkType(type) {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    isAtEnd() {
        return this.current >= this.tokens.length;
    }
}

// class Renderer {
//     constructor(nodes) {
//         this.nodes = nodes;
//         this.currentPathParent = nodes[0]; //way to track back to the parent node working from
//         this.blocks = [];
//     }
//     render() {
//         console.log(this.nodes);
//         console.log("------------------");
//         console.log("------------------");
//         console.log("------------------");

//         let depth = 0;
//         let xOffset = 0; // Horizontal offset for child nodes
//         let yOffset = 200; // Vertical offset to stack nodes
//         for (let node of this.nodes) {
//             if (node) {
//                 this.renderNode(node, depth, xOffset, yOffset);
//                 yOffset += 60;
//             }
//         }
//     }
//     renderNode(node, depth = 0, xOffset = 0, yOffset = 0, parent) {
//         const width = $.w;
//         const height = 50;

//         let values;
//         if (node.value) {
//             this.blocks.push({
//                 x: xOffset,
//                 y: yOffset,
//                 w: width,
//                 h: height,
//                 type: node.type,
//                 parent: parent,
//                 values: node.value,
//             });
//         } else {
//             this.blocks.push({
//                 x: xOffset,
//                 y: yOffset,
//                 w: width,
//                 h: height,
//                 type: node.type,
//                 parent: parent,
//             });
//         }

//         const indent = " ".repeat(depth * 2);

//         switch (node.type) {
//             case "text":
//                 console.log(`${indent}<text>`);
//                 if (node.children.length > 0) {
//                     depth += 1;
//                     let childXOffset = xOffset + 50; // Indent child nodes
//                     let childYOffset = yOffset + height;
//                     for (let child of node.children) {
//                         // Stack child nodes below the parent
//                         this.renderNode(
//                             child,
//                             depth + 1,
//                             childXOffset,
//                             childYOffset,
//                             node
//                         );
//                         childYOffset += 50;
//                     }
//                 }
//                 break;
//             case "Text":
//                 console.log(`${indent}${node.text}`);
//                 break;
//             case "grid":
//                 console.log(`${indent}[grid]`);
//                 if (node.children.length > 0) {
//                     depth += 1;
//                     let childXOffset = xOffset + 10; // Indent child nodes
//                     let childYOffset = yOffset + height;
//                     for (let child of node.children) {
//                         // Stack child nodes below the parent
//                         this.renderNode(
//                             child,
//                             depth + 1,
//                             childXOffset,
//                             childYOffset,
//                             node
//                         );
//                         childYOffset += 50;
//                     }
//                 }
//                 break;
//             case "list":
//                 console.log(`${indent}[list]`);
//                 if (node.children.length > 0) {
//                     depth += 1;
//                     let childXOffset = xOffset + 10; // Indent child nodes
//                     let childYOffset = yOffset + height;
//                     for (let child of node.children) {
//                         // Stack child nodes below the parent
//                         this.renderNode(
//                             child,
//                             depth + 1,
//                             childXOffset,
//                             childYOffset,
//                             node
//                         );
//                         childYOffset += 50;
//                     }
//                 }
//                 break;
//             case "button":
//                 console.log(`${indent}[button]`);
//                 if (node.children.length > 0) {
//                     depth += 1;
//                     let childXOffset = xOffset + 10; // Indent child nodes
//                     let childYOffset = yOffset + height;
//                     for (let child of node.children) {
//                         // Stack child nodes below the parent
//                         this.renderNode(
//                             child,
//                             depth + 1,
//                             childXOffset,
//                             childYOffset,
//                             node
//                         );
//                         childYOffset += 50;
//                     }
//                 }
//                 break;
//             case "slider":
//                 console.log(`${indent}[slider]`);
//                 if (node.children.length > 0) {
//                     depth += 1;
//                     let childXOffset = xOffset + 10; // Indent child nodes
//                     let childYOffset = yOffset + height;
//                     for (let child of node.children) {
//                         // Stack child nodes below the parent
//                         this.renderNode(
//                             child,
//                             depth + 1,
//                             childXOffset,
//                             childYOffset,
//                             node
//                         );
//                         childYOffset += 50;
//                     }
//                 }
//                 break;
//             case "button":
//                 console.log(`${indent}[button]:${node.text}`);
//                 if (node.children.length > 0) {
//                     depth += 1;
//                     let childXOffset = xOffset + 10; // Indent child nodes
//                     let childYOffset = yOffset + height;
//                     for (let child of node.children) {
//                         // Stack child nodes below the parent
//                         this.renderNode(
//                             child,
//                             depth + 1,
//                             childXOffset,
//                             childYOffset,
//                             node
//                         );
//                         childYOffset += 50;
//                     }
//                 }
//                 break;
//         }
//     }
//     renderText() {
//         //work out dimensions first
//         //work out height of a line of text
//         //work out width
//         //{w, h} feed this down to children so they know their parents dimensions
//     }
//     renderList() {}
//     renderGrid() {}
//     renderBlocks() {
//         //for each block etc
//     }
// }

// class Screen {
//     constructor(blocks) {
//         this.y = 0;
//         this.blocks = blocks;
//         console.log(blocks);
//     }
//     drawBlocks() {
//         // console.log(this.blocks)
//         shape.alignment.y = "top";
//         shape.alignment.x = "left";
//         text.alignment.y = "top";
//         text.alignment.x = "left";
//         for (let block of this.blocks) {
//             if (block.type === "list" || block.parent.type === "list") {
//                 $.colour.fill = `green`;
//             } else if (block.type === "grid" || block.parent.type === "grid") {
//                 $.colour.fill = `blue`;
//             } else if (
//                 block.type === "button" ||
//                 block.parent.type === "button"
//             ) {
//                 $.colour.fill = `purple`;
//             } else if (
//                 block.type === "slider" ||
//                 block.parent.type === "slider"
//             ) {
//                 $.colour.fill = `aqua`;
//             } else {
//                 $.colour.fill = `red`;
//             }
//             if (block.parent !== undefined) {
//                 //if it has parents
//                 $.shape.strokeWidth = 0;
//                 $.colour.fill = "rgba(0,0,0,0.5)";
//                 $.colour.stroke = "rgba(0,0,0,0.5)";
//             } else {
//                 $.colour.stroke = "white";
//                 $.shape.strokeDash = 2;
//                 $.shape.strokeWidth = 2;
//             }
//             shape.rectangle(block.x, block.y, block.w, block.h);
//             $.colour.fill = `black`;
//             console.log("block values", block.values);
//             text.print(block.x, block.y, `  ${block.type}`);
//         }
//     }
//     //this
// }

//eventually build a node manager with a query selector

class Nodes {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.calcedH=h;
        this.children = [];
        this.attributes=[];
        this.parent=null;
    }
    draw(x=this.x,y=this.y,maxW=this.w,maxH=this.h){
        //adjust the maxW and maxH for padding if padding set
        for(let child of this.children){
            child.draw(x,y,maxW,maxH)
        }
    }
}

class ListNodes extends Nodes{
    constructor(x, y, w, h) {
        super(x,y,w,h);
    }
    draw(x=this.x,y=this.y,maxW=this.w,maxH=this.h){
        this.calcedH=0;
        let x_offset=10;
        let y_offset=0;
        //adjust the maxW and maxH for padding if padding set
        for(let child of this.children){
            this.calcedH+=child.h;
        }
        $.colour.fill="rgba(255,255,255,0.5)";
        $.shape.rectangle(x,y,maxW,this.calcedH);
        for(let child of this.children){
            child.draw(x+x_offset,y+y_offset,maxW,maxH);
            y_offset+=child.h;
        }
    }
}

class TextNodes extends Nodes{
    constructor(x,y,w,h,content) {
        super(x,y,w,h);
        this.content=content;
        this.colour="black";
        this.style="normal";
        for(let attribute of this.attributes){
            console.log(attribute);
            //get the key
            const key="";
            const value="";
            if(this[key]){
                this[key]=value;
            }
        }
        //loop attributes
            //update any relevant matches!
    }
    draw(x=this.x,y=this.y,maxW=this.w,maxH=this.h){
        //adjust the maxW and maxH for padding if padding set
        //calculate h based on the width and current font size an update the font
        $.colour.fill="rgba(0,0,0,0)";
        $.shape.rectangle(x,y,maxW,maxH);
        $.colour.fill="black";
        $.text.print(x,y,this.content);
    }
}
let nodes=[];

let list= new ListNodes($.w/2,100,$.w,50);

let listItems={}
listItems.one=new TextNodes(list.x,list.y,list.w,list.h,"one");
list.children.push(listItems.one);
listItems.one.parent=list; 

listItems.two=new TextNodes(list.x,list.y,list.w,list.h,"two");
list.children.push(listItems.two);  
listItems.two.parent=list; 

listItems.three=new TextNodes(list.x,list.y,list.w,list.h,"three");
list.children.push(listItems.three);
listItems.three.parent=list; 

nodes.push(list);