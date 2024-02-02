import { conexaoDb } from '../conexao/conexao.js'

export default async function consultarCategoria(nomeCampo, campo) {
    return await conexaoDb('categorias').where(`${nomeCampo}`, `${campo}`)
}

