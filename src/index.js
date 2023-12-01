require('dotenv').config()

const cors = require('cors')

const express = require('express')
const app = express()

const rotas = require('./rotas/rotas')

app.use(cors())
app.use(express.json())

app.use(rotas)

const porta = process.env.PORT || 5432

app.listen(porta, () => { console.log(`API Rodando na porta ${porta}`) })