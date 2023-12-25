
const wrapText = (ctx, text, x, y, maxWidth, fontSize) => {
    const lineHeight = fontSize * 1.5;
    let words = text.split(' ');
    let line = '';
    let yPos = y;
    let isLong = [];

    ctx.font = `${fontSize}px Arial`;

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            isLong.push(true)
            ctx.fillText(line, x, yPos);
            line = words[i] + ' ';
            yPos += lineHeight;
        } else {
            line = testLine;
        }
    }

    ctx.fillText(line, x, yPos);

    return { isLong }
}

module.exports = wrapText