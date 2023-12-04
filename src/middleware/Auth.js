const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Token não enviado!');
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET); // VERIFICA SE O TOKEN É VÁLIDO

    if(!payload) {
      return res.status(401).send('Token inválido!');
    }

    const user = await User.findOne({ // VERIFICA SE O USUÁRIO EXISTE NO BANCO DE DADOS
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      return res.status(401).send('Acesso negado!');
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send('Erro interno do servidor ao validar token!');
  }
}