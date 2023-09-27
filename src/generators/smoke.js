import { incColor, randInt, randIncColor, clamp } from "../utils/util";

export default class Smoke {
    constructor() {
        this.color = undefined;
        this.pos = { x: 0, y: 0 }

        this.options = {
            radius: 20,
            moveAmount: 4,
            colorChangeAmount: 3,
            strokeSize: 3,
            strokeBrightness: 25,
        }
    }

    static isIterable = true;
    static title = "Smoke";
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
    ]


    setup(painter, options) {
        this.maxIterations = options.iterations;

        this.color = {
            r: randInt(255),
            g: randInt(255),
            b: randInt(255),
            a: .02
        }
        this.pos.x = randInt(painter.w);
        this.pos.y = randInt(painter.h);
    }

    paint(painter, options, iteration) {
        if (iteration > this.maxIterations) {
            console.log(iteration, this.maxIterations)
            return true;
        }

        painter.setFill(this.color);
        painter.setStroke(this.color, 0);
        painter.makeCircle(this.pos.x, this.pos.y, randInt(this.options.radius))

        this.color = randIncColor(this.color, this.options.colorChangeAmount);
        this.pos.x = clamp(this.pos.x + randInt(-this.options.moveAmount, this.options.moveAmount), 0, painter.w);
        this.pos.y = clamp(this.pos.y + randInt(-this.options.moveAmount, this.options.moveAmount), 0, painter.h);

    }
}