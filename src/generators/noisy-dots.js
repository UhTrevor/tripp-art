import { SimplexNoise } from "simplex-noise";
import { COLORS, randColor, randInt } from "../utils/util" 

export default class Lines {
    constructor() {
        this.color = undefined;
       
    }

    static isIterable = true;
    static title = "Noisy Dots";

    setup(painter, options) {
        this.color = randColor();

        this.pos = { x: 0, y: 0 };
        this.inc = 40;
        this.max = { x: painter.w / this.inc, y: painter.h / this.inc };
        this.maxSize = 20;
        this.colorDivisor = randInt(0, 32);
        this.sizeDivisor = randInt(0, 32);

        this.noise = new SimplexNoise();
        painter.setStroke(COLORS.transparent);
        painter.clear(COLORS.black);
    }

    paint(painter, options) {
        if (this.pos.y > this.max.y) {
            return true;
        }
        
        this.pos.x++;
        if (this.pos.x > this.max.x) {
            this.pos.x = 0;
            this.pos.y++;
        }

        const size = (this.noise.noise2D(this.pos.x / this.sizeDivisor, this.pos.y / this.sizeDivisor) * .5 + .5) * this.maxSize;

        painter.setFill({ h: (this.noise.noise2D(this.pos.x / this.colorDivisor, this.pos.y / this.colorDivisor) * .5 + .5) * 360, s: 100, l:50, a: 1});
        painter.makeCircle(this.pos.x * this.inc, this.pos.y * this.inc, size);
    }
}