const knex = require('../conexao/conexao');

async function consultarUsuario (nomeCampo, campo) {
    return await knex('usuarios').where(`${nomeCampo}`, `${campo}`)
}

module.exports = consultarUsuario
