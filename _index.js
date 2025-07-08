const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Armazena sessões por número (simples em memória)
const sessions = {};

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
    const from = req.body.From;
    const body = req.body.Body.trim();

    if (!sessions[from]) {
        sessions[from] = { step: 0 };
    }

    const session = sessions[from];
    let reply = '';

    if (session.step === 0) {
        reply = "Bem-vindo ao menu:\n1. Ver saldo\n2. Recarregar";
        session.step = 1;
    } else if (session.step === 1) {
        if (body === '1') {
            reply = "Seu saldo é: 3.500 Kz.";
            session.step = 0; // Reinicia
        } else if (body === '2') {
            reply = "Digite o valor para recarregar:";
            session.step = 2;
        } else {
            reply = "Opção inválida.\n1. Ver saldo\n2. Recarregar";
        }
    } else if (session.step === 2) {
        const valor = parseInt(body);
        if (!isNaN(valor)) {
            reply = `Recarregado com sucesso: ${valor} Kz.`;
        } else {
            reply = "Valor inválido. Digite um número.";
        }
        session.step = 0;
    }

    const twiml = `
<Response>
  <Message>${reply}</Message>
</Response>`;

    res.type('text/xml');
    res.send(twiml);
});

app.listen(port, () => {
    console.log(`Servidor USSD via SMS ouvindo em http://localhost:${port}`);
});

