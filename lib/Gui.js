import { ShapedAssetEntity } from "./Entity.js";

const THEMES=new Set();
THEMES.add("terminal"),// <win 3.1/terminal looking gui
THEMES.add("retro"),// < old school windows 98 gui
THEMES.add("modern"),// < modern slick looking gui
THEMES.add("medieval")

//guis will have several visual themes enabled
    //each themed set will behave differently and have different core defaults
        //this includes different fonts it sets, font sizes etc
    //the first set should ape windows 98 because it amuses me if they do
    //second set ge
//This class is more like an abstract class laying out some core elements all gui elements share

class Gui extends ShapedAssetEntity {
    static themes = new Set("terminal","retro","modern","medieval");
    #theme; //holds the indication of which theme is enabled
    constructor(x,y,w,h){
        super(x,y,w,h);
        this.#theme = THEMES.RETRO;
    }
    set theme(value){
        if(Gui.themes.has(value)===false){
            throw new Error("GUI THEMES CAN ONLY BE ONE OF THE FOLLOW VALUES");
        }

    }
    get theme(){
        return this.#theme;
    }

}