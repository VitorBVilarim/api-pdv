import { conexaoDb } from '../conexao/conexao.js'

export default async function listarCategorias(req, res) {
    try {
        const categorias = await conexaoDb('categorias').select('*')

        return res.status(200).json(categorias)
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor' })
    }

}


