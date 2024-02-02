import { conexaoDb } from '../conexao/conexao.js';

export async function consultarUsuario(nomeCampo, campo) {
    return await conexaoDb('usuarios').where(`${nomeCampo}`, `${campo}`)
}


