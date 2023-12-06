const knex = require('../conexao/conexao'); 

const schemaCliente = require('../intermediarios/schema-cliente');

async function cadastrarCliente(req, res) {
    const { nome, email, cpf } = req.body;
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
                nome,
                email,
                cpf,
                id_usuario: idUsuarioLogado,
            })
            .returning(['id', 'nome', 'email', 'cpf']);

        return res.status(201).json(clienteCadastrado);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = {
  cadastrarCliente,
  atualizarCliente,
};