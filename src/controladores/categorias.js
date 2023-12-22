const knex = require('../conexao/conexao')

async function listarCategorias(req, res) {
    try {
        const categorias = await knex('categorias').select('*')

        return res.status(200).json(categorias)
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }

}


module.exports = {
    listarCategorias,
}