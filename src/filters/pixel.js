import { COLORS, getColor } from "../utils/util";

export default class Pixel {
    constructor() {
        this.size = 15;
    }

    filter(painter, options) {
        let data = painter.getImageData();
        console.log(data);
        painter.clear();
        painter.setStroke(COLORS.transparent);

        for (let x = 0; x < painter.w; x += this.size) {
            for (let y = 0; y < painter.h; y += this.size) {
                let color = getColor(data, x, y, painter.w);
                //console.log(x, y, color)
                painter.setFill(color);
                painter.makeCircle(x, y, this.size / 2 -1);
            }
        }
    }

}