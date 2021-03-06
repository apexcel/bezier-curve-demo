import { drawGrid, drawDotsAndEdges, drawBezier, clearCanvas, drawTraces } from "../draw.js";
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

let SPEED = 1500; // Default 1500
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
            resumeTime: 0,
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
        const { x, y } = getMousePosition(this.canvas, ev);
        this.probeDotList(x, y);
        if (this.state.selected >= 0) {
            this.state.coords = this.state.coords.filter((_, i) => i !== this.state.selected);
            this.state.selected = -1;
        }
        else {
            this.state.coords.push({ x, y });
        }
        (!this.animationState.run && !this.animationState.pause)
            ? drawDotsAndEdges(this.ctx, this.state.coords)
            : this.calculateBezier(this.animationState.resumeTime / this.animationState.animateTime);
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
            : this.calculateBezier(this.animationState.resumeTime / this.animationState.animateTime);
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

    isExist = (x, y, inputX, inputY) => {
        const radius = 10;
        const xpb = x + radius;
        const xnb = x - radius;
        const ypb = y + radius;
        const ynb = y - radius;
        return (x >= -1 && y >= -1 && x <= WIDTH && y <= HEIGHT && (inputX <= xpb && inputX >= xnb && inputY >= ynb && inputY <= ypb));
    }

    probeDotList = (inputX, inputY) => {
        for (let i = 0; i < this.state.coords.length; i += 1) {
            const { x, y } = this.state.coords[i];
            if (this.isExist(x, y, inputX, inputY)) {
                return this.state.selected = i;
            }
        }
    }

    runAnimate = () => {
        if (!this.animationState.run && !this.animationState.pause) {
            this.animationState = {
                ...this.animationState,
                startTime: Date.now(),
                run: true,
                pause: false
            };
            this.traces = [];
            this.animate();
            this.updateText(true);
            return;
        }
        if (this.animationState.run && !this.animationState.pause) {
            cancelAnimationFrame(this.raf);
            this.animationState = {
                ...this.animationState,
                pauseTime: Date.now() - this.animationState.startTime,
                run: false,
                pause: true
            };
            this.updateText(false);
            return;
        }
        if (!this.animationState.run && this.animationState.pause) {
            this.animationState = {
                ...this.animationState,
                startTime: Date.now() - this.animationState.pauseTime,
                run: true,
                pause: false
            };
            this.updateText(true);
            this.raf = requestAnimationFrame(this.animate);
            return;
        }
    }

    animate = () => {
        const currentTime = Date.now();
        this.calculateBezier((currentTime - this.animationState.startTime) / this.animationState.animateTime);

        if (currentTime - this.animationState.startTime > this.animationState.animateTime) {
            cancelAnimationFrame(this.raf);
            drawDotsAndEdges(this.ctx, this.state.coords);
            this.animationState.run = false;
            this.updateText(false);
            if (SHOW_TRACE) drawTraces(this.ctx, this.traces);
            return;
        }
        this.animationState.resumeTime = Date.now() - this.animationState.startTime;
        this.raf = requestAnimationFrame(this.animate);
    }

    calculateBezier = (t) => {
        const calculatePosition = (coords, t) => {
            if (coords.length < 2) return;
            const color = this.state.color % COLORS.length;
            const calced = [];
            for (let i = 1; i < coords.length; i += 1) {
                const { x, y } = blend(coords[i - 1].x, coords[i].x, coords[i - 1].y, coords[i].y, t)
                calced[i - 1] = { x, y };
            }
            // if there is one element in array that means last point of Bezier curve.
            if (calced.length === 1) {
                drawBezier(this.ctx, calced, { color1: '#000000', color2: '#ffffff', size: 12 });
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