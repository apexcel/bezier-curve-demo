import { drawGrid, drawDotsAndEdges, drawMovings } from "../draw.js";
import { createElement, getMousePosition, blend } from "../utils.js";

const WIDTH = document.documentElement.clientWidth,
    HEIGHT = document.documentElement.clientHeight;
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
    }

    reset = () => {
        this.state = {
            selected: -1,
            interpolation: 0,
            coords: [],
        };
        this.animationState = {
            startTime: Date.now(),
            pauseTime: 0,
            animateTime: 1500,
            run: false,
            pause: false
        };
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        drawGrid(this.ctx, this.state.coords);
    }

    markCurrentPosition = (ev) => {
        const coordinates = getMousePosition(this.canvas, ev);
        this.probeDotList(coordinates.x, coordinates.y);
        if (this.state.selected >= 0) {
            this.state.coords = this.state.coords.filter((_, i) => i !== this.state.selected);
            this.selected = -1;
        }
        else {
            this.state.coords.push(coordinates);
        }
        (!this.animationState.run && !this.animationState.pause) 
            ? drawDotsAndEdges(this.ctx, this.state.coords)
            : this.calculateBezier(this.state.interpolation / this.animationState.animateTime);
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
            : this.calculateBezier(this.state.interpolation / this.animationState.animateTime);
    }

    onMouseOut = (ev) => {
        this.state.selected = -1;
    }

    onMouseUp = (ev) => {
        this.state.selected = -1;
    }

    onChangeTime = (ev) => {
        this.animationState.animateTime = parseInt(ev.target.value, 10);
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
        this.raf = requestAnimationFrame(this.animate)
        this.calculateBezier((currentTime - this.animationState.startTime) / this.animationState.animateTime);
        if (currentTime - this.animationState.startTime > this.animationState.animateTime) {
            this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            drawGrid(this.ctx);
            drawDotsAndEdges(this.ctx, this.state.coords);
            cancelAnimationFrame(this.raf);
            this.animationState.run = false;
            this.updateText(false);
        }
        this.state.interpolation = Date.now() - this.animationState.startTime;
    }

    calculateBezier = (t) => {
        this.calculatedDots = [];

        const innerCalcDots = (coords, t) => {
            if (coords.length < 2) return;
            const rCalcedDots = [];
            for (let i = 1; i < coords.length; i += 1) {
                const movingDot = blend(coords[i - 1].x, coords[i].x, coords[i - 1].y, coords[i].y, t)
                rCalcedDots.push({
                    x: movingDot.x,
                    y: movingDot.y,
                });
                drawMovings(this.ctx, rCalcedDots);
            }
            this.calculatedDots.push(rCalcedDots);
            innerCalcDots(rCalcedDots, t)
        };

        const blendedDots = [];
        for (let i = 1; i < this.state.coords.length; i += 1) {
            const movingDot = blend(this.state.coords[i - 1].x, this.state.coords[i].x, this.state.coords[i - 1].y, this.state.coords[i].y, t)
            blendedDots.push({
                x: movingDot.x,
                y: movingDot.y,
            });
        }

        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawGrid(this.ctx);
        drawMovings(this.ctx, this.state.coords);
        drawMovings(this.ctx, blendedDots);

        innerCalcDots(blendedDots, t);
    }

    updateText = (run) => {
        const target = document.getElementById('run');
        target.innerText = (run) ? 'PAUSE' : 'RUN';
    }
}

export default Board;