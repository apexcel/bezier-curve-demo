import { attachStyleSheet, createElement } from '../utils.js';
import styleSheets from '../styles/index.js';
import Board from './Board.js';

export default  class App {
    constructor() {
        this.$root = document.getElementById('root');
        styleSheets.forEach(style => attachStyleSheet(style));
        const board = new Board(this.$root);
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
        const test = createElement('button', {
            id: 'test',
            innerText: 'TEST'
        });
        run.onclick = () => board.runAnimate();
        stop.onclick = () => board.stopAnimate();
        reset.onclick = () => board.resetGrid();
        test.onclick = () => board.testRun();
        this.$root.appendChild(run);
        this.$root.appendChild(stop);
        this.$root.appendChild(reset);
        this.$root.appendChild(test);
    }
}