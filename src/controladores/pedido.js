const knex = require('../conexao/conexao');
const { enviarEmail } = require('../servicos/nodemailer');

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;
    const { id: idUsuarioLogado } = req.usuario;

    try {
        if (!cliente_id || !pedido_produtos || pedido_produtos.length === 0) {
            return res.status(400).json({ mensagem: 'Os campos cliente_id e pedido_produtos são obrigatórios.' });
        }

        const clienteExistente = await knex('clientes').where('id', cliente_id).first();

        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
        }

        let valor_total = 0

        const validarProdutos = await pedido_produtos.forEach(async (produto) => {
            const { produto_id, quantidade_produto } = produto;
            const produtoExistente = await knex('produtos').where('id', produto_id).first();


            if (!produtoExistente) {
                return res.status(404).json({ mensagem: `Produto com ID ${produto_id} não encontrado.` });
            }

            if (produtoExistente.quantidade_estoque < quantidade_produto) {
                return false
            }

            valor_total += produtoExistente.valor * quantidade_produto

            await knex('produtos')
                .where('id', produto_id)
                .decrement('quantidade_estoque', quantidade_produto);

            return {
                produto_id,
                quantidade_produto,
                valor: produtoExistente.valor
            };
        });
        console.log(validarProdutos)
        if (!validarProdutos[0]) {
            return res.status(400).json({ mensagem: `Estoque insuficiente para o produto.` });
        }

        if (validarProdutos.some(validacao => !validacao)) {
            return res.status(400).json({ mensagem: 'Erro ao validar produtos.' });
        }

        const pedidoCadastrado = await knex('pedidos')
            .insert({
                cliente_id,
                observacao,
                valor_total
            })
            .returning('id');

        await knex('pedido_produtos').insert(validarProdutos.map(produto => ({
            pedido_id: pedidoCadastrado[0].id,
            produto_id: produto.produto_id,
            quantidade_produto: produto.quantidade_produto,
            valor_produto: produto.valor
        })));

        await enviarEmail(clienteExistente.email, 'Pedido Efetuado com Sucesso', 'Obrigado por fazer o pedido!');

        return res.status(201).json({ mensagem: 'Pedido cadastrado com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query;

    try {
        let query = knex('pedidos')
            .select('pedidos.id', 'pedidos.valor_total', 'pedidos.observacao', 'pedidos.cliente_id')
            .join('pedidos_produtos', 'pedidos.id', '=', 'pedidos_produtos.pedido_id')
            .groupBy('pedidos.id');

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
