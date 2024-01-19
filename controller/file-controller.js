const createImage = require("../utils/image-create");
const PDFDocument = require("pdfkit");

const fs = require("fs");

const generateImage = async (req, res) => {
  const { data, title, subTitle } = req.body;

  let rounds = 1;
  let currentIndex = 0;
  let allImageBytes = [];

  // canvas
  const canvasWidth = 900;
  const canvasHeight = 1300;

  for (let index = 0; index < rounds; index++) {
    const { image, i } = await createImage(
      data,
      title,
      subTitle,
      currentIndex,
      rounds
    );

    if (i < data.length) {
      currentIndex = i;
      rounds++;
    }
    allImageBytes.push(image); // pushing b
  }

  const doc = new PDFDocument();
  allImageBytes.forEach((e) => {
    doc.image(e, {
      fit: [canvasWidth / 2, canvasHeight / 2],
    });

    if (allImageBytes.length - 1 !== allImageBytes.indexOf(e)) {
      doc.addPage();
    }
  });

  const stream = fs.createWriteStream("output.pdf");
  doc.pipe(stream);
  doc.end();

  res.status(200).json({ success: true });
};

module.exports = { generateImage };
