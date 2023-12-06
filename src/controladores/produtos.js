const knex = require('../conexao/conexao');
const consultarCategoria = require('../utils/consultar-categoria');


async function cadastrarProduto(req, res) {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    try {
        const categoria = await consultarCategoria('id', categoria_id)

        if (categoria.length < 1) {
            return res.status(404).json({ message: 'Não foi possivel encontrar a categoria informada!' })
        }

        const insertProduto = await knex("produtos").insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).debug()
        console.log(categoria)
        return res.status(201).json({
            descricao,
            quantidade_estoque,
            valor,
            categoria: categoria[0].descricao
        })

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

module.exports = cadastrarProduto