const knex = require('../conexao/conexao')

async function listarCategorias(req, res) {
    const categorias = await knex('categorias').select('*')

    return res.status(200).json(categorias)
}


module.exports = {
    listarCategorias,
}