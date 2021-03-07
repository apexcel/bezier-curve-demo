import { drawGrid, drawDotsAndEdges, drawWillMovingDotsAndEdges } from "../draw.js";
import { createElement, getMousePosition, interpolation } from "../utils.js";

const WIDTH = 640, HEIGHT = 640;

class Board {
    constructor(parent) {
        this.canvas = createElement('canvas', {
            id: 'canvas'
        });
        this.ctx = this.canvas.getContext('2d');
        this.init();
        parent.appendChild(this.canvas);
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
        drawGrid(this.ctx);
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
        const xpb = dot.x + 10;
        const xnb = dot.x - 10;
        const ypb = dot.y + 10;
        const ynb = dot.y - 10;
        if (dot.x >= 0 && dot.y >= 0 && dot.x <= WIDTH && dot.y <= HEIGHT
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

    runAnimate = () => {
        console.log('run animate')
        console.log(this.vectors);
        this.frame = 0;
        requestAnimationFrame(this.animate);
    }

    stopAnimate = () => {
        cancelAnimationFrame(this.raf);
    }

    animate = () => {
        if (this.frame < 200) {
            this.frame += 1;
            drawWillMovingDotsAndEdges(this.ctx, this.dots);
            this.raf = requestAnimationFrame(this.animate);
            console.log('asdasd')
            for (let i = 1; i < this.dots.length; i += 1) {
                const prev = this.dots[i -1];
                const curr = this.dots[i];
                const interpolate = interpolation(prev.x, curr.x, prev.y, curr.y, 1000);
                interpolate((x, y) => {
                    this.dots[i].x = x;
                    this.dots[i].y = y;
                })
            }
        }
    }
}

export default Board;