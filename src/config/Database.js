require('dotenv').config(); // VARIÁVEIS DE AMBIENTE: DATABASE, USERNAME, PASSWORD, HOST, DIALECT
const  { Sequelize } = require('sequelize');

const database = process.env.DATABASE;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const dialect = process.env.DIALECT;

const databaseConfig = new Sequelize(database, username, password, {
  host,
  dialect,
});

module.exports = databaseConfig;