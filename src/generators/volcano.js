import { SimplexNoise } from "simplex-noise";
import { COLORS, randColor, randInt, rgba, hsla } from "../utils/util"
const FastSimplexNoise = require("fast-simplex-noise/fast-simplex-noise");

export default class Volcano {
    constructor() {
        this.color = undefined;

    }

    static isIterable = false;
    static title = "Volcano";

    setup(painter, options) {
        this.noise = new FastSimplexNoise({ amplitude: .5, frequency: .6, octaves: 8, persistence: .4 });
        this.painter = painter;

        this.horizon = this.painter.h / 1.3;
        this.maxHeight = 200;
        this.volcanoSize = randInt(75, 250);
        this.volcanoTop = randInt(25, 75);
        this.volcanoX = randInt(this.volcanoSize, this.painter.w - this.volcanoSize);

        this.streamers = randInt(75, 200);
    }

    paint(painter, options) {
        this.paintSky();
        this.paintMounts();
        this.paintStreamers();
        this.drawOcean();
    }

    paintSky() {
        for (let y = 0; y < 300; y++) {
            let color = { h: randInt(5,30), s: 100, l: randInt(1, 10), a: .05 }
            this.painter.setFill(color);
            this.painter.setStroke({ r: 0, g: 0, b: 0, a: 0 }, 0);

            let size = randInt(Math.max(this.painter.w, this.painter.h));

            this.painter.makeCircle(randInt(0, this.painter.w), randInt(0, this.painter.h), size)
        }
    }

    paintOcean() { }

    paintStreamers() {
        this.painter.setFill();
        for (let i = 0; i < this.streamers; i++) {
            let color = hsla(randInt(25, 30), 100, 50, .3);

            const startX = randInt(this.volcanoX - this.volcanoTop / 2, this.volcanoX + this.volcanoTop / 2);            
            const startY = this.getHeightAt(startX);
            const endX = startX + randInt(-this.volcanoTop * 2, this.volcanoTop * 2);
            const endY = Math.min(this.getHeightAt(endX), startY + randInt(-200, 300));
            const controlX = startX;
            const controlY = startY - randInt(100, 400);

            this.painter.setStroke(color, 1)
            this.painter.makeCurve(startX, startY, endX, endY, controlX, controlY);
        }
    }

    getHeightAt(x) {
        return this.horizon - (Math.max(0, Math.min(this.volcanoSize, (this.volcanoTop + this.volcanoSize) - Math.abs(x - this.volcanoX))) + ((this.noise.get2DNoise(x / 400, 1) * .5 + .5) * this.maxHeight));
    }

    paintMounts() {
        let color = COLORS.black;

        let pnts = [];
        for (let x = 0; x < this.painter.w; x++) {
            pnts.push({ x, y: this.getHeightAt(x) });
        }

        pnts.push({ x: this.painter.w, y: this.horizon });
        pnts.push({ x: 0, y: this.horizon });

        this.painter.setFill(color);
        this.painter.setStroke(COLORS.transparent);

        this.painter.makePath(pnts);
    }

      
}