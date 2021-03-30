import { createElement } from "../utils.js";

const Controller = (board) => {

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
        id: 'range-bar',
        min: 1000,
        max: 10000,
    });
    const label = createElement('label', {
        htmlFor:'range-bar',
        innerText: 'TIME'
    });
    const wrapper = createElement('div', {
        className: 'wrapper'
    });

    run.onclick = () => board.runAnimate();
    stop.onclick = () => board.stopAnimate();
    reset.onclick = () => board.resetGrid();
    adjustTime.onchange = (e) => board.onChangeTime(e);

    controller.appendChild(run);
    controller.appendChild(stop);
    controller.appendChild(reset);
    wrapper.appendChild(label);
    wrapper.appendChild(adjustTime);
    controller.appendChild(wrapper);

    return controller;
};

export default Controller;