require('dotenv').config(); // VARIÁVEIS DE AMBIENTE: SECRET
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class AuthenticationService {
  async login(email, password, res) {
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(404).send('Usuário não encontrado!');
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).send('Credenciais inválidas!');
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: '1d',
      });

      return res.status(200).send({ user, token });
    } catch (err) {
      console.log(err);
      return res.status(500).send('Erro interno do servidor!');
    }
  }
}