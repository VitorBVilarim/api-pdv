const express = require('express')
const rotas = express()

const { listarCategorias } = require('../controladores/categorias')


rotas.get('/categorias', listarCategorias)

module.exports = rotas