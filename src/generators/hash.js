import { randInt, randIncColor, clamp, randColor } from "../utils/util"

const POS_MOVE = 6;
const COLOR_MOVE = 3;

export default class Hash {
    constructor() {
        this.color = undefined;
        this.x = 0;
        this.y = 0;
    }


    static isIterable = true;
    static title = "Hash";

    setup(painter, options) {
        this.maxIterations = 10000;
        this.color = randColor(.3);

        this.x = randInt(painter.w);
        this.y = randInt(painter.h);

    }

    paint(painter, options, iteration) {
        if (iteration > this.maxIterations) {
            return true;
        }

        let length = randInt(20, 200);
        let dirx = randInt(2) ? 1 : -1;
        let diry = randInt(2) ? 1 : -1;

        painter.setStroke(this.color, 2);
        painter.makePath([{
            x: this.x,//- (dirx * length / 2),
            y: this.y// - (diry * length / 2)
        }, {
            x: this.x + (dirx * length / 2),
            y: this.y + (diry * length / 2)
        }])

        this.color = randIncColor(this.color, COLOR_MOVE);
        this.x = clamp(this.x + randInt(-POS_MOVE, POS_MOVE), 0, painter.w);
        this.y = clamp(this.y + randInt(-POS_MOVE, POS_MOVE), 0, painter.h);
    }
}
