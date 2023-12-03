const express = require('express');
const router = express.Router();
const SpreadsheetController = require('../controllers/spreadsheet'); //IMPORTANDO A CLASSE DO CONTROLLER

const controller = new SpreadsheetController(); //INSTANCIANDO A CLASSE DO CONTROLLER

router.get("/metadata", controller.getMetadata);

router.get("/getRows", controller.getRows);

router.put("/updateRows", controller.updateRows);

router.post("/addRow", controller.appendRows);

router.get("/", controller.index);

module.exports = router;