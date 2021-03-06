import { drawDot, drawEdge } from "../draw.js";
import { createElement, getMousePosition } from "../utils.js";

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
        // this.canvas.style.width = window.innerWidth + 'px';
        // this.canvas.style.height = window.innerHeight + 'px';
        // this.canvas.width = window.innerWidth;
        // this.canvas.height = window.innerHeight;

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
    }

    markCurrentPosition = (ev) => {
        const coordinates = getMousePosition(this.canvas, ev);
        this.probeDotList(coordinates.x, coordinates.y);
        console.log(this.selected)
        if (this.selected >= 0) {
            this.dots = this.dots.filter((_, i) => i !== this.selected);
            this.selected = -1;
        }
        else {
            this.dots.push(coordinates);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let prevX, prevY;
        this.dots.forEach((dot, i) => {
            drawDot(this.ctx, dot.x, dot.y)
            if (i > 0) {
                drawEdge(this.ctx, prevX, dot.x, prevY, dot.y);
            }
            prevX = dot.x;
            prevY = dot.y
        })
    }

    onMouseDown = (ev) => {
        ev.preventDefault();
        const { x, y } = getMousePosition(this.canvas, ev);
        this.probeDotList(x, y);
    }

    onMouseMove = (ev) => {
        if (this.selected < 0) return;
        ev.preventDefault();
        this.dots[this.selected].x = ev.offsetX;
        this.dots[this.selected].y = ev.offsetY;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let prevX, prevY;
        this.dots.forEach((dot, i) => {
            drawDot(this.ctx, dot.x, dot.y)
            if (i > 0) {
                drawEdge(this.ctx, prevX, dot.x, prevY, dot.y);
            }
            prevX = dot.x;
            prevY = dot.y
        })
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
}

export default Board;