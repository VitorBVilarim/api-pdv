import joi from 'joi'

export const schemaPedido = joi.object({
    cliente_id: joi.number().required().messages({
        'any.required': 'o Id do cliente é obrigatório',
        'number.empty': 'o Id do cliente é obrigatório',
        'number.base': 'o Id do cliente precisa ser um numero!'
    }),

    observacao: joi.string().messages({
        'string.base': 'a Observação deve ser do tipo texto(string)'
    }),

    pedido_produtos: joi.array().required().items({

        produto_id: joi.number().required().messages({
            'any.required': 'o Id do produto é obrigatório',
            'number.empty': 'o Id do produto é obrigatório',
            'number.base': 'o Id do produto precisa ser um numero!',
        }),

        quantidade_produto: joi.number().required().messages({
            'any.required': 'a Quantidade do produto é obrigatória',
            'number.empty': 'a Quantidade do produto é obrigatória',
            'number.base': 'a Quantidade precisa ser um numero!'
        })
    }).messages({
        'any.required': 'os Produtos do pedido são obrigatorios',
        'number.empty': 'os Produtos do pedido são obrigatorios',
    }),


})

