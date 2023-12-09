const knex = require('../conexao/conexao');
const obterDadosCliente = require('../intermediarios/obter-dados-cliente');

async function cadastrarCliente(req, res) {

    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    try {

        const emailExistente = await knex('clientes').where('email', email).first()
        if (emailExistente) {
            return res.status(400).json({ mensagem: 'Este e-mail já está em uso por outro cliente.' })
        }

        const cpfExistente = await knex('clientes').where('cpf', cpf).first()
        if (cpfExistente) {
            return res.status(400).json({ mensagem: 'Este CPF já está em uso por outro cliente.' })
        }

        const dadosCliente = obterDadosCliente(req, res)

        const clienteCadastrado = await knex('clientes')
            .insert(dadosCliente)
            .returning('*')

        return res.status(201).json(clienteCadastrado)
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

async function atualizarCliente(req, res) {

    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body
    const { id: idCliente } = req.params

    try {
        if (!Number(idCliente)) {
            return res.status(400).json({ message: 'O id informado deve ser um numero valido!' })
        }
        const clienteExistente = await knex('clientes').where('id', idCliente).first()
        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado.' })
        }

        const emailExistente = await knex('clientes')
            .where('email', email)
            .whereNot('id', idCliente)
            .first()
        if (emailExistente) {
            return res.status(400).json({ mensagem: 'Este e-mail já está em uso por outro cliente.' })
        }

        const cpfExistente = await knex('clientes')
            .where('cpf', cpf)
            .whereNot('id', idCliente)
            .first()
        if (cpfExistente) {
            return res.status(400).json({ mensagem: 'Este CPF já está em uso por outro cliente.' })
        }
        
        const dadosCliente = obterDadosCliente(req, res)

        const clienteAtualizado = await knex('clientes')
            .where('id', idCliente)
            .update(dadosCliente)
            .returning('*')

        return res.status(200).json(clienteAtualizado)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

async function listarClientes(req, res) {
    try {
        const clientes = await knex("clientes")

        return res.status(200).json(clientes)
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

async function detalharCliente(req, res) {
    const { id } = req.params
    
     
    try {
        if (!id) {
            return res.status(400).json({ message: 'Informe o id do cliente que deseja detalhar!' })
        }
        if (!Number(id)) {
            return res.status(400).json({ message: 'O id informado deve ser um numero valido!' })
        }

        const cliente = await knex('clientes').where({ id: id })

        if (cliente.length < 1) {
            return res.status(404).json({ message: 'o Cliente informado não existe!' })
        }

        res.status(200).json(cliente[0])
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

module.exports = {
  cadastrarCliente,
  atualizarCliente,
  listarClientes,
  detalharCliente
};