require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const { generateImage } = require("./controller/fileController");
const errorHandler = require("./middlewares/errorHandeller");
const connectDB = require('./db/connectDb')
const {
  authorization,
  authorizationPermission
} = require('./middlewares/authorization')

const firebase = require('firebase/app')
const helmat = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const paypal = require('paypal-rest-sdk')
const cookie = require('cookie-parser')

const payRouter = require('./routers/payRouter');
const authRouter = require("./routers/authRouter");

firebase.initializeApp(require('./firebase/configFirebase'))

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

app.use('/api/v1/auth', authRouter)
app.use(authorization) // authorization
app.use('/api/v1/payment', payRouter)

app.post('/api/v1/paper',
  authorizationPermission(['p-user', 'admin']),
  generateImage,
);

// error handler
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, async () => {
  await connectDB(process.env.MONGO_URL)
  console.log(`server listening on port ${port}`);
});
