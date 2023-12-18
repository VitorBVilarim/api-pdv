const knex = require('../conexao/conexao');
const consultarCategoria = require('../utils/consultar-categoria');
const { deletarImagem, inserirImagem } = require('../utils/storage');

async function cadastrarProduto(req, res) {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { file } = req

    try {
        const categoria = await consultarCategoria('id', categoria_id)

        if (categoria.length < 1) {
            return res.status(404).json({ mensagem: 'Não foi possivel encontrar a categoria informada!' })
        }

        if (quantidade_estoque < 0) {
            return res.status(400).json({ mensagem: 'Valores negativos não são permitidos no campo Quantidade em Estoque!' })
        }

        if (valor < 1) {
            return res.status(400).json({ mensagem: 'Digite um valor valido para o produto!' })
        }

        let produto_imagem = {}
        let url
        if (file) {
            produto_imagem = await inserirImagem(
                `produtos/${file.originalname.replace(' ', '_')}.replace('')`,
                file.buffer,
                file.mimetype
            )
            url = `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${produto_imagem.path}`
        } else {
            produto_imagem.path = null
            url = null
        }

        const inserirProduto = await knex("produtos").insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem: produto_imagem.path
        }).returning('id')

        return res.status(201).json({
            id: inserirProduto[0].id,
            descricao,
            quantidade_estoque,
            valor,
            categoria: categoria[0].descricao,
            produto_imagem: url
        })

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}


async function atualizarProduto(req, res) {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { file } = req

    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ mensagem: 'Informe qual produto deseja editar!' })
        }
        if (!Number(id)) {
            return res.status(400).json({ mensagem: 'O id informado deve ser um numero valido!' })
        }

        if (quantidade_estoque < 0) {
            return res.status(400).json({ mensagem: 'Valores negativos não são permitidos no campo Quantidade em Estoque!' })
        }

        if (valor < 1) {
            return res.status(400).json({ mensagem: 'Digite um valor valido para o produto!' })
        }

        const produto = await knex('produtos').where({ id: id }).returning('*')

        if (produto.length < 1) {
            return res.status(404).json({ mensagem: 'o Produto informado não existe!' })
        }

        const categoria = await consultarCategoria('id', categoria_id)

        if (categoria.length < 1) {
            return res.status(404).json({ mensagem: 'Não foi possivel encontrar a categoria informada!' })
        }

        let produto_imagem = {}
        let url
        if (file) {
            produto_imagem = await inserirImagem(
                `produtos/${file.originalname.replace(' ', '_')}`,
                file.buffer,
                file.mimetype
            )
            url = `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${produto_imagem.path}`
        } else {
            produto_imagem.path = null
            url = null
        }

        await knex("produtos").update({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem: produto_imagem.path
        }).where({ id: id })

        return res.status(200).json({
            id,
            descricao,
            quantidade_estoque,
            valor,
            categoria: categoria[0].descricao,
            produto_imagem: url

        })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}

async function listarProdutos(req, res) {
    const { categoria_id } = req.query
    try {
        if (categoria_id) {
            if (!Number(categoria_id)) {
                return res.status(400).json({ mensagem: 'O id da categoria deve ser um numero valido!' })
            }
            const produtos = await knex("produtos").where({ categoria_id: categoria_id }).select('*')

            if (produtos.length < 1) {
                return res.status(404).json({ mensagem: 'Não foi Encontrado um produto para a categoria informada!' })
            }

            return res.status(200).json(produtos)

        }

        const produtos = await knex("produtos").select('*')

        return res.status(200).json(produtos)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}

async function detalharProduto(req, res) {
    const { id } = req.params
    try {
        if (!id) {
            return res.status(400).json({ mensagem: 'Informe qual produto deseja detalhar!' })
        }
        if (!Number(id)) {
            return res.status(400).json({ mensagem: 'O id informado deve ser um numero valido!' })
        }
        const produto = await knex('produtos').where({ id: id }).returning('*')

        if (produto.length < 1) {
            return res.status(404).json({ mensagem: 'o Produto informado não existe!' })
        }

        res.status(200).json(produto[0])
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}

async function deletarProduto(req, res) {
    const { id } = req.params;
    try {
        if (!Number(id)) {
            return res.status(400).json({ mensagem: 'O id informado deve ser um numero valido!' })
        }
        const produto = await knex('produtos').where({ id: id }).returning('*')

        if (produto.length < 1) {
            return res.status(404).json({ mensagem: 'o Produto informado não existe!' })
        }

        const isProductInOrder = await knex('pedido_produtos').where({ produto_id: id })

        if (isProductInOrder.length > 0) {
            return res.status(400).json({ mensagem: 'Não foi possivel excluir o produto, Pois o Produto informado esta registrado em um pedido!' })
        }

        const file = await knex('produtos').where({ id: id }).select('produto_imagem')

        const { produto_imagem } = file[0]

        if (produto_imagem) {
            await deletarImagem(produto_imagem)
        }

        await knex("produtos").delete().where({ id: id })

        return res.status(200).json(produto[0])
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}


module.exports = {
    cadastrarProduto,
    atualizarProduto,
    listarProdutos,
    detalharProduto,
    deletarProduto
}