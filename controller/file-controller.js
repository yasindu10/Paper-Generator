const createImage = require("../utils/image-create");
const PDFDocument = require("pdfkit");
const blobStream = require('blob-stream')
const { v4: uuidv4 } = require('uuid')
const { ref, getStorage, uploadBytes, getDownloadURL } = require('firebase/storage')

const generateImage = async (req, res) => {
  console.log('call')
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

  const stream = doc.pipe(blobStream())

  let downloadURL;

  stream.on('finish', async function () {
    const blob = stream.toBlob('application/pdf')
    const path = ref(getStorage(), `pdf/${uuidv4()}.pdf`)

    await uploadBytes(path, blob);
    downloadURL = await getDownloadURL(path);

    res.status(201).json({ success: true, url: downloadURL })
  })

  doc.end();
};

module.exports = { generateImage };
