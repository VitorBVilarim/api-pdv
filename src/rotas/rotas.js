const express = require('express')
const rotas = express()

const { listarCategorias } = require('../controladores/categorias')
const { cadastrarUsuario, login } = require('../controladores/usuarios')
const validarCorpoRequisicao = require('../intermediarios/validar-corpo-requisicao')
const schemaUsuario = require('../intermediarios/schema-usuario')
const verificarLogin = require('../intermediarios/verificar-login')

rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario)
rotas.post('/login', login)

rotas.use(verificarLogin)

rotas.get('/categorias', listarCategorias)


module.exports = rotas