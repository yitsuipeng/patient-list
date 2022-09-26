const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const router = require('./routes');
app.use('/api', router);

app.use(function (req, res, next) {
  res.status(404).send('Page Not Found');
});

app.use(function (err, req, res, next) {
  console.log(err);
  if (err instanceof SyntaxError){
    res.status(400).send({message: err.message});
  } else {
    res.status(500).send({message: err.message});
  }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;