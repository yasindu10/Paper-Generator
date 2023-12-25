require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const { genarateImage } = require("./controller/file-controller");
const errorHandeller = require("./middlewares/error-handeller");

app.use(express.json());

app.post("/api/v1/paper", genarateImage);

// error handeller
app.use(errorHandeller);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
