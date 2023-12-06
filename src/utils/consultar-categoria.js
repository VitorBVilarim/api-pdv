const knex = require('../conexao/conexao');

async function consultarCategoria(nomeCampo, campo) {
    return await knex('categorias').where(`${nomeCampo}`, `${campo}`)
}

module.exports = consultarCategoria