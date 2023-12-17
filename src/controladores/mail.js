const sendMailService = require('../servicos/nodemailer');

const sendMail = async (req, res) => {
    const { to, subject, body } = req.body;

    try {
        await sendMailService.send(to, subject, body);
        return res.json({ mensagem: 'E-mail enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).json({ mensagem: 'Erro ao enviar e-mail.' });
    }
};

module.exports = {
    sendMail,
};
