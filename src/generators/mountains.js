import { randInt, clamp } from "../utils/util";
import { SimplexNoise } from "simplex-noise";

import Painter from "../utils/painter";
const tinycolor = require("tinycolor2");
const FastSimplexNoise = require("fast-simplex-noise/fast-simplex-noise");


export default class Mountians {
    constructor() {
        this.color = undefined;
        this.noise;
        this.painter;
    }

    static isIterable = false;
    static title = "Mountains";
    
    setup(painter, options) {
        this.painter = painter;
        // this.noise = new SimplexNoise();
        this.noise = new FastSimplexNoise({ amplitude: .5, frequency: .6, octaves: 8, persistence: .4 });
        this.nightMode = randInt(0, 1);

        this.steepness = randInt(300, 400);
        this.baseOffset = Math.floor(this.painter.h / 2 + randInt(-100, 100));
        this.maxSize = randInt(100, 300);
        this.layers = randInt(3, 5);
        this.mtnColor = randInt(1, 40);

        this.patternCanvas = document.createElement('canvas');
        this.patternPainter = new Painter(this.patternCanvas, this.painter.w, this.painter.h);
        // document.body.appendChild(this.patternCanvas);
    }

    paint(painter, options) {
        this.paintSky();
        this.paintStars();
        this.paintSun();
        this.paintMnts();
        this.paintTrees();
    }

    paintSky() {
        for (let y = 0; y < 300; y++) {
            let color;
            if (this.nightMode) {
                color = { h: randInt(215, 300), s: 100, l: randInt(0, 10), a: .05 }
            } else {
                color = { h: randInt(260, 340), s: 100, l: randInt(10, 40), a: .05 }
            }
            this.painter.setFill(color);
            this.painter.setStroke({ r: 0, g: 0, b: 0, a: 0 }, 0);

            let size = randInt(Math.max(this.painter.w, this.painter.h));

            this.painter.makeCircle(randInt(0, this.painter.w), randInt(0, this.painter.h), size)
        }
    }

    paintStars() {
        let color = { r: 255, g: 255, b: 255, a: .5 }

        this.painter.setFill(color);
        this.painter.setStroke({ r: 0, g: 0, b: 0, a: 0 }, 0);

        for (let y = 0; y < 300; y++) {
            let size = randInt(4);

            this.painter.makeCircle(randInt(0, this.painter.w), randInt(0, this.painter.h), size)
        }
    }

    paintSun() {
        let max = Math.max(this.painter.w, this.painter.h) * 2;
        let x = randInt(this.painter.w);
        let sunsize = randInt(20, 40);
        let y = this.painter.h - this.getHeight(x, 0);


        if (this.nightMode)
            this.painter.setFill({ h: 250, s: 7, l: 85, a: .02 })
        else
            this.painter.setFill({ h: this.mtnColor, s: 100, l: 70, a: .05 })

        for (let a = 0; a < max;) {
            if (a > sunsize) {
                a *= 1.3;
            } else {
                a += .5;
            }

            this.painter.makeCircle(x, y, a);
        }
    }

    getHeight(x, layer) {
        return (((this.noise.get2DNoise(x / this.steepness, layer) / 2) * .5) * this.maxSize + this.getOffset(layer));
    }

    paintMnts() {
        for (let i = 0; i < this.layers; i++) {
            let pnts = [];
            let max = 0;
            let min = 999999;
            for (let x = 0; x < this.painter.w; x++) {
                let val = this.getHeight(x, i)
                max = Math.max(val, max);
                min = Math.min(val, min);
                pnts.push({ x, y: this.painter.h - val });
            }
            max = Math.floor(max);
            // pnts.push({ y: 100, x: 0 });
            // pnts.push({ y: 0, x: this.painter.w });
            pnts.push({ y: this.painter.h, x: this.painter.w });
            pnts.push({ y: this.painter.h, x: 0 });

            if (i == this.layers - 1) {
                this.painter.setStroke({ h: this.mtnColor, s: 100, l: 0, a: 0 });
                this.painter.setFill({ r: 0, g: 0, b: 0, a: 1 });
            } else {
                this.painter.setStroke({ h: this.mtnColor, s: 100, l: 50, a: 0 });
                //this.painter.setFill({ h: this.mtnColor, s: 100, l: 50, a: 1 });
                this.painter.setFillCustom(this.createFillPattern({ h: this.mtnColor, s: 100, l: 40, a: 1 }, this.painter.w, this.painter.h, this.painter.h - max, this.painter.h - min));
            }

            this.painter.makePath(pnts);

            this.mtnColor -= randInt(25, 50);

            if (this.mtnColor < 0) {
                this.mtnColor += 360;
            }
        }
    }

    getOffset(layer) {
        return this.baseOffset - (layer * (this.painter.h / 2 / this.layers));
    }


    createFillPattern(color, w, h, top, bot) {
        this.patternPainter.clear();
        for (let y = top; y < h; y++) {
            this.patternPainter.setStroke({
                ...color,
                l: this.generateMntColor(color.l, y, top, h),
            }, 2);

            this.patternPainter.makePath([{ x: 0, y: Math.floor(y), }, { x: w, y: Math.floor(y) }])
        }

        this.patternPainter.setStroke({ r: 0, g: 0, b: 0, a: 0 });
        let alphaVar = Math.random() * .01;
        for (let i = 0; i < 5000; i++) {
            const x = randInt(0, w);
            const topr = randInt(bot, bot + 100)
            const y = randInt(topr, topr + 250);
            const size = randInt(20, 50);

            this.patternPainter.setFill({
                ...color,
                l: this.generateMntColor(color.l, y, top, h) + 30,
                a: alphaVar
            });

            this.patternPainter.makeCircle(x, y, size);
        }
        return this.painter.getCtx().createPattern(this.patternCanvas, "no-repeat");
    }

    generateMntColor(color, y, top, h) {
        let scale = ((y - top) / h)
        color = (color * scale) - (this.nightMode ? 40 : 20) + color

        return color;
    }

    paintTrees() {
        const treeCount = randInt(2, 6);
        for (let a = 0; a < treeCount; a++) {
            this.paintTree();
        }
    }

    paintTree() {
        const height = randInt(this.painter.h * .1, this.painter.h * .4);

        const width = randInt(40, 90);
        const x = randInt(this.painter.w);
        const bottom = (this.painter.h - this.getHeight(x, this.layers - 1)) + 50;
        const interations = randInt(15, 20);

        for (let a = 0; a < interations; a++) {
            let ratio = a / interations;

            this.painter.setFill({ r: 0, g: 0, b: 0, a: 1 });

            let pnts = [];
            pnts.push({ x, y: bottom - (height * (ratio + .2)) });

            pnts.push({ x: x - (width * (1 - ratio)), y: bottom - (height * ratio) });
            pnts.push({ x: x + (width * (1 - ratio)), y: bottom - (height * ratio) });

            this.painter.makePath(pnts);
        }

    }
}
