import { drawGrid, drawDotsAndEdges, drawBezier, clearCanvas, drawDot, drawTraces } from "../draw.js";
import { createElement, getMousePosition, blend } from "../utils.js";

const WIDTH = document.documentElement.clientWidth,
    HEIGHT = document.documentElement.clientHeight;

const COLORS = [
    '#3f51b5',
    '#673ab7',
    '#e91e63',
    '#8bc34a',
    '#ffeb3b',
    '#ff5722',
    '#795548'
];

let SPEED = 2000; // Default 1500
let SHOW_TRACE = false;

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
        this.canvas.style.width = WIDTH;
        this.canvas.style.height = HEIGHT;
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.canvas.addEventListener('dblclick', this.markCurrentPosition);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mouseout', this.onMouseOut);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.reset();
        this.count = 0;
    }

    reset = () => {
        this.state = {
            selected: -1,
            coords: [],
            color: 0
        };
        this.animationState = {
            startTime: Date.now(),
            pauseTime: 0,
            reStartTime: 0,
            animateTime: SPEED,
            run: false,
            pause: false
        };
        this.traces = [];
        this.updateText(false);
        cancelAnimationFrame(this.raf);
        clearCanvas(this.ctx);
        drawGrid(this.ctx, this.state.coords);
    }

    markCurrentPosition = (ev) => {
        const coordinates = getMousePosition(this.canvas, ev);
        this.probeDotList(coordinates.x, coordinates.y);
        if (this.state.selected >= 0) {
            this.state.coords = this.state.coords.filter((_, i) => i !== this.state.selected);
            this.state.selected = -1;
        }
        else {
            this.state.coords.push(coordinates);
        }
        (!this.animationState.run && !this.animationState.pause)
            ? drawDotsAndEdges(this.ctx, this.state.coords)
            : this.calculateBezier(this.animationState.reStartTime / this.animationState.animateTime);
    }

    onMouseDown = (ev) => {
        ev.preventDefault();
        const { x, y } = getMousePosition(this.canvas, ev);
        this.probeDotList(x, y);
    }

    onMouseMove = (ev) => {
        ev.preventDefault();
        if (this.state.selected < 0) return;
        this.state.coords[this.state.selected].x = ev.offsetX;
        this.state.coords[this.state.selected].y = ev.offsetY;

        (!this.animationState.run && !this.animationState.pause)
            ? drawDotsAndEdges(this.ctx, this.state.coords)
            : this.calculateBezier(this.animationState.reStartTime / this.animationState.animateTime);
    }

    onMouseOut = (ev) => {
        this.state.selected = -1;
    }

    onMouseUp = (ev) => {
        this.state.selected = -1;
    }

    onChangeTime = (ev) => {
        SPEED = parseInt(ev.target.value, 10);
        this.animationState.animateTime = SPEED;
    }

    onChangeTrace = (ev) => {
        SHOW_TRACE = ev.target.checked;
    }

    isExist = (coords, x, y) => {
        const radius = 10;
        const xpb = coords.x + radius;
        const xnb = coords.x - radius;
        const ypb = coords.y + radius;
        const ynb = coords.y - radius;
        if (coords.x >= -1 && coords.y >= -1
            && coords.x <= WIDTH && coords.y <= HEIGHT
            && (x <= xpb && x >= xnb && y >= ynb && y <= ypb)) {
            return true;
        }
        return false;
    }

    probeDotList = (x, y) => {
        for (let i = 0; i < this.state.coords.length; i += 1) {
            const pos = this.state.coords[i];
            if (this.isExist(pos, x, y)) {
                this.state.selected = i;
                return;
            }
        }
    }

    runAnimate = () => {
        if (!this.animationState.run && !this.animationState.pause) {
            this.animationState.startTime = Date.now();
            this.animationState.run = true;
            this.animationState.pause = false;
            this.traces = [];
            this.animate();
            this.updateText(true);
            return;
        }
        if (this.animationState.run && !this.animationState.pause) {
            cancelAnimationFrame(this.raf);
            this.animationState.pauseTime = Date.now() - this.animationState.startTime;
            this.animationState.pause = true;
            this.updateText(false);
            return;
        }
        if (this.animationState.run && this.animationState.pause) {
            this.animationState.startTime = Date.now() - this.animationState.pauseTime;
            this.raf = requestAnimationFrame(this.animate);
            this.animationState.pause = false;
            this.updateText(true);
            return
        }
    }

    animate = () => {
        const currentTime = Date.now();
        this.raf = requestAnimationFrame(this.animate);
        this.calculateBezier((currentTime - this.animationState.startTime) / this.animationState.animateTime);

        if (currentTime - this.animationState.startTime > this.animationState.animateTime) {
            drawDotsAndEdges(this.ctx, this.state.coords);
            cancelAnimationFrame(this.raf);
            this.animationState.run = false;
            this.updateText(false);
            if (SHOW_TRACE) drawTraces(this.ctx, this.traces);
        }
        this.animationState.reStartTime = Date.now() - this.animationState.startTime;
    }

    calculateBezier = (t) => {
        const calculatePosition = (coords, t) => {
            if (coords.length < 2) return;
            const color = this.state.color % COLORS.length;
            const calced = [];
            for (let i = 1; i < coords.length; i += 1) {
                const interpolationPos = blend(coords[i - 1].x, coords[i].x, coords[i - 1].y, coords[i].y, t)
                calced[i - 1] ={
                    x: interpolationPos.x,
                    y: interpolationPos.y,
                };
            }
            // if there is one element in array that means last point of Bezier curve.
            if (calced.length === 1) {
                drawBezier(this.ctx, calced, { color1: '#000000', color2: '#ffffff', size: 12});
                if (SHOW_TRACE && !this.animationState.pause) this.traces.push(calced[0]);
            }
            else {
                drawBezier(this.ctx, calced, { color1: COLORS[color] + '2c', size: 8 });
            }

            this.state.color = calced.length;
            calculatePosition(calced, t);
        };
        clearCanvas(this.ctx);
        drawGrid(this.ctx);
        drawDotsAndEdges(this.ctx, this.state.coords)

        if (SHOW_TRACE) drawTraces(this.ctx, this.traces);
        calculatePosition(this.state.coords, t);
    }

    updateText = (run) => {
        const target = document.getElementById('run');
        if (target) target.innerText = (run) ? 'PAUSE' : 'RUN';
    }
}

export default Board;