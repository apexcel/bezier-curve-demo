const drawGrid = (ctx) => {
    const { width, height } = ctx.canvas;
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
    for (let x = 0; x < width; x += padding) {
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
    ctx.fillStyle = color1 ? color1 : '#3333332c';
    ctx.arc(x, y, 12, 0, 360)
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 360)
    ctx.stroke();
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
    ctx.lineWidth = 1.5;
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
    clearCanvas(ctx);
    drawGrid(ctx);
    dots.forEach((dot, i) => {
        drawDot(ctx, dot.x, dot.y);
        if (i > 0) drawEdge(ctx, prevX, dot.x, prevY, dot.y);
        prevX = dot.x;
        prevY = dot.y;
    })
}

const drawBezier = (ctx, dots, options) => {
    const { color1 } = options || {};
    let prevX, prevY;
    dots.forEach((dot, i) => {
        drawDot(ctx, dot.x, dot.y, { color1: color1 });
        if (i > 0) drawEdge(ctx, prevX, dot.x, prevY, dot.y);
        prevX = dot.x;
        prevY = dot.y;
    })
}

const clearCanvas = (ctx) => ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

export { drawDot, drawEdge, clearCanvas, drawDotsAndEdges, drawBezier, drawGrid }