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
        }).returning('id')

        return res.status(201).json({
            id: insertProduto[0].id,
            descricao,
            quantidade_estoque,
            valor,
            categoria: categoria[0].descricao
        })

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}


async function atualizarProduto(req, res) {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: 'Informe qual produto deseja editar!' })
        }

        const produto = await knex('produtos').where({ id: id }).returning('*')

        if (produto.length < 1) {
            return res.status(404).json({ message: 'o Produto informado não existe!' })
        }

        const categoria = await consultarCategoria('id', categoria_id)

        if (categoria.length < 1) {
            return res.status(404).json({ message: 'Não foi possivel encontrar a categoria informada!' })
        }

        await knex("produtos").update({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).where({ id: id })

        return res.status(200).json({
            descricao,
            quantidade_estoque,
            valor,
            categoria: categoria[0].descricao
        })
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

async function listarProdutos(req, res) {
    const { categoria_id } = req.query
    try {
        if (categoria_id) {
            const produtos = await knex("produtos").where({ categoria_id: categoria_id }).select('*')

            if (produtos.length < 1) {
                return res.status(404).json({ message: ' Não existe nenhum produto com a categoria informada!' })
            }

            return res.status(200).json(produtos)
        }

        const produtos = await knex("produtos").select('*')

        return res.status(200).json(produtos)
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

async function detalharProduto(req, res) {
    const { id } = req.params
    try {
        if (!id) {
            return res.status(400).json({ message: 'Informe qual produto deseja detalhar!' })
        }

        const produto = await knex('produtos').where({ id: id }).returning('*')

        if (produto.length < 1) {
            return res.status(404).json({ message: 'o Produto informado não existe!' })
        }

        res.status(200).json(produto[0])
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

async function deletarProduto(req, res) {
    const { id } = req.params;
    try {
        const produto = await knex('produtos').where({ id: id }).returning('*')

        if (produto.length < 1) {
            return res.status(404).json({ message: 'o Produto informado não existe!' })
        }

        await knex("produtos").delete().where({ id: id })

        return res.status(200).json(produto[0])
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

module.exports = {
    cadastrarProduto,
    atualizarProduto,
    listarProdutos,
    detalharProduto,
    deletarProduto
}