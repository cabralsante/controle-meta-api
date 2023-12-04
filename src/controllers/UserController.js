const User = require('../models/User');
const bcrypt = require('bcrypt');
const AuthenticationService = require('../services/AuthenticationService');

module.exports = class UserController {
  index(req, res) {
    res.send('Rota de usuários!');
  }

  async create(req, res) {
    const { username, email, password, office } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (user) {
        return res.status(422).send('Email já está em uso!');
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashPassword,
        office,
      });

      return res.status(201).send(newUser);
    } catch (err) {

      console.log(err);
      return res.status(500).send('Erro interno do servidor!');
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    const authenticationService = new AuthenticationService();
    return authenticationService.login(email, password, res);
  }

  async update(req, res) {
    try {
      console.log("Tentando encontrar usuário...")
      const { id } = req.params;
      const { username, email, password, office } = req.body;
      const user = await User.findOne({
        where: {
          id: id,
        },
      });

      if (!user) {
        return res.status(404).send('Usuário não encontrado!');
      }
      console.log("Usuário encontrado");

      if(email && email !== user.email) {
        console.log("Email diferente do atual:", email);
        const userExists = await User.findOne({
          where: {
            email: email,
          },
        });

        if(userExists) {
          console.log("Email já está em uso!");
          return res.status(422).send('Email já está em uso!');
        }
      }
      let hashPassword;
      if(password && password === user.password) {
        console.log("Senhas iguais!");
        return res.status(422).send('Senha igual a atual!');

      } else if(password && password !== user.password) {
        console.log("Senhas diferentes!");
        hashPassword = await bcrypt.hash(password, 10);
      }

      console.log("Tentando atualizar usuário...")
      const updatedUser = await User.update({
        username,
        email,
        password: hashPassword,
        office,
      }, {
        where: {
          id: id,
        },
      });
      console.log("Usuário atualizado");

      return res.status(200).send("Usuário atualizado com sucesso!");
    } catch (err) {
      console.log(err);
      return res.status(500).send('Erro interno do servidor!');
    }
  }

};