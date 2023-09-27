import { SimplexNoise } from "simplex-noise";
import { COLORS, randColor, randInt, rand, createPatternPainter } from "../utils/util"

export default class Lines {
    constructor() {

    }

    isIterable() {
        return false;
    }

    getDefaultOptions() {

    }

    setup(painter, options) {
        this.painter = painter;
        this.color = randColor();

        this.noise = new SimplexNoise();
        this.horizon = this.painter.w / 4;
    }

    paint(painter, options) {
        this.paintGround();

        this.paintRoad();
    }

    paintGround() {
        const grassNoise = new SimplexNoise();
        const groundPattern = createPatternPainter(this.painter.w, this.painter.h);

        // ground.setFill(COLORS.white);
        // ground.makeRect(0, 0, this.painter.w, this.painter.h);


        for (let x = 0; x < this.painter.w; x += 5){
            for (let y = this.horizon; y < this.painter.h; y += 5) {
                let chance = Math.floor((grassNoise.noise2D(x / 300, y / 300) * .5 + .5) * 100);
                if (rand(0, chance) < 3) {
                    //console.log(chance, x, y, (y - this.horizon) / this.horizon)

                    this.paintGrass(x, y, (y - this.horizon) / this.horizon)
                }
            }
        }
    }

    paintGrass(x, y, scale) {
        let size = rand(1, 5);
        let maxHeight = rand(3, 20);
        let count = randInt(10, 80) * scale;
        for (let i = 0; i < count; i++) {
            let offset = randInt(-size, size) * scale
            let height = Math.random() * maxHeight * scale;
            let angle = randInt(180) * (offset /size);

            let topOffset = offset + (height * Math.sin((angle) * (Math.PI / 180)))
            let heightOffset = height + (height * Math.cos((angle) * (Math.PI / 180)))

            let color = { h: randInt(40, 60), s: randInt(60, 100), l: 65, a: .6 };
            this.painter.setFill(color);
            this.painter.setStroke(COLORS.transparent);

            this.painter.makePath([{
                x: x + offset,
                y: y
            },
            {
                x: x + topOffset,
                y: y - heightOffset
            },
            {
                x: x + topOffset + 1,
                y: y - heightOffset
            },
            {
                x: x + offset + 1,
                y: y
            }])
        }
    }


    paintRoad() {
        let roadSize = this.horizon;
        let topRoad = Math.floor(this.painter.h / 2);
        let centerX = this.painter.w / 2;
        let paintSize = 5;
        let vanishMod = 1.05

        let left = [];
        let right = [];
        let middleLeft = [];
        let middleRight = [];

        for (let i = 0; i < topRoad; i++) {
            let offset = this.noise.noise2D(i / 100, 0) * 5;
            left.push({
                x: centerX - (roadSize * (1 - (i / (topRoad * vanishMod)))) + offset,
                y: this.painter.h - i,
            })
            right.push({
                x: centerX + (roadSize * (1 - (i / (topRoad * vanishMod)))) + offset,
                y: this.painter.h - i,
            })

            middleLeft.push({
                x: centerX - (paintSize / 2 * (1 - (i / (topRoad * vanishMod)))) + offset,
                y: this.painter.h - i,
            })

            middleRight.push({
                x: centerX + (paintSize / 2 * (1 - (i / (topRoad * vanishMod)))) + offset,
                y: this.painter.h - i,
            })
        }

        let leftPaint = [...left];
        let rightPaint = [...right];

        right.reverse();

        this.painter.setFill({ r: 100, g: 100, b: 100, a: 255 });
        this.painter.setStroke({ r: 100, g: 100, b: 100, a: 0 });

        this.painter.makePath(left.concat(right));

        for (let i = left.length - 1; i > 0; i--) {
            leftPaint.push({ x: leftPaint[i].x + (paintSize * (1 - ((this.painter.h - leftPaint[i].y) / (topRoad * vanishMod)))), y: leftPaint[i].y });
            rightPaint.push({ x: rightPaint[i].x - (paintSize * (1 - ((this.painter.h - rightPaint[i].y) / (topRoad * vanishMod)))), y: rightPaint[i].y });
        }


        let lineColor = { r: 255, g: 255, b: 255, a: 200 }
        this.painter.setFill(lineColor);

        this.painter.makePath(leftPaint);
        this.painter.makePath(rightPaint);

        lineColor = { r: 255, g: 255, b: 20, a: 200 }
        this.painter.setFill(lineColor);

        middleRight.reverse();
        this.painter.makePath(middleLeft.concat(middleRight));

    }

}