const { createCanvas, registerFont } = require("canvas");
const WrapText = require("./wrapText");

const createImage = async (data, title, subTitle, currentCount, rounds) => {
  // Canvas setup
  const canvasWidth = 900;
  const canvasHeight = 1300;

  registerFont('./fonts/Poppins-Regular.ttf', { family: 'Poppins' })
  const canvas = createCanvas(canvasWidth, canvasHeight);

  // Axis setup
  let xAxisGap = 50; // normal x gap
  let questionYGap = 175;
  let answerYGap = 210;
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

    // title
    const { isLong: titleLong } = WrapText(
      ctx,
      title,
      canvasWidth / 2,
      titleYGap,
      maxWidth,
      "30"
    );

    titleLong.forEach(() => {
      subTitleYGap += 35;
      questionYGap += 25;
      answerYGap += 25;
    });

    // sub title
    WrapText(ctx, subTitle, canvasWidth / 2, subTitleYGap, maxWidth, "28");
  } else {
    questionYGap = 50;
    answerYGap = 83;
  }

  ctx.textAlign = "left"; // question and answer -> left

  // looping the questions
  for (let i = currentCount; i < data.length; i++) {
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
      const answers = data[i].answers
      answerData +=
        `${xIndex + 1}.${answers[xIndex]}${answers.length === (xIndex + 1) ? '' : '     '}`;
    }

    isLong.forEach(() => {
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

    answerLong.forEach(() => {
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
