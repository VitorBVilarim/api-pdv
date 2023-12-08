const knex = require('../conexao/conexao'); 

const schemaCliente = require('../intermediarios/schema-cliente');

async function cadastrarCliente(req, res) {

    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
    const { id: idUsuarioLogado } = req.usuario;

    try {

        await schemaCliente.validateAsync({ nome, email, cpf });

        const emailExistente = await knex('clientes').where('email', email).first();
        if (emailExistente) {
            return res.status(400).json({ mensagem: 'Este e-mail já está em uso por outro cliente.' });
        }

        const cpfExistente = await knex('clientes').where('cpf', cpf).first();
        if (cpfExistente) {
            return res.status(400).json({ mensagem: 'Este CPF já está em uso por outro cliente.' });
        }

        const clienteCadastrado = await knex('clientes')
            .insert({
                id_usuario: idUsuarioLogado,
                nome,
                email,
                cpf,
                cep,
                rua,
                numero,
                bairro,
                cidade,
                estado 
            })
            .returning(['id', 'nome', 'email', 'cpf']);

        return res.status(201).json(clienteCadastrado);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ mensagem: error.message });
    }
}

async function atualizarCliente(req, res) {

    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
    const { id: idUsuarioLogado } = req.usuario;
    const { id: idCliente } = req.params;

    try {

        const clienteExistente = await knex('clientes').where('id', idCliente).first();
        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
        }

        await schemaCliente.validateAsync({ nome, email, cpf });

        const emailExistente = await knex('clientes')
            .where('email', email)
            .whereNot('id', idCliente)
            .first();
        if (emailExistente) {
            return res.status(400).json({ mensagem: 'Este e-mail já está em uso por outro cliente.' });
        }

        const cpfExistente = await knex('clientes')
            .where('cpf', cpf)
            .whereNot('id', idCliente)
            .first();
        if (cpfExistente) {
            return res.status(400).json({ mensagem: 'Este CPF já está em uso por outro cliente.' });
        }

        const clienteAtualizado = await knex('clientes')
            .where('id', idCliente)
            .update({
                id_usuario: idUsuarioLogado,
                nome,
                email,
                cpf,
                cep,
                rua,
                numero,
                bairro,
                cidade,
                estado
            })
            .returning(['id', 'nome', 'email', 'cpf']);

        return res.status(200).json(clienteAtualizado);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = {
  cadastrarCliente,
  atualizarCliente,
};