import dotenv from 'dotenv/config.js'

import cors from 'cors'

import express from 'express'
const app = express()

import { rotas } from './rotas/rotas.js'

app.use(cors())
app.use(express.json())

app.use(rotas)

const porta = process.env.PORT || 5432

app.listen(porta, () => { console.log(`API Rodando na porta ${porta}`) })

