require('dotenv').config();
const express = require('express');
const indexRoute = require('./src/routes/index');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/spreadsheet', indexRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});