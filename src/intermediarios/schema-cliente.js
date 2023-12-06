const joi = require('joi')

const schemaCliente = joi.object({
    nome: joi.string().required().messages({
        'any.required': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome é obrigatório',
    }),

    email: joi.string().email().required().messages({
        'string.email': 'O campo email precisa ter um formato válido',
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email é obrigatório',
    }),

    cpf: joi.string().max(15).required().messages({
        'any.required': 'O campo CPF é obrigatório',
        'string.empty': 'O campo CPF é obrigatório',
        'string.min': 'o CPF informado não existe!',
    })
})

module.exports = schemaCliente