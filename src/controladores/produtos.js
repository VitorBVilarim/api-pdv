import { conexaoDb } from '../conexao/conexao.js'
import consultarCategoria from '../utils/consultar-categoria.js';
import { deletarImagem, inserirImagem } from '../utils/storage.js';

export async function cadastrarProduto(req, res) {
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

        let produto_imagem = null
        let url = null

        if (file) {
            produto_imagem = await inserirImagem(
                `produtos/${file.originalname.replace(' ', '_')}.replace('')`,
                file.buffer,
                file.mimetype
            )
            url = produto_imagem.url

            produto_imagem = `produtos/${file.originalname.replace(' ', '_')}`
        }

        const inserirProduto = await conexaoDb("produtos").insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem
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
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}


export async function atualizarProduto(req, res) {
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

        const produto = await conexaoDb('produtos').where({ id: id }).returning('*')

        if (produto.length < 1) {
            return res.status(404).json({ mensagem: 'o Produto informado não existe!' })
        }

        const categoria = await consultarCategoria('id', categoria_id)

        if (categoria.length < 1) {
            return res.status(404).json({ mensagem: 'Não foi possivel encontrar a categoria informada!' })
        }

        let produto_imagem = null
        let url = null

        if (file) {
            const adicionarImagem = await inserirImagem(
                `produtos/${file.originalname.replace(' ', '_')}`,
                file.buffer,
                file.mimetype
            )
            url = adicionarImagem.url

            produto_imagem = `produtos/${file.originalname.replace(' ', '_')}`
        }

        const produtoAtualizado = await conexaoDb("produtos").update({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem
        }).where({ id: id })
            .returning('*')

        return res.status(200).json({
            id: produtoAtualizado[0].id,
            descricao: produtoAtualizado[0].descricao,
            quantidade_estoque: produtoAtualizado[0].quantidade_estoque,
            valor: produtoAtualizado[0].valor,
            categoria: categoria[0].descricao,
            produto_imagem: url

        })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}

export async function listarProdutos(req, res) {
    const { categoria_id } = req.query
    try {
        if (categoria_id) {
            if (!Number(categoria_id)) {
                return res.status(400).json({ mensagem: 'O id da categoria deve ser um numero valido!' })
            }
            const produtos = await conexaoDb("produtos").where({ categoria_id: categoria_id }).select('*')

            if (produtos.length < 1) {
                return res.status(404).json({ mensagem: 'Não foi Encontrado um produto para a categoria informada!' })
            }

            return res.status(200).json(produtos)

        }

        const produtos = await conexaoDb("produtos").select('*')

        return res.status(200).json(produtos)
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}

export async function detalharProduto(req, res) {
    const { id } = req.params
    try {
        if (!id) {
            return res.status(400).json({ mensagem: 'Informe qual produto deseja detalhar!' })
        }
        if (!Number(id)) {
            return res.status(400).json({ mensagem: 'O id informado deve ser um numero valido!' })
        }
        const produto = await conexaoDb('produtos').where({ id: id }).returning('*')

        if (produto.length < 1) {
            return res.status(404).json({ mensagem: 'o Produto informado não existe!' })
        }

        res.status(200).json(produto[0])
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}

export async function deletarProduto(req, res) {
    const { id } = req.params;
    try {
        if (!Number(id)) {
            return res.status(400).json({ mensagem: 'O id informado deve ser um numero valido!' })
        }
        const produto = await conexaoDb('produtos').where({ id: id }).returning('*')

        if (produto.length < 1) {
            return res.status(404).json({ mensagem: 'o Produto informado não existe!' })
        }

        const isProductInOrder = await conexaoDb('pedido_produtos').where({ produto_id: id })

        if (isProductInOrder.length > 0) {
            return res.status(400).json({ mensagem: 'Não foi possivel excluir o produto, Pois o Produto informado esta registrado em um pedido!' })
        }

        const file = await conexaoDb('produtos').where({ id: id }).select('produto_imagem')

        const { produto_imagem } = file[0]

        if (produto_imagem) {
            await deletarImagem(produto_imagem)
        }

        await conexaoDb("produtos").delete().where({ id: id })

        return res.status(200).json(produto[0])
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }
}

