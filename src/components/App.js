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
        run.onclick = () => board.runAnimate();
        stop.onclick = () => board.stopAnimate();
        this.$root.appendChild(run);
        this.$root.appendChild(stop);
    }
}