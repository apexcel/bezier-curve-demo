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

    const traceWrapper = createElement('div', {
        className: 'wrapper'
    });
    const traceLabel = createElement('label', {
        htmlFor: 'trace',
        innerText: 'SHOW TRACE'
    });
    const trace = createElement('input', {
        type: 'checkbox',
        id: 'trace',
        className: 'btn',
        checked: false,
        defaultChecked: false
    });

    const adjustTime = createElement('input', {
        type: 'range',
        id: 'range-bar',
        className: 'range',
        min: 1000,
        max: 10000,
    });
    const rangeLabel = createElement('label', {
        htmlFor: 'range-bar',
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
    trace.onchange = (e) => board.onChangeTrace(e);

    // Play/Pause, Reset
    controller.appendChild(run);
    controller.appendChild(reset);

    // Range input
    wrapper.appendChild(rangeLabel);
    wrapper.appendChild(adjustTime);
    controller.appendChild(wrapper);

    // Trace check box
    traceWrapper.appendChild(traceLabel);
    traceWrapper.appendChild(trace);
    controller.appendChild(traceWrapper);

    // Manual
    controller.appendChild(manual);

    return controller;
};

export default Controller;