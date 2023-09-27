import { SimplexNoise } from "simplex-noise";
import { COLORS, randColor, randInt } from "../utils/util"

export default class Lines {
    constructor() {

    }


    static isIterable = true;
    static title = "Noisy Lines";

    setup(painter, options) {
        this.painter = painter;
        this.color = randColor();
        this.iter = 0;
        this.maxIter = 10000;
       
        this.noise = new SimplexNoise();

        this.lines = new Array(5).fill({}).map(() => ({ x: painter.w / 2, y: painter.h / 2 }));
    }

    paint(painter, options) {
        if (this.iter > this.maxIter) {
            return true;
        }
        this.iter++;

        this.lines.forEach((line, index) => this.incAndDrawLine(index, this.iter, line));
    }

    incAndDrawLine(index, iter, line) {
        const nVal = this.noise.noise2D(index, iter / 500);
        const ang = nVal * Math.PI * 2;
        let { x, y } = line;

        x += Math.sin(ang);
        y += Math.cos(ang);

        this.painter.setStroke({h: (nVal * .5 + .5 ) * 360, s: 100, l: 50, a:1 }, 4);

        this.painter.makePath([line, { x, y }]);
        
        line.x = x;
        line.y = y;
    }
}