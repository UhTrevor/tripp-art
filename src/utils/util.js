import Painter from "./painter";

export function randInt(min, max) {
    max += 1;
    if (max)
        return Math.floor(Math.random() * (max - min) + min);
    else
        return Math.floor(Math.random() * min);
}

export function rand(min, max) {
    max += 1;
    if (max)
        return Math.random() * (max - min) + min;
    else
        return Math.random() * min;
}

export function clamp(val, max, min) {
    return Math.min(Math.max(val, max), min);
}

export function randColor(alpha) {
    return {
        r: randInt(255),
        g: randInt(255),
        b: randInt(255),
        a: alpha || 255
    }
}

export function incColor(color, rinc, ginc, binc, ainc) {
    const a = clamp(color.a + (ainc ?? rinc), 0, 255);
    const r = clamp(color.r + (rinc ?? rinc), 0, 255);
    const g = clamp(color.g + (ginc ?? rinc), 0, 255);
    const b = clamp(color.b + (binc ?? rinc), 0, 255);

    return { r, g, b, a };
}

export function randIncColor(color, amount, alpha = false) {
    return incColor(color, randInt(-amount, amount), randInt(-amount, amount), randInt(-amount, amount), alpha ? randInt(-amount, amount) : 0);
}

export function colorToCss(color) {
    if (color.h) {
        return `hsla(${color.h},${color.s}%,${color.l}%,${color.a})`
    } else {
        return `rgba(${color.r},${color.g},${color.b},${color.a > 1 ? color.a / 255 : color.a})`
    }
}

export function createPatternPainter(w, h) {
    const patternCanvas = document.createElement('canvas');
    const patternPainter = new Painter(patternCanvas, w, h);
    return patternPainter;
}

export function setColor(data, x, y, w, color) {
    let start = y * (w * 4) + x * 4
    data[start] = color.r;
    data[start + 1] = color.g;
    data[start + 2] = color.b;
    data[start + 3] = color.a;
}


export function getColor(data, x, y, w) {
    let start = y * (w * 4) + x * 4
    let rgba = {
        r: data[start],
        g: data[start + 1],
        b: data[start + 2],
        a: data[start + 3]
    }
    return rgba
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function rgba(r, g, b, a) {
    return { r, g, b, a };
}

export function hsla(h, s, l, a) {
    return { h, s, l, a };
}

export const COLORS = {
    transparent: { r: 0, g: 0, b: 0, a: 0 },
    black: { r: 0, g: 0, b: 0, a: 1 },
    white: { r: 255, g: 255, b: 255, a: 255 }
}



