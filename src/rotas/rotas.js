const express = require('express')
const rotas = express()
const multer = require('../multer')

const { listarCategorias } = require('../controladores/categorias')
const {
    cadastrarUsuario,
    login,
    detalharPerfilUsuario,
    editarPerfilUsuario
} = require('../controladores/usuarios')
const {
    cadastrarProduto,
    atualizarProduto,
    listarProdutos,
    detalharProduto,
    deletarProduto
} = require('../controladores/produtos')
const {
    cadastrarCliente,
    atualizarCliente,
    listarClientes,
    detalharCliente } = require('../controladores/clientes')

const schemaUsuario = require('../intermediarios/schema-usuario')
const schemaProduto = require('../intermediarios/schema-produto')
const schemaCliente = require('../intermediarios/schema-cliente')

const validarCorpoRequisicao = require('../intermediarios/validar-corpo-requisicao')
const verificarLogin = require('../intermediarios/verificar-login')

rotas.get('/categorias', listarCategorias)

rotas.post('/usuario', validarCorpoRequisicao(schemaUsuario), cadastrarUsuario)
rotas.post('/login', login)

rotas.use(verificarLogin)

rotas.get('/usuario', detalharPerfilUsuario)
rotas.put('/usuario', validarCorpoRequisicao(schemaUsuario), editarPerfilUsuario);

rotas.post('/produto', multer.single('produto_imagem'), validarCorpoRequisicao(schemaProduto), cadastrarProduto)
rotas.put('/produto/:id', multer.single('produto_imagem'), validarCorpoRequisicao(schemaProduto), atualizarProduto)
rotas.get('/produto', listarProdutos)
rotas.get('/produto/:id', detalharProduto)
rotas.delete('/produto/:id', deletarProduto)

rotas.post('/cliente', validarCorpoRequisicao(schemaCliente), cadastrarCliente);
rotas.put('/cliente/:id', validarCorpoRequisicao(schemaCliente), atualizarCliente);
rotas.get('/cliente', listarClientes)
rotas.get('/cliente/:id', detalharCliente)

module.exports = rotas