# USSD com Twilio e SMS

Um sistema interativo via SMS usando Twilio que oferece funcionalidades de consulta de saldo, recarga de crédito e informações sobre saúde pública com suporte multilíngue.

## Imagem de demostração
<img src="imagem.jpg" heigth="600" width="300"/>


## Descrição

Este projeto implementa dois tipos de sistemas USSD (Unstructured Supplementary Service Data):

- **_index.js**: Sistema simples de consulta de saldo e recarga de créditos
- **index++.js**: Sistema avançado "MAPAZZZ" para reportar casos de risco de malária com suporte multilíngue (Português, Umbundu, Inglês)


## ✨ Funcionalidades

### Versão Simples (_index.js)
- Consulta de saldo
- Recarga de crédito
- Gestão de sessões por número de telefone
- Menu interativo por SMS

### Versão Avançada (index++.js) - MAPAZZZ
- 🌍 Suporte multilíngue (Português, Umbundu, Inglês)
- 🦟 Reportar casos de risco de malária
- 📊 Consultar zonas críticas
- 💡 Dicas de prevenção
- 📢 Ver campanhas comunitárias próximas
- 📍 Integração com Twilio para SMS

## 🛠️ Requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Conta Twilio (para usar o sistema com SMS reais)

## Instalação

1. Clone ou extraia o projeto:
```bash
cd Simulacao_USSD_COM-TWILLIO_E_SMS
```

2. Instale as dependências:
```bash
npm install
```

As dependências principais são:
- **express**: Framework web
- **body-parser**: Middleware para processar requisições
- **axios**: Cliente HTTP para chamar APIs externas

## Como Usar

### Iniciar o servidor (versão avançada):
```bash
node index++.js
```

O servidor ficará disponível em `http://localhost:3000`

### Iniciar o servidor (versão simples):
```bash
node _index.js
```

## 📡 API Endpoints

### POST /sms
Recebe mensagens SMS do Twilio e responde com o menu interativo.

**Parâmetros esperados (form-data):**
- `From`: Número de telefone do utilizador
- `Body`: Conteúdo da mensagem SMS

**Resposta:**
- XML no formato TwiML (Twilio Markup Language)

### GET /
Verifica se o servidor está online.

**Resposta:**
```
Gilson, Servidor está online
```

## 🌐 Suporte Multilíngue

O sistema suporta 3 idiomas:
- **1** - Português (pt)
- **2** - Umbundu (umb)
- **3** - Inglês (en)

Todas as mensagens são definidas no ficheiro `translations.js` para fácil manutenção e adição de novos idiomas.

## Estrutura do Projeto

```
.
├── _index.js           # Sistema simples de saldo e recarga
├── index++.js          # Sistema MAPAZZZ avançado
├── translations.js     # Dicionário multilíngue
├── package.json        # Dependências do projeto
└── README.md          # Este ficheiro
```

## 🔄 Fluxo de Utilização (MAPAZZZ)

```
1. Utilizador inicia conversa → Escolhe idioma
   ↓
2. Sistema exibe menu principal com 5 opções
   ↓
3. Utilizador escolhe uma opção:
   - 1: Reportar caso de risco
   - 2: Ver zonas críticas
   - 3: Ver dicas de prevenção
   - 4: Ver campanhas próximas
   - 5: Sair
```

### Fluxo Détalhado - Reportar Caso

1. Utilizador escolhe "Reportar caso" (opção 1)
2. Sistema pede: Província
3. Sistema pede: Município
4. Sistema pede: Bairro
5. Sistema pede: Confirmação do risco
6. Sistema pede: Nível de risco (Baixo/Médio/Alto)
7. Dados são enviados para API backend
8. Sessão encerra

## 💾 Gestão de Sessões

As sessões são armazenadas em memória, mantendo:
- Número de telefone do utilizador
- Etapa atual do fluxo
- Idioma selecionado
- Inputs do utilizador
- Índice de dica (para dicas de prevenção)

**Nota**: As sessões são perdidas quando o servidor reinicia. Para produção, considere usar um banco de dados.

## 🔗 Integração com APIs Externas

O sistema envia relatórios de risco para um backend:
- **URL**: `https://mapazzz-backend.onrender.com/api/ussd`
- **Método**: POST
- **Dados**: sessionId, phone, serviceCode, dados do relatório

## Exemplos de Uso

### Exemplo de um fluxo SMS (em Português):

```
Utilizador: (inicia)
Sistema: 🌍 Escolha o idioma:
         1️⃣ Português
         2️⃣ Umbundu
         3️⃣ Inglês

Utilizador: 1
Sistema: 🦟 Bem-vindo ao MAPAZZZ
         1️⃣ Reportar caso de risco
         2️⃣ Ver zonas críticas
         3️⃣ Dicas de prevenção
         4️⃣ Campanhas perto de mim
         5️⃣ Sair

Utilizador: 3
Sistema: Dica 1: Use mosquiteiro tratado com inseticida.
         1️⃣ Próxima
         0️⃣ Voltar
```

## 🔧 Configuração do Twilio

Para conectar a um número Twilio real:

1. Crie uma conta em [Twilio.com](https://www.twilio.com)
2. Configure um número de telefone
3. Aponte o webhook SMS para: `https://seu-dominio.com/sms`
4. Use um serviço como ngrok para testar localmente:
   ```bash
   ngrok http 3000
   ```

## 🚨 Dicas de Prevenção (Incluídas)

- Use mosquiteiro tratado com inseticida
- Evite água parada perto de casa
- Cubra-se ao dormir, principalmente à noite

## 📢 Campanhas (Exemplo)

- Vacinação gratuita - Zango
- Palestra comunitária - Cazenga

## 🔐 Notas de Segurança

- As sessões são armazenadas em memória sem criptografia
- Para produção, implemente validação de entrada mais robusta
- Considere usar um banco de dados seguro para persistência
- Valide e sanitize todas as entradas do utilizador

##  Licença

ISC

## 👤 Autor

Gilson Chipombo
