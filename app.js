require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const { generateImage } = require("./controller/fileController");
const errorHandler = require("./middlewares/error-handeller");

const firebase = require('firebase/app')
const helmat = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const paypal = require('paypal-rest-sdk')
const cookie = require('cookie-parser')

const payRouter = require('./routers/payRouter')

firebase.initializeApp(require('./firebase/config-firebase'))

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.CLIENT_SECRET,
});

app.use(express.json());
app.use(cors({ origin: '*' }))
app.use(helmat())
app.use(xss())
app.use(cookie())

app.post("/api/v1/paper", generateImage);
app.use('/api/v1/payment', payRouter)

// error handler
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
