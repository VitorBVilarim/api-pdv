import { conexaoDb } from '../conexao/conexao.js'

export async function cadastrarCliente(req, res) {

    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    try {

        const emailExistente = await conexaoDb('clientes').where('email', email).first()
        if (emailExistente) {
            return res.status(400).json({ mensagem: 'Este e-mail já está em uso por outro cliente.' })
        }

        const cpfExistente = await conexaoDb('clientes').where('cpf', cpf).first()
        if (cpfExistente) {
            return res.status(400).json({ mensagem: 'Este CPF já está em uso por outro cliente.' })
        }


        const clienteCadastrado = await conexaoDb('clientes')
            .insert({
                nome, email, cpf, cep, rua, numero, bairro, cidade, estado
            })
            .returning('*')

        return res.status(201).json(clienteCadastrado[0])
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

export async function atualizarCliente(req, res) {

    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body
    const { id: idCliente } = req.params

    try {
        if (!Number(idCliente)) {
            return res.status(400).json({ message: 'O id informado deve ser um numero valido!' })
        }
        const clienteExistente = await conexaoDb('clientes').where('id', idCliente).first()
        if (!clienteExistente) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado.' })
        }

        const emailExistente = await conexaoDb('clientes')
            .where('email', email)
            .whereNot('id', idCliente)
            .first()
        if (emailExistente) {
            return res.status(400).json({ mensagem: 'Este e-mail já está em uso por outro cliente.' })
        }

        const cpfExistente = await conexaoDb('clientes')
            .where('cpf', cpf)
            .whereNot('id', idCliente)
            .first()
        if (cpfExistente) {
            return res.status(400).json({ mensagem: 'Este CPF já está em uso por outro cliente.' })
        }

        const clienteAtualizado = await conexaoDb('clientes')
            .update({
                nome,
                email,
                cpf,
                cep: cep || null,
                rua: rua || null,
                numero: numero || null,
                bairro: bairro || null,
                cidade: cidade || null,
                estado: estado || null
            })
            .where('id', idCliente)
            .returning('*')
            .debug()

        return res.status(200).json(clienteAtualizado[0])
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

export async function listarClientes(req, res) {
    try {
        const clientes = await conexaoDb("clientes")

        return res.status(200).json(clientes)
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

export async function detalharCliente(req, res) {
    const { id } = req.params


    try {
        const cliente = await conexaoDb('clientes').where({ id: Number(id) })

        if (cliente.length < 1) {
            return res.status(404).json({ message: 'o Cliente informado não existe!' })
        }

        res.status(200).json(cliente[0])
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }
}

