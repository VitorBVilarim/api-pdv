import { conexaoDb } from '../conexao/conexao.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { consultarUsuario } from '../intermediarios/consultar-usuario.js';

export async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    try {
        const existeEmail = await consultarUsuario('email', email)

        if (existeEmail.length > 0) {
            return res.status(400).json({ mensagem: 'Ja existe usuario cadastrado com o email informado.' });
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const cadastroUsuario = await conexaoDb('usuarios')
            .insert({
                nome,
                email,
                senha: senhaCriptografada
            })
            .returning(['id', 'nome', 'email'])

        return res.status(201).json(cadastroUsuario);

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
};

export async function login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Deve ser informado o email e a senha." });
    }

    try {
        const existeUsuario = await consultarUsuario('email', email)

        if (existeUsuario.length < 1) {
            return res.status(400).json({ mensagem: "Email e/ou senha inválido(s)." });
        }
        const { senha: senhaUsuario, ...usuarioLogado } = existeUsuario[0];

        const senhaCorreta = await bcrypt.compare(senha, senhaUsuario);

        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: "Email e/ou senha inválido(s)." });
        }

        const token = jwt.sign({ id: usuarioLogado.id }, process.env.SENHA_JWT, { expiresIn: '8h' });

        return res.status(200).json({
            usuario: usuarioLogado,
            token
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
};

export async function detalharPerfilUsuario(req, res) {
    const usuario = req.usuario;
    try {

        return res.status(200).json(usuario);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

export async function editarPerfilUsuario(req, res) {
    const { nome, email, senha } = req.body;
    const usuario = req.usuario;

    try {
        const existeEmail = await consultarUsuario('email', email)
        if (existeEmail.length > 0) {
            if (existeEmail[0].email !== usuario.email) {
                return res.status(400).json({ mensagem: 'Ja existe usuario cadastrado com o email informado.' });
            }
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const perfilEditado = await conexaoDb('usuarios')
            .where('id', usuario.id)
            .update({
                nome,
                email,
                senha: senhaCriptografada,
            })
            .returning(['id', 'nome', 'email']);

        return res.status(200).json(perfilEditado);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}
