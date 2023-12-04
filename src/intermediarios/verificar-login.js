const jwt = require('jsonwebtoken');
const knex = require('../conexao/conexao');

async function verificarLogin(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, process.env.SENHA_JWT);

        const usuarioLogado = await knex('usuarios').where({id})
      
        if (!usuarioLogado) {
            return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
        }

        const { senha, ...usuario } = usuarioLogado[0];

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }
};

module.exports = verificarLogin;