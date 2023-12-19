function obterDadosCliente(req, res) {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    const dadosCliente = {
        nome,
        email,
        cpf
    }
    if (cep) {
        dadosCliente.cep = cep
    }
    if (rua) {
        dadosCliente.rua = rua
    }
    if (numero) {
        dadosCliente.numero = numero
    }
    if (bairro) {
        dadosCliente.bairro = bairro
    }
    if (cidade) {
        dadosCliente.cidade = cidade
    }
    if (estado) {
        dadosCliente.estado = estado
    }

    return dadosCliente
}

module.exports = obterDadosCliente
