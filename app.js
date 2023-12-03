require('dotenv').config();
const express = require('express');
const indexRoute = require('./src/routes/index');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/spreadsheet', indexRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});