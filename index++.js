const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const translations = require("./translations");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

const userSessions = {};
const tips = [
  "Use mosquiteiro tratado com inseticida.",
  "Evite água parada perto de casa.",
  "Cubra-se ao dormir, principalmente à noite.",
];
const campaigns = [
  { title: "Vacinação gratuita", location: "Zango" },
  { title: "Palestra comunitária", location: "Cazenga" },
];

app.post("/sms", async (req, res) => {
  const phone = req.body.From;
  const incomingMsg = req.body.Body.trim();
  let responseMsg = "";

  if (!userSessions[phone]) {
    userSessions[phone] = { step: 0, lang: null, inputs: [], tipIndex: 0 };
  }

  const session = userSessions[phone];
  const lang = session.lang || "pt";
  const t = translations[lang];

  // === Passo 0: Escolha de idioma ===
  if (session.step === 0) {
    responseMsg = `🌍 Escolha o idioma:\n1️⃣ Português\n2️⃣ Umbundu\n3️⃣ Inglês`;
    session.step = 1;
  }
  // === Passo 1: Salvar idioma e mostrar menu principal ===
  else if (session.step === 1) {
    if (incomingMsg === "1") session.lang = "pt";
    else if (incomingMsg === "2") session.lang = "umb";
    else if (incomingMsg === "3") session.lang = "en";
    else session.lang = "pt";

    session.step = 2;
    responseMsg = `🦟 ${t.welcome}\n\n${t.mainMenu}`;
  }
  // === Passo 2: Processar menu principal ===
  else if (session.step === 2) {
    session.inputs[0] = incomingMsg;
    if (incomingMsg === "1") {
      session.step = 3;
      responseMsg = t.askProvincia;
    } else if (incomingMsg === "2") {
      responseMsg = `${t.criticalZones}\nZango 3\nCazenga\nKikolo`;
      delete userSessions[phone];
    } else if (incomingMsg === "3") {
      responseMsg = t.dicaLabel(0, tips[0]);
      session.tipIndex = 0;
      session.step = 20;
    } else if (incomingMsg === "4") {
      session.step = 4;
      responseMsg = t.askBairro;
    } else {
      responseMsg = t.exit;
      delete userSessions[phone];
    }
  }
  // === Reportar Caso ===
  else if (session.inputs[0] === "1") {
    session.inputs.push(incomingMsg);
    const inputLength = session.inputs.length;

    if (inputLength === 2) responseMsg = t.askMunicipio;
    else if (inputLength === 3) responseMsg = t.askBairro;
    else if (inputLength === 4) responseMsg = t.confirmRisk;
    else if (inputLength === 5) {
      if (incomingMsg === "1") {
        responseMsg = t.nivelRisco;
      } else {
        responseMsg = t.cancel;
        delete userSessions[phone];
      }
    } else if (inputLength === 6) {
      const sessionId = `sms-${phone}-${Date.now()}`;
      const reportData = {
        sessionId,
        phone,
        serviceCode: "*123#",
        text: `1*${session.inputs.slice(1).join("*")}`,
      };

      try {
          await axios.post("https://mapazzz-backend.onrender.com/api/ussd", reportData);
          console.log("Enviando dados para API:", reportData);
        responseMsg = t.thankYou;
      } catch (err) {
        console.error("Erro API:", err.message);
        responseMsg = t.apiError;
      }
      delete userSessions[phone];
    }
  }
  // === Dicas ===
  else if (session.inputs[0] === "3") {
    if (incomingMsg === "1") {
      session.tipIndex++;
      if (session.tipIndex < tips.length)
        responseMsg = t.dicaLabel(session.tipIndex, tips[session.tipIndex]);
      else {
        responseMsg = t.exit;
        delete userSessions[phone];
      }
    } else {
      responseMsg = t.exit;
      delete userSessions[phone];
    }
  }
  // === Campanhas ===
  else if (session.inputs[0] === "4") {
    if (session.step === 4) {
      const zona = incomingMsg.toLowerCase();
      const results = campaigns.filter((c) =>
        c.location.toLowerCase().includes(zona)
      );
      if (results.length > 0) {
        responseMsg =
          "📢 Campanhas:\n" +
          results.map((c) => `- ${c.title} - ${c.location}`).join("\n");
      } else {
        responseMsg = t.noCampaigns;
      }
      delete userSessions[phone];
    }
  } else {
    responseMsg = t.invalid;
    delete userSessions[phone];
  }

  const twiml = `<Response><Message>${responseMsg}</Message></Response>`;
  res.set("Content-Type", "text/xml");
  res.send(twiml);
});

app.listen(port, () => {
  console.log(`🚀 MAPAZZZ SMS via Twilio rodando em http://localhost:${port}`);
});
