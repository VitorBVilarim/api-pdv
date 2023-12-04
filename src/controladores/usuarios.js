const knex = require('../conexao/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const consultarUsuario = require('../intermediarios/consultar-usuario');

async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    try {
        const existeEmail = await consultarUsuario('email', email)
        
        if (existeEmail.length > 0) {
            return res.status(400).json({ mensagem: 'Ja existe usuario cadastrado com o email informado.' });
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const cadastroUsuario = await knex('usuarios')
        .insert({
            nome,
            email,
            senha: senhaCriptografada
        })
        .returning(['nome', 'email'])

        return res.status(201).json(cadastroUsuario);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
};

async function login (req, res) {
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
console.log(senhaCorreta);
        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: "Email e/ou senha inválido(s)." });
        }

        const token = jwt.sign({ id: usuarioLogado.id }, process.env.SENHA_JWT, { expiresIn: '8h' });

        return res.status(200).json({
            usuario: usuarioLogado,
            token
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
};

async function detalharPerfilUsuario(req, res) {
    try {
        const { id } = req.usuario;

        const perfilUsuario = await knex('usuarios').where({ id });

        if (!perfilUsuario) {
            return res.status(404).json({ mensagem: 'Perfil de usuário não encontrado.' });
        }

        const { senha, ...perfilSemSenha } = perfilUsuario;

        return res.status(200).json(perfilSemSenha);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

async function editarPerfilUsuario(req, res) {
    const { nome, email, senha } = req.body;
    const { id } = req.usuario;

    try {

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: 'Os campos nome, email e senha são obrigatórios.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const perfilEditado = await knex('usuarios')
            .where('id', id)
            .update({
                nome,
                email,
                senha: senhaCriptografada,
            })
            .returning(['nome', 'email']);

        return res.status(200).json(perfilEditado);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

module.exports = {
    cadastrarUsuario,
    login,
    detalharPerfilUsuario,
    editarPerfilUsuario
}