import { drawGrid, drawDotsAndEdges, drawMovings } from "../draw.js";
import { createElement, getMousePosition, blend } from "../utils.js";

const WIDTH = document.documentElement.clientWidth,
    HEIGHT = document.documentElement.clientHeight;
let MOVE_TIME = 1500;

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
        this.dots = []; // 만든 점들의 좌표가 저장되는 배열
        this.selected = -1;
        this.canvas.addEventListener('dblclick', this.markCurrentPosition);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mouseout', this.onMouseOut);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.resetGrid();
    }

    resetGrid = () => {
        this.dots = [];
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.stopAnimate();
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
        this.calculateBezier(this.time / MOVE_TIME)
        // drawDotsAndEdges(this.ctx, this.dots);
    }

    onMouseDown = (ev) => {
        ev.preventDefault();
        const { x, y } = getMousePosition(this.canvas, ev);
        this.probeDotList(x, y);
    }

    // TODO: 정지된 상태에서 각 정점을 움직일 때 bezier 곡선들도 같이 움직이게 하기
    onMouseMove = (ev) => {
        ev.preventDefault();
        // 선택된 정점이 없을 경우 리턴
        if (this.selected < 0) return;

        this.dots[this.selected].x = ev.offsetX;
        this.dots[this.selected].y = ev.offsetY;
        // drawDotsAndEdges(this.ctx, this.dots);
        this.calculateBezier(this.time / MOVE_TIME)
    }

    onMouseOut = (ev) => {
        this.selected = -1;
    }

    onMouseUp = (ev) => {
        this.selected = -1;
    }

    onChangeTime = (ev) => {
        MOVE_TIME = parseInt(ev.target.value, 10);
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

    runAnimate = () => {
        this.startTime = Date.now();
        this.isPlay = true;
        this.animate();
        console.log(this.calculatedDots)
    }

    animate = () => {
        const currentTime = Date.now();
        this.raf = requestAnimationFrame(this.animate)

        this.calculateBezier((currentTime - this.startTime) / MOVE_TIME);
        if (currentTime - this.startTime > MOVE_TIME) {
            this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            drawGrid(this.ctx);
            drawDotsAndEdges(this.ctx, this.dots);
            cancelAnimationFrame(this.raf);
        }
    }

    calculateBezier = (t) => {
        this.calculatedDots = [];
        
        const innerCalcDots = (dots, t) => {
            if (dots.length < 2) return;
            const rCalcedDots = [];
            for (let i = 1; i < dots.length; i += 1) {
                const movingDot = blend(dots[i - 1].x, dots[i].x, dots[i - 1].y, dots[i].y, t)
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
        for (let i = 1; i < this.dots.length; i += 1) {
            const movingDot = blend(this.dots[i - 1].x, this.dots[i].x, this.dots[i - 1].y, this.dots[i].y, t)
            blendedDots.push({
                x: movingDot.x,
                y: movingDot.y,
            });
        }

        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawGrid(this.ctx);
        drawMovings(this.ctx, this.dots);
        drawMovings(this.ctx, blendedDots);

        innerCalcDots(blendedDots, t);
    }

    stopAnimate = () => {
        if (this.isPlay) {
            this.time = Date.now() - this.startTime;
            cancelAnimationFrame(this.raf);
            this.isPlay = true;
        }
        // if (!this.isPlay) {
        //     requestAnimationFrame(this.animate)
        // }
    }
}

export default Board;