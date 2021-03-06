const drawDot = (ctx, x, y) => {
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
}

const clear = (ctx, w, h) => ctx.clearRect(0, 0, w, h);

export { drawDot }