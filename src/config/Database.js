require('dotenv').config(); // VARIÁVEIS DE AMBIENTE: DATABASE, USERNAME, PASSWORD, HOSTNAME, DIALECT
const  { Sequelize } = require('sequelize');

const database = process.env.DBDATABASE;
const username = process.env.DBUSERNAME;
const password = process.env.DBPASSWORD;
const host = process.env.DBHOSTNAME;
const dialect = process.env.DBDIALECT;
const port = process.env.DBPORT;

console.log("Informações do banco de dados:",{
  database,
  username,
  password,
  host,
  dialect,
  port,
});

const databaseConfig = new Sequelize(database, username, password, {
  port,
  host,
  dialect,
});

module.exports = databaseConfig;