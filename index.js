require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(cors())

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.post('/formulario', (req, res) => {
    const { nome, sobrenome, email, celular, descricao } = req.body;

    const transporte = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    });

    const opcoesEmail = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Obrigado por testar meu projeto!',
        html:
            `<html>
                <body>
                    <h1>Olá ${nome} ${sobrenome},</h1>
                    <p>Muito obrigado por testar meu projeto de adoção de cães. Não se preocupe, nenhum dado que você passou no formulário ficará salvo.</p>
                    <p>Sua descrição: ${descricao}</p>
                    <p>Celular: ${celular}</p>
                </body>
            </html>`,
        text: `Olá ${nome} ${sobrenome}\n, Muito obrigado por testar meu projeto de adoção de cães. Não se preocupe, nenhum dado que você passou no formulário ficará salvo.\n Sua descrição: ${descricao}\n Celular: ${celular}`,
    };

    transporte.sendMail(opcoesEmail, (error, info) => {
        if (error) {
            console.log('Erro ao enviar e-mail', error);
            res.status(500).json({mensagem: 'Erro ao enviar o e-mail'});
        } else {
            console.log('E-mail enviado:', info.response);
            res.status(200).json({mensagem: 'E-mail enviado com sucesso'})
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log("Servidor rodando!" );
})