import { randInt, randIncColor, clamp, randColor, COLORS, createPatternPainter, colorToCss } from "../utils/util"
const FastSimplexNoise = require("fast-simplex-noise/fast-simplex-noise");


export default class Hash {
    constructor() {
        this.color = undefined;
        this.x = 0;
        this.y = 0;
    }


    static isIterable = false;
    static title = "Retro";

    setup(painter, options) {
        this.noise = new FastSimplexNoise({ amplitude: .5, frequency: .6, octaves: 8, persistence: .4 });
        this.painter = painter;

        this.horizon = this.painter.h / 2;
        this.steepness = randInt(300, 400);
        this.layerSize = 50;
        this.min = 50;

        this.perspective = randInt(5, 20);
    }

    paint(painter, options, iteration) {
        this.paintSky();
        this.paintMountians();
        this.paintGround();
        this.paintFloatties();
    }


    paintFloatties() {
        for (let i = 0; i < 30; i++) {
            let color = { h: 276, s: 100, l: randInt(30, 70), a: .3 };
          
            let x = randInt(0, this.painter.w);
            let y = randInt(0, this.painter.h)
            let size = randInt(4, 16);
            let half = size / 2;

            let gradient = this.painter.getCtx().createRadialGradient(x + half, y + half, 0, x + half, y + half, size);
            gradient.addColorStop(0, colorToCss(color));
            gradient.addColorStop(.3, colorToCss(COLORS.transparent));
            gradient.addColorStop(.4, colorToCss(color));
            gradient.addColorStop(.5, colorToCss(COLORS.transparent));

            this.painter.setStroke(COLORS.transparent);
            this.painter.setFillCustom(gradient);
            this.painter.makeRect(x, y, size, size);

        }
    }

    paintGround() {
        let color = { h: 276, s: 100, l: 77, a: .3 };
        this.painter.setFill(color);
        this.painter.setStroke(color, 2);

        let inc = 2;
        for (let y = this.horizon; y < this.painter.h; y += inc) {
            this.painter.makePath([
                { x: 0, y },
                { x: this.painter.w, y }
            ]);
            inc+= (y - this.horizon) / this.perspective;
        }

        for (let x = 0; x < this.painter.w; x += 40) {
            this.painter.makePath([
                { x, y: this.horizon },
                { x: this.getPerspective(x), y: this.painter.h }
            ]);
        }
    }

    getPerspective(x) {
        const mid = this.painter.w / 2
        return x + (this.perspective * (x - mid));


    }

    paintSky() {
        for (let y = 0; y < 300; y++) {
            let color = { h: randInt(270, 315), s: 100, l: randInt(1, 10), a: .05 }
            this.painter.setFill(color);
            this.painter.setStroke({ r: 0, g: 0, b: 0, a: 0 }, 0);

            let size = randInt(Math.max(this.painter.w, this.painter.h));

            this.painter.makeCircle(randInt(0, this.painter.w), randInt(0, this.painter.h), size)
        }
    }

    paintMountians() {
        this.painter.setStroke(COLORS.transparent)
        let colors = [
            { r: 10, g: 0, b: 10, a: 1 },
            { r: 30, g: 10, b: 30, a: 1 },
            { r: 90, g: 70, b: 90, a: .7},

        ];

        for (let i = 3; i > 0; i--) {
            this.painter.setFillCustom(this.getLayerTexture(i, colors[i - 1]));
            this.painter.makePath([
                { x: 0, y: 0 },
                { x: this.painter.w, y: 0 },
                { x: this.painter.w, y: this.horizon },
                { x: 0, y: this.horizon },
            ]);
        }
    }

    getHeight(x, layer) {
        return (((this.noise.get2DNoise(x / this.steepness, layer) / 2) + .5) * this.getOffset(layer));
    }

    getOffset(layer) {
        return layer * this.layerSize + this.min;
    }

    getLayerTexture(layer, color) {
        let texture = createPatternPainter(this.painter.w, this.horizon);
        texture.getCtx().filter = `blur(${layer * 3}px)`;

        texture.setFill({ color});
        let pnts = [];
        for (let x = 0; x < texture.w; x++) {
            let y = this.horizon - this.getHeight(x, layer);
            pnts.push({ y, x });
        }
        pnts.push({ y: this.horizon, x: texture.w });
        pnts.push({ y: this.horizon, x: 0 });

        texture.setFill(color);
        texture.makePath(pnts);

        document.body.appendChild(texture.getCanvas());
        return this.painter.getCtx().createPattern(texture.getCanvas(), "no-repeat");
    }
}
