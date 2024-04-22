require('dotenv').config(); // VARIÁVEIS DE AMBIENTE: SPREADSHEET_ID
const { google } = require('googleapis');

async function getAuthSheets(service) {
  console.log("Pegando as credenciais do Google Sheets\n")
  console.log("Serviço:", service)

  const auth = new google.auth.GoogleAuth({
    keyFile: `${service}.json`,
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: 'v4', auth: client });
  let spreadsheetId;

  if (service === "asb") {
    spreadsheetId = process.env.ASB_ID
  } else if (service === "agend") {
    spreadsheetId = process.env.AGEND_ID
  } else if (service === "comp") {
    spreadsheetId = process.env.COMP_ID
  } else {
    throw new Error("Serviço não encontrado");
  }

  console.log("Spreadsheet ID:", spreadsheetId)

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
      const typeReq = req.headers['typereq'];
      const { googleSheets, auth, spreadsheetId } = await getAuthSheets(typeReq);
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
      const typeReq = req.headers['typereq'];
      const { googleSheets, auth, spreadsheetId } = await getAuthSheets(typeReq);
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
      const typeReq = req.headers['typereq'];
      const { googleSheets, auth, spreadsheetId } = await getAuthSheets(typeReq);
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
      const typeReq = req.headers['typereq'];
      const { googleSheets, auth, spreadsheetId } = await getAuthSheets(typeReq);
      const { values } = req.body;

      console.log("Pegando os valores do Google Sheets para dar Update (Reagendamento por enquanto)\n")
      const existingValues = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Página1",
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING"
      });
      console.log("Valores:", existingValues.data.values)

      console.log("Percorrendo as linhas\n")
      let range = ""; // RANGE PARA ATUALIZAR OS DADOS
      for (let i = 1; i < existingValues.data.values.length; i++) { // PERCORRENDO TODAS AS LINHAS
        if (existingValues.data.values[i][2] === values[0][0]) { // VERIFICANDO SE O ID DA LINHA É IGUAL AO ID QUE ESTÁ SENDO ATUALIZADO
          range = `'Página1'!G${i + 1}:J${i + 1}`; // SETANDO O RANGE PARA ATUALIZAR OS DADOS
          break; // PARANDO O LOOP
        }
      }

      if (!range) { // SE NÃO ENCONTRAR O ID, RETORNA ERRO
        console.log("Prontuário não encontrado")
        throw new Error("Prontuário não encontrado");
      }

      values[0].shift(); // REMOVENDO O ID
      console.log("Range: ", range)
      console.log("Valores: ", values)

      console.log("Atualizando os dados no Google Sheets\n")
      const updateRows = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource: {
          values
        }
      });
      res.status(200).send(updateRows.data);

    } catch (err) {

      console.log(err);
      return res.status(404).json({
        message: err.message
      });
    }
  }

  async appendRows(req, res) {
    try {
      const typeReq = req.headers['typereq'];
      const { googleSheets, auth, spreadsheetId } = await getAuthSheets(typeReq);
      const { values } = req.body;

      console.log("Pegando os valores do Google Sheets para dar Append\n")
      const existingValues = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Página1",
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING"
      });

      console.log("Dados:", existingValues.data.values[1][2], values[0][2])
      
      console.log("Percorrendo as linhas\n")
      let exist = false; // SE O ID JÁ EXISTE
      let nowDate = new Date(); // DATA ATUAL
      for (let i = 1; i < existingValues.data.values.length; i++) { // PERCORRENDO TODAS AS LINHAS
        if (existingValues.data.values[i][2] === values[0][2]) { // VERIFICANDO SE O ID DA LINHA É IGUAL AO ID QUE ESTÁ SENDO PROCURADO
          console.log("ID encontrado:", existingValues.data.values[i][2])
          console.log("Data do ID encontrado:", existingValues.data.values[i][0])
          
          if(typeReq === "agend") {
            exist = true;
            break;
          } else if(typeReq === "comp") {
            if (nowDate.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }) === existingValues.data.values[i][0]) {
              exist = true;
              break;
            }
          }
        }
      }

      console.log("Exist:", exist)
      if (exist) { // SE O ID JÁ EXISTE, RETORNA ERRO
        if(typeReq === "agend") {
          console.log("Prontuário já existe")
          throw new Error("Prontuário já existe");
        } else if(typeReq === "comp") {
          console.log("Prontuário já cadastrado hoje")
          throw new Error("Prontuário já cadastrado hoje");
        }
      }

      const appendRows = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Página1",
        valueInputOption: "USER_ENTERED",
        resource: {
          values
        }
      })
      res.status(201).send(appendRows.data);

    } catch (err) {

      console.log(err);
      return res.status(404).json({
        message: err.message
      });
    }
  }
}