import { drawGrid, drawDotsAndEdges, drawEdge, drawDot, drawMovings } from "../draw.js";
import { createElement, getMousePosition, blend, interpolate } from "../utils.js";

const WIDTH = 640, HEIGHT = 640;

class Board {
    constructor(parent) {
        this.canvas = createElement('canvas', {
            id: 'canvas'
        });
        parent.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }

    init = () => {
        this.canvas.style.width = '640px';
        this.canvas.style.height = '640px';
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.dots = [];
        this.selected = -1;
        this.canvas.addEventListener('dblclick', this.markCurrentPosition);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mouseout', this.onMouseOut);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        drawGrid(this.ctx, this.dots);
    }

    resetGrid = () => {
        this.dots = [];
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawGrid(this.ctx, this.dots);
    }

    markCurrentPosition = (ev) => {
        const coordinates = getMousePosition(this.canvas, ev);
        this.probeDotList(coordinates.x, coordinates.y);
        if (this.selected >= 0) {
            this.dots = this.dots.filter((_, i) => i !== this.selected);
            this.selected = -1;
        }
        else {
            this.dots.push(coordinates);
        }
        drawDotsAndEdges(this.ctx, this.dots);
    }

    onMouseDown = (ev) => {
        ev.preventDefault();
        const { x, y } = getMousePosition(this.canvas, ev);
        this.probeDotList(x, y);
    }

    onMouseMove = (ev) => {
        ev.preventDefault();
        if (this.selected < 0) return;
        this.dots[this.selected].x = ev.offsetX;
        this.dots[this.selected].y = ev.offsetY;
        drawDotsAndEdges(this.ctx, this.dots);
    }

    onMouseOut = (ev) => {
        this.selected = -1;
    }

    onMouseUp = (ev) => {
        this.selected = -1;
    }

    isExist = (dot, x, y) => {
        const radius = 10;
        const xpb = dot.x + radius;
        const xnb = dot.x - radius;
        const ypb = dot.y + radius;
        const ynb = dot.y - radius;
        if (dot.x >= -1 && dot.y >= -1
            && dot.x <= WIDTH && dot.y <= HEIGHT
            && (x <= xpb && x >= xnb && y >= ynb && y <= ypb)) {
            return true;
        }
        return false;
    }

    probeDotList = (x, y) => {
        for (let i = 0; i < this.dots.length; i += 1) {
            const currentDot = this.dots[i];
            if (this.isExist(currentDot, x, y)) {
                this.selected = i;
                return;
            }
        }
    }

    // TODO: interloation에 따른 draw 구현

    testRun = () => {
        this.startTime = Date.now();
        this.testAnimate();
    }
    testAnimate = () => {
        const currentTime = Date.now();
        this.testRaf = requestAnimationFrame(this.testAnimate)
        if (currentTime - this.startTime > 1000) {
            cancelAnimationFrame(this.testRaf);
        }
        this.rCalcDots(this.dots, (currentTime - this.startTime) / 1000);
    }

    rCalcDots = (arr, t) => {
        if (arr.length <= 1) return arr;
        const ret = [];
        for (let i = 1; i < arr.length; i += 1) {
            const movingDot = blend(arr[i - 1].x, arr[i].x, arr[i - 1].y, arr[i].y, t)
            ret.push({
                x: movingDot.x,
                y: movingDot.y,
            });
        }

        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawGrid(this.ctx);
        drawMovings(this.ctx, this.dots);
        drawMovings(this.ctx, ret);
        console.log(ret)
        this.rCalcDots(ret, t);
    }

    calcBezier = (t, arr) => {
        for (let i = 1; i < arr.length; i += 1) {
            const dotForEdge = blend(this.dots[i - 1].x, this.dots[i].x, this.dots[i - 1].y, this.dots[i].y, t)
            this.dotsForEdges[i - 1] = {
                x: dotForEdge.x,
                y: dotForEdge.y,
            };
        }

        for (let i = 1; i < this.dotsForEdges.length; i += 1) {
            const prev = this.dotsForEdges[i - 1];
            const curr = this.dotsForEdges[i];
            this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            drawGrid(this.ctx);
            drawMovings(this.ctx, this.dots);
            drawMovings(this.ctx, this.dotsForEdges);
        }
    }

    runAnimate = () => {
        this.dotsForEdges = [];
        this.movingDots = this.dots.slice(0);
        this.arr = this.dots.slice(0);
        // this.calculated = [];
        // for (let i = 1; i < this.dots.length; i += 1) {
        //     const prev = this.dots[i - 1];
        //     const curr = this.dots[i];
        //     const interpolation = interpolate(prev.x, curr.x, prev.y, curr.y, 1000);
        //     // interpolation((x, y) => {
        //     //     drawDotsAndEdges(this.ctx, this.dots);
        //     //     drawDot(this.ctx, x, y)
        //     //     console.log(x, y)
        //     // })
        // }
        // console.log(this.calculated)
        this.startTime = Date.now();
        this.animate();
    }

    stopAnimate = () => {
        console.log('stop executed')
        cancelAnimationFrame(this.raf);
    }

    animate = () => {
        const currentTime = Date.now();
        // console.log(currentTime - this.startTime, (currentTime - this.startTime) / 1000, this.raf)
        this.raf = requestAnimationFrame(this.animate)
        if (currentTime - this.startTime > 1000) {
            this.stopAnimate();
        }
        this.calcBezier((currentTime - this.startTime) / 1000, this.arr);
    }
}

export default Board;