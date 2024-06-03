import { $, shape, colour, mouse, keys, text } from "../../lib/Pen.js";

$.use(draw);

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
let nodes = [];
function setup() {
    if (doneSetup === false) {
        stream = file.join("\n");
        scanner = new Scanner(stream);
        scanner.scan();
        parser = new Parser(scanner.tokens);
        nodes = parser.parse();
        // console.log(parser.parse());
        nodes[0].x = $.w / 2;
        nodes[0].y = $.h / 2;
        nodes[0].w = 250;
        nodes[0].h = 50;
        doneSetup = true;
    }
}

function draw() {
    setup();
    $.paused = true;
    console.log("kjhsdfkds|", nodes);
    for (const node of nodes) {
        if (node) {
            node.draw();
        }
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
        console.log("Making", this.peek().type);
        const startToken = this.advance();
        const attributes = startToken.attributes;
        const children = [];
        let result;

        if (startToken.type === "STRUCTURAL_OPEN") {
            switch (startToken.lexeme) {
                case "list":
                    console.log("make a list dumbass");
                    result = new ListNodes(0, 0, $.w, $.h);
                    result.attributes; //get and fill with attributes
                    break;
            }
        } else if (this.peek().type === TokenType.TEXT) {
            let textToken = this.advance();
            startToken.value = textToken.lexeme;
            result = new TextNodes(0, 0, $.w, $.h, textToken.lexeme);
        } else {
            result = new ContentNode(startToken.lexeme, attributes, children);
        }

        while (!this.checkType(END_TOKEN_TYPE) && !this.isAtEnd()) {
            children.push(this.parseNode());
        }

        result.children = children;

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

//eventually build a node manager with a query selector

class Nodes {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.calcedH = h;
        this.children = [];
        this.attributes = [];
        this.parent = null;
        this.type = "node";
    }
    draw(x = this.x, y = this.y, maxW = this.w, maxH = this.h) {
        for (let child of this.children) {
            child.draw(x, y, maxW, maxH);
        }
    }
}

class BoundingBox{
    constructor(x,y,w,h){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
    }
    adjustXPadding(value){

    }
    adjustYPadding(value){

    }
}

class ListNodes extends Nodes {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.type = "list";
    }
    draw(x = this.x, y = this.y, maxW = this.w, maxH = this.h) {
        let x_offset = 0;
        let y_offset = 0;
        $.colour.fill = "rgba(255,255,255,0.5)";
        $.shape.rectangle(x, y, maxW, this.calcedH);
        //if attribute padding set
            //offset x start
            //offset y start
            //slightly reduce maxW
            //slightly reduce maxH
        for (let child of this.children) {
            child.draw(x + x_offset, y + y_offset, maxW, maxH);
            y_offset += child.h;
        }
        this.calcedH=y_offset;
        this.h=y_offset;
    }
}

class TextNodes extends Nodes {
    constructor(x, y, w, h, content) {
        super(x, y, w, h);
        this.content = content;
        this.colour = "black";
        this.style = "normal";
        for (let attribute of this.attributes) {
            console.log(attribute);
            //get the key
            const key = "";
            const value = "";
            if (this[key]) {
                this[key] = value;
            }
        }
        this.type = "text";
        //loop attributes
        //update any relevant matches!
    }
    draw(x = this.x, y = this.y, maxW = this.w, maxH = this.h) {

        $.text.alignment.x="left";
        $.text.alignment.y="top";
        $.shape.alignment.x="center";
        $.shape.alignment.y="top";
        console.log("size",$.text.size);
        maxH = $.text.size*1.2;
        //if attribute padding set
            //offset x start
            //offset y start
            //slightly reduce maxW
            //slightly reduce maxH
        //adjust the maxW and maxH for padding if padding set
        //calculate h based on the width and current font size an update the font
        $.colour.fill = "rgba(0,0,0,0)";
        $.shape.rectangle(x, y, maxW, maxH);
        $.colour.fill = "black";
        $.text.print(x-maxW/2, y, this.content);
        this.h=$.text.size*1.2;
    }
}