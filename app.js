require('dotenv').config();
const express = require('express');
const indexRoute = require('./src/routes/index');
const cors = require('cors');
const userRoute = require('./src/routes/UserRoute');
const databaseConfig = require('./src/config/Database');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/spreadsheet', indexRoute);
app.use('/user', userRoute);

const port = process.env.PORT || 3000;

databaseConfig
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Erro ao conectar com o banco de dados!");
    throw err;
  });