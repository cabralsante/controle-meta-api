const jwt = require('jsonwebtoken');
const User = require('../models/User');

const Auth = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Token não enviado!');
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET, (err, payload) => {
      if (err) {
        throw new Error("Token inválido!");
      }

      return payload;
    }); // VERIFICA SE O TOKEN É VÁLIDO
    console.log("Payload:", payload.id);

    const user = await User.findOne({ // VERIFICA SE O USUÁRIO EXISTE NO BANCO DE DADOS
      where: {
        id: payload.id,
      },
    });
    console.log("Usário encontrado para validação de token");

    if (!user) {
      return res.status(401).send('Acesso negado!');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.message === "Token inválido!") {
      return res.status(401).send(err.message);
    }

    console.log(err);
    return res.status(500).send('Erro interno do servidor ao validar token!');
  }
}

module.exports = { Auth };