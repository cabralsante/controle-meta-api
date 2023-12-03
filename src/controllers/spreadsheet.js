require('dotenv').config();
const { google } = require('googleapis');

async function getAuthSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });
  const spreadsheetId = process.env.SPREADSHEET_ID;

  return {
    auth,
    client,
    googleSheets,
    spreadsheetId
  }
}

module.exports = class SpreadsheetController {
  index(req, res) {
    res.send("Rota de Spreadsheet liberada!");
  }

  async getMetadata(req, res) {
    try {
      const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
      const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
      })  
      res.send(metadata);

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getRows(req, res) {
    try {
      const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
      const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Página1",
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING"
      })
      res.status(200).send(getRows.data);

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateRows_(req, res) {
    try {
      const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
      const { values, cellRange } = req.body;
      const range = `'Página1'!${cellRange}`;
      const updateRows = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource: {
          values
        }
      });
      res.status(201).send(updateRows.data);

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateRows(req, res) {
    try {
      const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
      const { values } = req.body;
      const existingValues = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Página1",
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING"
      });

      let range = ""; // RANGE PARA ATUALIZAR OS DADOS
      for (let i = 1; i < existingValues.data.values.length; i++) { // PERCORRENDO TODAS AS LINHAS
        if (existingValues.data.values[i][1] === values[0][0]) { // VERIFICANDO SE O ID DA LINHA É IGUAL AO ID QUE ESTÁ SENDO ATUALIZADO
          range = `'Página1'!D${i + 1}:G${i + 1}`; // SETANDO O RANGE PARA ATUALIZAR OS DADOS
          break; // PARANDO O LOOP
        }
      }
      values[0].shift(); // REMOVENDO O ID

      const updateRows = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource: {
          values
        }
      });
      res.status(201).send(updateRows.data);

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async appendRows(req, res) {
    try {
      const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
      const { values } = req.body;
      const appendRows = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Página1",
        valueInputOption: "USER_ENTERED",
        resource: {
          values
        }
      })
      res.send(appendRows.data);

    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}