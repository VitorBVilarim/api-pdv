const nodemailer = require('nodemailer');

const transportador = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
});

const enviarEmail = async (destinatario, assunto, corpo) => {
    const envios = {
        from: process.env.MAIL_FROM,
        to: destinatario,
        subject: assunto,
        text: corpo,
    };

    try {
        await transportador.sendMail(envios);
        console.log(`E-mail enviado para ${destinatario}: Assunto - ${assunto}, Corpo - ${corpo}`);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw new Error('Erro ao enviar e-mail.');
    }
};

module.exports = {
    enviarEmail,
};
