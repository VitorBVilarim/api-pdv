const joi = require('joi')

const schemaProduto = joi.object({
    descricao: joi.string().required().messages({
        'any.required': 'O campo descrição é obrigatório',
        'string.empty': 'O campo descrição é obrigatório',
    }),

    quantidade_estoque: joi.number().required().messages({
        'any.required': 'a Quantidade em estoque é obrigatória',
        'string.empty': 'a Quantidade em estoque é obrigatória',
        'number.base': 'a Quantidade precisa ser um numero!'
    }),

    valor: joi.number().required().messages({
        'any.required': 'O campo valor é obrigatório',
        'number.empty': 'O campo valor é obrigatório',
        'number.base': 'o Valor precisa ser um numero!'
    }),

    categoria_id: joi.number().required().messages({
        'any.required': 'O campo Id da Categoria é obrigatório',
        'number.empty': 'O campo Id da Categoria é obrigatório',
    })
})

module.exports = schemaProduto