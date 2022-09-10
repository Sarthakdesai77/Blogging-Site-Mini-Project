require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



mongoose
  .connect(
    process.env.DB_LINK,
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log('MongoDb is connected'))
  .catch((err) => console.log(err));

app.use('/', route);

app.all('/**', (req, res) => {
  res.status(404).send({ status: false, message: 'Page Not Found!' });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Express app running on port ' + (process.env.PORT || 3000));
});
