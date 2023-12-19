const knex = require('../conexao/conexao');
const { enviarEmail } = require('../servicos/nodemailer');

async function cadastrarPedido(req, res) {
    const { cliente_id, observacao, pedido_produtos } = req.body

    try {
        const clienteExistente = await knex('clientes').where('id', cliente_id).first();

        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
        }

        const cliente = await knex('clientes').where({ id: cliente_id })

        if (cliente.length < 1) {
            return res.status(404).json({ message: 'o Cliente informado não consta no nosso sistema!' })
        }

        let valor_total = 0
        let indexErro = 0
        let indexErroProdutoInexistente = 0
        let indexErroProdutoSemEstoque = 0


        const validacaoProduto = await Promise.all(pedido_produtos.map(async produto => {
            let produtoExistente = await knex('produtos').where({ id: produto.produto_id }).returning('*')


            if (produtoExistente.length < 1) {
                indexErroProdutoInexistente += 1
                indexErro += 1

                return 'produtoInexistente'
            }
            if (produtoExistente[0].quantidade_estoque < produto.quantidade_produto) {
                indexErroProdutoSemEstoque += 1
                indexErro += 1

                return false
            } else if (indexErro < 1) {

                valor_total += produtoExistente[0].valor * produto.quantidade_produto

                const produto_id = produto.produto_id
                const quantidade_produto = produto.quantidade_produto
                const valor = produtoExistente[0].valor

                return {
                    produto_id,
                    quantidade_produto,
                    valor
                }
            }
        }));

        const verificEstoque = validacaoProduto.includes(false)
        const verificExistencia = validacaoProduto.includes('produtoInexistente')

        if (verificEstoque) {
            return res.status(400).json({ mensagem: `Estoque insuficiente para o produto.` });
        }

        if (verificExistencia) {
            return res.status(400).json({ mensagem: `o Produto informado não existe!` });
        }

        const pedidoCadastrado = await knex('pedidos')
            .insert({
                cliente_id,
                observacao,
                valor_total
            })
            .returning('id');

        await knex('pedido_produtos').insert(validacaoProduto.map(produto => ({
            pedido_id: pedidoCadastrado[0].id,
            produto_id: produto.produto_id,
            quantidade_produto: produto.quantidade_produto,
            valor_produto: produto.valor
        })));

        validacaoProduto.map(async produto => {
            await knex('produtos').where('id', produto.produto_id).decrement('quantidade_estoque', produto.quantidade_produto);
        })

        await enviarEmail(clienteExistente.email, 'Pedido Efetuado com Sucesso', 'Obrigado por fazer o pedido!');

        return res.status(201).json({ mensagem: 'Pedido cadastrado com sucesso.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor!' })
    }
}

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        let query = knex('pedidos')
            .select('pedidos.id', 'pedidos.valor_total', 'pedidos.observacao', 'pedidos.cliente_id',
                'pedido_produtos.quantidade_produto', 'pedido_produtos.valor_produto', 'pedido_produtos.pedido_id', 'pedido_produtos.produto_id')
            .join('pedido_produtos', 'pedidos.id', '=', 'pedido_produtos.pedido_id')

        if (cliente_id) {
            const clienteExistente = await knex('clientes').where('id', cliente_id).first();

            if (!clienteExistente) {
                return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
            }

            query = query.where('pedidos.cliente_id', cliente_id);
        }

        const pedidos = await query;

        if (!pedidos || pedidos.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhum pedido encontrado.' });
        }


        const resultadosFormatados = pedidos.map(pedido => {
            return {
                pedido: {
                    id: pedido.id,
                    valor_total: pedido.valor_total,
                    observacao: pedido.observacao,
                    cliente_id: pedido.cliente_id,
                },
                pedido_produtos: pedidos
                    .filter(p => p.id === pedido.id)
                    .map(p => ({
                        id: p.id,
                        quantidade_produto: p.quantidade_produto,
                        valor_produto: p.valor_produto,
                        pedido_id: p.pedido_id,
                        produto_id: p.produto_id,
                    })),
            };
        });

        return res.status(200).json(resultadosFormatados);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

module.exports = {
    cadastrarPedido,
    listarPedidos
};
