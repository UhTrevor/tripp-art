import { randInt, randIncColor, clamp, randColor } from "../utils/util";
let tinycolor = require("tinycolor2");

export default class Lines {
    constructor() {
        this.color = undefined;
        this.pos1 = {
            x: 0, y: 0,
        };
        this.pos2 = {
            x: 0, y: 0,
        }
    }

    static isIterable = true;
    static title = "Lines";
    static options = [
        {
            $formkit: 'range',
            name: "iterations",
            label: 'Iterations',
            value: 5000,
            max: 50000,
            min: 100,
            validation:"required|number|between:100,50000"
        },
        {
            $formkit: 'color',
            name: "background",
            label: 'Background Color',
            value: "#000",
        },
        {
            $formkit: 'range',
            name: "posMove",
            label: 'Line Movment',
            min: 1,
            max: 30,
            value: 6,
        },
        {
            $formkit: 'range',
            name: "colorMove",
            label: 'Color Movement',
            min: 1,
            max: 30,
            value: 3,
        },
    ];

    setup(painter, options) {
        this.maxIterations = options.iterations;
        this.colorMove = +options.colorMove;
        this.posMove = +options.posMove;

        this.color = randColor(.3);

        this.pos1.x = randInt(painter.w);
        this.pos1.y = randInt(painter.h);

        this.pos2.x = randInt(painter.w);
        this.pos2.y = randInt(painter.h);

        let color = tinycolor(options.background).toRgb();
        painter.setFill(color);
        painter.makeRect(0, 0, painter.w, painter.h);
        painter.fill = false;

    }

    paint(painter, options, iteration) {
        if (iteration > this.maxIterations) {
            console.log(iteration, this.maxIterations)
            return true;
        }

        painter.setStroke(this.color, 2);
        painter.makePath([this.pos1, this.pos2])

        this.color = randIncColor(this.color, this.colorMove);
        this.pos1.x = clamp(this.pos1.x + randInt(-this.posMove, this.posMove), 0, painter.w);
        this.pos2.x = clamp(this.pos2.x + randInt(-this.posMove, this.posMove), 0, painter.w);
        this.pos1.y = clamp(this.pos1.y + randInt(-this.posMove, this.posMove), 0, painter.h);
        this.pos2.y = clamp(this.pos2.y + randInt(-this.posMove, this.posMove), 0, painter.h);
    }
}
