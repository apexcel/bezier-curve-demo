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

export { createElement, getMousePosition, blender, blend };