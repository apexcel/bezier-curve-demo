import { attachStyleSheet } from '../utils.js';
import styleSheets from '../styles/index.js';
import Board from './Board.js';

export default  class App {
    constructor() {
        this.$root = document.getElementById('root');
        styleSheets.forEach(style => attachStyleSheet(style));
        new Board(this.$root);
    }
}