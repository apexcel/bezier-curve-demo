import { createElement } from "../utils.js";

const Controller = (board) => {

    const controller = createElement('div', {
        width: '100px',
        height: '100px',
        className: 'controller'
    })
    const run = createElement('div', {
        id: 'run',
        className: ['wrapper', 'btn'],
        innerText: 'RUN'
    });
    const reset = createElement('div', {
        id: 'rest',
        className: ['wrapper', 'btn'],
        innerText: 'RESET'
    });
    const adjustTime = createElement('input', {
        type: 'range',
        id: 'range-bar',
        className: 'range',
        min: 1000,
        max: 10000,
    });
    const label = createElement('label', {
        htmlFor:'range-bar',
        innerText: 'SPEED'
    });
    const wrapper = createElement('div', {
        className: 'wrapper'
    });
    const manual = createElement('div', {
        className: 'wrapper'
    });
    manual.innerText = 'Double click to create/remove a dot - click and drag to move a dot.';

    run.onclick = () => board.runAnimate();
    reset.onclick = () => board.reset();
    adjustTime.onchange = (e) => board.onChangeTime(e);

    controller.appendChild(run);
    controller.appendChild(reset);
    wrapper.appendChild(label);
    wrapper.appendChild(adjustTime);
    controller.appendChild(wrapper);
    controller.appendChild(manual)

    return controller;
};

export default Controller;