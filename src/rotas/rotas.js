const express = require('express')
const rotas = express()

const { listarCategorias } = require('../controladores/categorias')
const { cadastrarUsuario, login, detalharPerfilUsuario, editarPerfilUsuario } = require('../controladores/usuarios')
const validarCorpoRequisicao = require('../intermediarios/validar-corpo-requisicao')
const schemaUsuario = require('../intermediarios/schema-usuario')
const verificarLogin = require('../intermediarios/verificar-login')

rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario)
rotas.post('/login', login)
rotas.get('/usuario', verificarLogin, detalharPerfilUsuario)
rotas.put('/usuario', verificarLogin, validarCorpoRequisicao(schemaUsuario), editarPerfilUsuario);



rotas.use(verificarLogin)

rotas.get('/categorias', listarCategorias)


module.exports = rotas