const { createCanvas } = require("canvas");
const WrapText = require("../constants/wrap-text");

const createImage = async (data, title, subTitle, currentCount, rounds) => {
  // Canvas setup
  const canvasWidth = 900;
  const canvasHeight = 1300;

  const canvas = createCanvas(canvasWidth, canvasHeight);

  // Axis setup
  let xAxisGap = 50; // normal x gap
  let questionYGap = 170;
  let answerYGap = 203;
  let titleYGap = 25;
  let subTitleYGap = 85;

  const background = canvas.getContext("2d");
  background.fillStyle = "white"; // background color to white
  background.fillRect(0, 0, canvasWidth, canvasHeight);

  const ctx = canvas.getContext("2d"); // main ctx
  ctx.fillStyle = "black";

  const fontSize = "24"; // font and other text properties (answers and questions)
  const maxWidth = 800; // Max width for the text

  if (!(rounds > 1)) {
    ctx.textAlign = "center"; // title and subTitle Center
    const { isLong: titleLong } = WrapText(
      ctx,
      title,
      canvasWidth / 2,
      titleYGap,
      maxWidth,
      "29"
    );

    titleLong.forEach((e) => {
      subTitleYGap += 35;
      questionYGap += 25;
      answerYGap += 25;
    });

    WrapText(ctx, subTitle, canvasWidth / 2, subTitleYGap, maxWidth, "27");
  } else {
    questionYGap = 50;
    answerYGap = 83;
  }

  ctx.textAlign = "left"; // question and answer -> left

  // looping the queactions
  for (i = currentCount; i < data.length; i++) {
    if (questionYGap >= canvasHeight - 50 /**end space */) {
      const image = canvas.toBuffer("image/png");
      return { image, i };
    }

    let realIndex = i + 1;
    const { isLong } = WrapText(
      ctx,
      `${realIndex <= 9 ? `0${realIndex}` : realIndex}) ${data[i].question}`,
      xAxisGap,
      questionYGap,
      maxWidth,
      fontSize
    );

    let answerData = "";
    for (let xIndex = 0; xIndex < data[i].answers.length; xIndex++) {
      answerData += `${xIndex + 1}.${data[i].answers[xIndex]}     `;
    }

    isLong.forEach((e) => {
      answerYGap += 39;
      questionYGap += 39;
    });

    const { isLong: answerLong } = WrapText(
      ctx,
      answerData,
      xAxisGap,
      answerYGap,
      maxWidth,
      fontSize
    );

    answerLong.forEach((e) => {
      answerYGap += 25;
      questionYGap += 25;
    });

    questionYGap += 100;
    answerYGap += 100;
  }

  const image = canvas.toBuffer("image/png");
  return { image };
};

module.exports = createImage;
