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
};

const attachStyleSheet = (url) => {
    const css = createElement('link', {
        rel: 'stylesheet',
        type: 'text/css',
        href: url
    })
    document.head.appendChild(css);
};

const getMousePosition = (canvas, ev) => {
    // When the sizes of window and canvas are different
    // const rect = canvas.getBoundingClientRect();
    // const scaleX = canvas.width / rect.width;
    // const scaleY = canvas.height / rect.height;
    // return {
    //     x: (ev.offsetX - rect.left) * scaleX,
    //     y: (ev.offsetY - rect.top) * scaleY
    // };
    return {
        x: ev.offsetX,
        y: ev.offsetY
    }
};

// Linear Interpolation
const blender = (p1, p2, t) => {
    if (t <= 0) return p1;
    if (t >= 1) return p2;
    return ((1 - t) * p1) + (t * p2);
};

const blend = (x1, x2, y1, y2, t) => {
    const x = blender(x1, x2, t);
    const y = blender(y1, y2, t);
    return { x, y };
};

const interpolate = (x1, x2, y1, y2, duration) => {
    return (update) => {
        const blendX = blender.bind(null, x1, x2);
        const blendY = blender.bind(null, y1, y2);
        let startTime = 0;

        const step = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }
            const pastTime = timestamp - startTime;
            let progress = pastTime / duration;

            if (progress > 1) {
                update(blendX(1), blendY(1));
                return;
            }
            update(blendX(progress), blendY(progress));
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
};
export { createElement, attachStyleSheet, getMousePosition, blender, blend, interpolate };