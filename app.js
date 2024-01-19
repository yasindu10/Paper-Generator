require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const { generateImage } = require("./controller/file-controller");
const errorHandler = require("./middlewares/error-handeller");

app.use(express.json());

app.post("/api/v1/paper", generateImage);

// error handler
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});