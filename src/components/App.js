import Board from './Board.js';
import Controller from './Controller.js';

export default  class App {
    constructor() {
        this.root = document.getElementById('root');

        const board = new Board(this.root);
        const controller = Controller(board);
        this.root.appendChild(controller);
    }
}