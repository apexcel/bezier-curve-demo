import { drawGrid, drawDotsAndEdges, drawWillMovingDotsAndEdges, drawDot } from "../draw.js";
import { createElement, getMousePosition, blend } from "../utils.js";

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

    // TODO: interloatiom에 따른 draw 구현
    runAnimate = () => {
        console.log('run animate')
        this.frame = 0;
        const bx = blend.bind(null, this.dots[0].x, this.dots[1].x);
        const by = blend.bind(null, this.dots[0].y, this.dots[1].y)
        drawDot(this.ctx, bx(0.1), by(0.1));
        // requestAnimationFrame(this.animate);
    }

    stopAnimate = () => {
        cancelAnimationFrame(this.raf);
    }

    animate = () => {
        if (this.frame < 100) {
            this.frame += 1;
            drawWillMovingDotsAndEdges(this.ctx, this.dots);
            this.raf = requestAnimationFrame(this.animate);
        }
    }
}

export default Board;