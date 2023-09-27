import { incColor, randInt, randIncColor, clamp, COLORS } from "../utils/util";
let tinycolor = require("tinycolor2");

export default class Dots {
    constructor() {
        this.color = undefined;
        this.pos = { x: 0, y: 0 }
        
        this.options = {
            radius: 9,
            moveAmount: 3,
            colorChangeAmount: 3,
            strokeSize: 3,
            strokeBrightness: 25,
        }
    }

    static isIterable = true;
    static title = "Dots";
    static options = [
        {
            $formkit: 'range',
            name: "iterations",
            label: 'Iterations',
            value: 5000,
            max: 50000,
            min: 100,
            validation: "required|number|between:100,50000"
        },
        {
            $formkit: 'color',
            name: "background",
            label: 'Background Color',
            value: "#000",
        },
        {
            $formkit: 'range',
            name: "radius",
            label: 'Radius',
            value: 9,
            max: 100,
            min: 2,
            validation: "required|number|between:0,100"
        },
        {
            $formkit: 'range',
            name: "moveAmount",
            label: 'Dot Movement',
            value: 3,
            max: 30,
            min: 2,
            validation: "required|number|between:1,100"
        },
        {
            $formkit: 'range',
            name: "colorMove",
            label: 'Color Movement',
            value: 3,
            max: 30,
            min: 1,
            validation: "required|number|between:1,100"
        },
        {
            $formkit: 'range',
            name: "strokeSize",
            label: 'Outline Size',
            value: 2,
            max: 30,
            min: 0,
            validation: "required|number|between:0,100"
        },
        {
            $formkit: 'range',
            name: "alpha",
            label: 'Alpha',
            value: 10,
            max: 100,
            min: 1,
            validation: "required|number|between:0,100"
        },
    ]

    setup(painter, options) {
        this.color = {
            r: randInt(255),
            g: randInt(255),
            b: randInt(255),
            a: options.alpha / 100
        }
        this.pos.x = randInt(painter.w);
        this.pos.y = randInt(painter.h);

        let color = tinycolor(options.background).toRgb();
        painter.clear(color);
    }

    paint(painter, options, iteration) {
        if (iteration > options.iterations) {
            return true;
        }
        painter.setFill(this.color);
        painter.setStroke(options.strokeSize == 0 ? COLORS.transparent : incColor(this.color, 50), options.strokeSize);
        painter.makeCircle(this.pos.x, this.pos.y, options.radius)

        this.color = randIncColor(this.color, +options.colorMove);
        this.pos.x = clamp(this.pos.x + randInt(-options.moveAmount, +options.moveAmount), 0, painter.w);
        this.pos.y = clamp(this.pos.y + randInt(-options.moveAmount, +options.moveAmount), 0, painter.h);
    }
}