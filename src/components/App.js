import { attachStyleSheet, createElement } from '../utils.js';
import styleSheets from '../styles/index.js';
import Board from './Board.js';

export default  class App {
    constructor() {
        this.root = document.getElementById('root');
        // styleSheets.forEach(style => attachStyleSheet(style));

        const board = new Board(this.root);

        const controller = createElement('div', {
            width: '100px',
            height: '100px',
            className: 'controller'
        })
        const run = createElement('button', {
            id: 'run',
            innerText: 'RUN'
        });
        const stop = createElement('button', {
            id: 'stop',
            innerText: 'STOP'
        });
        const reset = createElement('button', {
            id: 'rest',
            innerText: 'RESET'
        });
        const adjustTime = createElement('input', {
            type: 'range',
            min: 1000,
            max: 10000,
        })

        run.onclick = () => board.runAnimate();
        stop.onclick = () => board.stopAnimate();
        reset.onclick = () => board.resetGrid();
        adjustTime.onchange = (e) => board.onChangeTime(e);

        controller.appendChild(run);
        controller.appendChild(stop);
        controller.appendChild(reset);
        controller.appendChild(adjustTime);
        this.root.appendChild(controller);
    }
}