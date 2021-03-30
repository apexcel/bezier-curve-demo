import { attachStyleSheet } from '../utils.js';
import styleSheets from '../styles/index.js';
import Board from './Board.js';
import Controller from './Controller.js';

export default  class App {
    constructor() {
        this.root = document.getElementById('root');
        // styleSheets.forEach(style => attachStyleSheet(style));

        const board = new Board(this.root);
        const controller = Controller(board);
        this.root.appendChild(controller);
    }
}