const express = require('express')
const rotas = express()

const { listarCategorias } = require('../controladores/categorias')
const { cadastrarUsuario, login, detalharPerfilUsuario, editarPerfilUsuario } = require('../controladores/usuarios')
const validarCorpoRequisicao = require('../intermediarios/validar-corpo-requisicao')
const schemaUsuario = require('../intermediarios/schema-usuario')
const schemaProduto = require('../intermediarios/schema-produto')
const verificarLogin = require('../intermediarios/verificar-login')
const controllersProdutos = require('../controladores/produtos')

rotas.get('/categorias', listarCategorias)

rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario)
rotas.post('/login', login)


rotas.use(verificarLogin)

rotas.get('/usuario', detalharPerfilUsuario)
rotas.put('/usuario', validarCorpoRequisicao(schemaUsuario), editarPerfilUsuario);

rotas.post('/produto', validarCorpoRequisicao(schemaProduto), controllersProdutos.cadastrarProduto)
rotas.put('/produto/:id', validarCorpoRequisicao(schemaProduto), controllersProdutos.atualizarProduto)
rotas.get('/produto')
rotas.get('/produto/:id', controllersProdutos.detalharProduto)
rotas.delete('/produto/:id', controllersProdutos.deletarProduto)

module.exports = rotas