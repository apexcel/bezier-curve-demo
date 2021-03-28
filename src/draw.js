const drawGrid = (ctx) => {
    const {width, height} = ctx.canvas;
    const padding = 30;
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    for (let y = 0; y < height; y += padding) {
        ctx.beginPath();
        ctx.moveTo(0, y + padding);
        ctx.lineTo(width + padding, y + padding);
        ctx.stroke();
    }
    for (let x = 0; x < height; x += padding) {
        ctx.beginPath();
        ctx.moveTo(x + padding, 0);
        ctx.lineTo(x + padding, height + padding);
        ctx.stroke();
    }
    ctx.restore();
}

const drawDot = (ctx, x, y, options) => {
    const { color1, color2 } = options || {};
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color1 ? color1 : '#525252a2';
    ctx.arc(x, y, 12, 0, 360)
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = color2 ? color2 : '#000000';
    ctx.arc(x, y, 3, 0, 360)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

const drawEdge = (ctx, x1, x2, y1, y2, options) => {
    const { strokeStyle } = options || {};
    ctx.strokeStyle = strokeStyle ? strokeStyle : 'black';
    ctx.lineWidth = 3;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

const drawDashedEdge = (ctx, x1, x2, y1, y2, options) => {
    const { strokeStyle, dashedStyle } = options || {};
    ctx.save();
    ctx.strokeStyle = strokeStyle ? strokeStyle : 'black';
    dashedStyle ? ctx.setLineDash(dashedStyle) : null;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

const drawDotsAndEdges = (ctx, dots) => {
    let prevX, prevY;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawGrid(ctx);
    dots.forEach((dot, i) => {
        drawDot(ctx, dot.x, dot.y);
        if (i > 0) drawEdge(ctx, prevX, dot.x, prevY, dot.y);
        prevX = dot.x;
        prevY = dot.y;
    })
}

const drawWillMovingDotsAndEdges = (ctx, dots) => {
    let prevX, prevY;
    // clear(ctx, window.innerWidth, window.innerHeight);
    dots.forEach((dot, i) => {
        drawDot(ctx, dot.x, dot.y, { color2: '#119e38' });
        if (i > 0) drawDashedEdge(ctx, prevX, dot.x, prevY, dot.y, { strokeStyle: '#9e3f2c', dashedStyle: [10, 24] });
        prevX = dot.xFrom;
        prevY = dot.yFrom;
    })
}

export { drawDot, drawDotsAndEdges, drawWillMovingDotsAndEdges, drawGrid }