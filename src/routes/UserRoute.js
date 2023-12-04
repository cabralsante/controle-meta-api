const express = require('express');
const router = express.Router();
const UserControler = require('../controllers/UserController');
const { Auth } = require('../middlewares/Auth');

const controller = new UserControler();

router.get("/", controller.index);

router.post("/create", controller.create);

router.post("/login", controller.login);

router.put("/update/:id", Auth, controller.update);

module.exports = router;