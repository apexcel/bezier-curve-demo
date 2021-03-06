const drawDot = (ctx, x, y) => {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(x, y, 20, 0, 360)
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = 'gray';
    ctx.arc(x, y, 10, 0, 360)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

const drawEdge = (ctx, x1, x2, y1, y2) => {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

const clear = (ctx, w, h) => ctx.clearRect(0, 0, w, h);

export { drawDot, drawEdge }