import { colorToCss } from "./util";

const BLACK = {
    r: 0, g: 0, b: 0, a: 1
}
export default class Painter {

    constructor(canvas, w, h) {
        this.canvas = canvas;
        this.w = w;
        this.h = h;
        this.ctx = this.canvas.getContext("2d")
        this.history = []

        this.commitHistory = 0;

        this._setupCanvas();
        this.setFill(BLACK)
        this.setStroke(BLACK, 3)
        this.black = BLACK;
    }

    _setupCanvas() {
        this.canvas.width = this.w;
        this.canvas.height = this.h;

        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;


        this.buffer = document.createElement('canvas');
        this.buffer.width = this.canvas.width;
        this.buffer.height = this.canvas.height;
        this.bufferCtx = this.buffer.getContext("2d")
        this.updateSnapshot()
    }

    clear(color) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
       
        if (color) {
            let oldColor = this.fill;
            this.setFill(color)

            this.makeRect(0, 0, this.w, this.h)

            this.setFill(oldColor)
        }
    }

    reset(color) {
        this.clear(color);
        this.history = [];
        this.updateSnapshot();
    }

    getCanvas() {
        return this.canvas;
    }

    last() {
        this.ctx.drawImage(this.buffer, 0, 0)
    }

    updateSnapshot() {
        this.bufferCtx.drawImage(this.canvas, 0, 0)
    }

    requestPointerLock() {
        //  this.canvas.requestPointerLock()
    }

    releasePointerLock() {
        //  document.exitPointerLock();
    }

    commit() {
        this.updateSnapshot()
        let canvas = document.createElement("canvas")
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;
        canvas.getContext('2d').drawImage(this.canvas, 0, 0)
        this.history.push(canvas)
        this.commitHistory = this.history.length;
    }

    undo() {
        console.log(this.commitHistory, this.history.length)

        if (this.history.length == this.commitHistory) {
            this.history.pop()
        }
        if (this.history.length == 0) {
            this.clear();
            this.history.pop()
        } else {
            this.ctx.drawImage(this.history.pop(), 0, 0)
        }
        this.updateSnapshot()
    }

    getImageData() {
        return this.ctx.getImageData(0, 0, this.w, this.h).data
    }

    setImageData(data) {
        let imgdata = new ImageData(new Uint8ClampedArray(data), this.w, this.h)
        this.ctx.putImageData(imgdata, 0, 0)
    }

    setFill(color) {
        this.fill = color ? colorToCss(color) : undefined;
        if (color)
            this.ctx.fillStyle = colorToCss(color);
    }

    setFillCustom(style) {
        this.fill = style;
        this.ctx.fillStyle = style;
    }


    setStroke(color, size) {
        this.stroke = color;
        this.size = size;

        if (color) {
            this.ctx.strokeStyle = colorToCss(color);
            this.ctx.lineWidth = size || this.ctx.linewidth;
            this.ctx.lineCap = "round"
        }
    }

    getCtx() {
        return this.ctx
    }

    makeRect(x, y, h, w) {
        if (this.fill) {
            this.ctx.fillRect(x, y, h, w);
        } else {
            this.ctx.rect(x, y, h, w)
        }
    }

    makeCircle(x, y, r) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        this.ctx.stroke();

        if (this.fill) {
            this.ctx.fill();
        }
    }

    makeCurve(startX, startY, endX, endY, controlX, controlY) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);

        this.ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        this.ctx.stroke();

        if (this.fill) {
            this.ctx.fill();
        }
    }

    floodFill(x, y, color, outline) {
        let currentColor = this.getColor(this.getImageData(), x, y)
        color.a *= 255
        this._floodFillScan(x, y, color, currentColor, outline)
    }

    _floodFillScan(startX, startY, color, oldColor, outline) {
        if (this.compareColor(color, oldColor)) return;

        let checkAbove = true, checkBelow = true, stack = [], out = [];
        let canvas = [...this.getImageData()]
        let draw = [...canvas]
        stack.push([startX, startY]);

        while (stack.length > 0) {
            let point = stack.shift();
            let x = point[0];
            let y = point[1];

            checkAbove = true;
            checkBelow = true;

            while (this.compareColor(this.getColor(canvas, x, y), oldColor) && x >= 0) x--;
            x++;
            if (outline) {
                this.setColor(draw, x, y, color)
                this.setColor(draw, x + 1, y, color)
                this.setColor(draw, x + 2, y, color)
            }
            while (this.compareColor(this.getColor(canvas, x, y), oldColor) && x < this.w) {
                this.setColor(canvas, x, y, color)
                x++;

                if (y - 1 >= 0 && this.compareColor(this.getColor(canvas, x, y - 1), oldColor)) {
                    if (checkAbove) {
                        stack.push([x, y - 1])
                        checkAbove = false;
                    }
                } else {
                    checkAbove = true;
                }

                if (y + 1 < this.h && this.compareColor(this.getColor(canvas, x, y + 1), oldColor)) {
                    if (checkBelow) {
                        stack.push([x, y + 1])
                        checkBelow = false
                    }
                } else {
                    checkBelow = true
                }

            }
            if (outline) {
                this.setColor(draw, x - 1, y, color)
                this.setColor(draw, x - 2, y, color)
                this.setColor(draw, x - 3, y, color)
            }
        }

        this.setImageData(outline ? draw : canvas)

    }

    setPixel(x, y) {
        this.setColor(this.snapshot, x, y, this.stroke)
    }

    makePath(points) {
        points = [...points]
        this.ctx.beginPath();
        let point = points.shift();
        this.ctx.moveTo(point.x, point.y);

        while (points.length > 0) {
            point = points.shift()
            this.ctx.lineTo(point.x, point.y)
        }

        this.ctx.stroke();

        if (this.fill) {
            this.ctx.fill();
        }
    }

    compareColor(c1, c2) {
        return c1.r == c2.r && c1.g == c2.g && c1.b == c2.b && c1.a == c2.a
    }

}