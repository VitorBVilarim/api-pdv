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
    }),

    cep: joi.string().messages({
        'string.base': 'Os dados do endereço devem ser do tipo texto(string)'
    }),
    
    rua: joi.string().messages({
        'string.base': 'Os dados do endereço devem ser do tipo texto(string)'
    }),
    
    numero: joi.string().messages({
        'string.base': 'Os dados do endereço devem ser do tipo texto(string)'
    }),
    
    bairro: joi.string().messages({
        'string.base': 'Os dados do endereço devem ser do tipo texto(string)'
    }),
    
    cidade: joi.string().messages({
        'string.base': 'Os dados do endereço devem ser do tipo texto(string)'
    }),
    
    estado: joi.string().messages({
        'string.base': 'Os dados do endereço devem ser do tipo texto(string)'
    }),
})

module.exports = schemaCliente