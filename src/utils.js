const createElement = (elemType, options) => {
    const elem = document.createElement(elemType);
    if (options) {
        for (const [attr, value] of Object.entries(options)) {
            if (attr === 'className') {
                (Array.isArray(value))
                    ? value.forEach(className => elem.classList.add(className))
                    : elem.classList.add(value);
            }
            else {
                elem[attr] = value;
            }
        }
    }
    return elem;
}

const attachStyleSheet = (url) => {
    const css = createElement('link', {
        rel: 'stylesheet',
        type: 'text/css',
        href: url
    })
    document.head.appendChild(css);
}

const getMousePosition = (canvas, ev) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (ev.offsetX - rect.left) * scaleX,
        y: (ev.offsetY - rect.top) * scaleY
    };
}

export { createElement, attachStyleSheet, getMousePosition };