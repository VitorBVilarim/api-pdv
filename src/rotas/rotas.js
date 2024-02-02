import express from 'express'

import multer from '../multer.js'

import listarCategorias from '../controladores/categorias.js'
import {
    cadastrarUsuario,
    login,
    detalharPerfilUsuario,
    editarPerfilUsuario
} from '../controladores/usuarios.js'
import {
    cadastrarProduto,
    atualizarProduto,
    listarProdutos,
    detalharProduto,
    deletarProduto
} from '../controladores/produtos.js'
import {
    cadastrarCliente,
    atualizarCliente,
    listarClientes,
    detalharCliente
} from '../controladores/clientes.js'

import { validarCorpoRequisicao } from '../intermediarios/validar-corpo-requisicao.js'

import { schemaUsuario } from '../intermediarios/schema-usuario.js'

import { schemaProduto } from '../intermediarios/schema-produto.js'

import { schemaCliente } from '../intermediarios/schema-cliente.js'

import { schemaPedido } from '../intermediarios/schema-pedido.js'

import {
    cadastrarPedido,
    listarPedidos
} from '../controladores/pedido.js'

import { verificarLogin } from '../intermediarios/verificar-login.js'

export const rotas = express()

rotas.get('/categoria', listarCategorias)

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

rotas.post('/pedido', validarCorpoRequisicao(schemaPedido), cadastrarPedido);
rotas.get('/pedido', listarPedidos);

