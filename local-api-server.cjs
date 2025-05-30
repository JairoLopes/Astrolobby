// local-api-server.cjs
// Este arquivo é o servidor Express local que simula as Serverless Functions da Vercel para desenvolvimento.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Carrega variáveis de ambiente do arquivo .env que está na raiz do projeto.
// Isso permite que o servidor local acesse as chaves de API e a porta.
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000; // Define a porta do servidor, padrão 5000

// --- Configuração do CORS para Desenvolvimento Local ---
// Permite que o frontend (rodando em uma porta diferente, como 5173 ou 5174)
// faça requisições para este backend local (rodando em 5000).
// É crucial que a origem do seu frontend local esteja listada aqui.
// Adicione outras portas de localhost se o Vite/seu dev server mudar.
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Porta comum do Vite
      "http://localhost:5174", // Porta que o Vite está usando agora
      "http://localhost:3000", // Porta comum do Create React App ou outros
      // Se o seu frontend estiver em outro localhost:PORT, adicione-o aqui.
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos na requisição
  })
);

app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// --- ROTEAMENTO DAS FUNÇÕES SERVERLESS ---
// Importa e "expõe" suas funções serverless (que estão na pasta 'api/') como rotas Express.
// O '.default' é usado porque suas funções em 'api/' usam 'export default'.
const nasaApodHandler = require("./api/nasa-apod").default;
const nasaNewsTranslatedHandler = require("./api/nasa-news-translated").default;
const imageProxyHandler = require("./api/image-proxy").default;

// Rota para a Notícia do Dia (APOD)
// Todas as requisições para /api/nasa-apod serão tratadas pelo handler da função APOD.
app.all("/api/nasa-apod", async (req, res) => {
  await nasaApodHandler(req, res);
});

// Rota para as Últimas Notícias (traduzidas)
// Todas as requisições para /api/nasa-news-translated serão tratadas pelo handler da função de notícias.
app.all("/api/nasa-news-translated", async (req, res) => {
  await nasaNewsTranslatedHandler(req, res);
});

// Rota para o Proxy de Imagem/Vídeo
// Todas as requisições para /api/image-proxy serão tratadas pelo handler da função de proxy.
app.all("/api/image-proxy", async (req, res) => {
  await imageProxyHandler(req, res);
});

// --- INÍCIO DO SERVIDOR ---
// Inicia o servidor Express na porta definida e exibe as URLs dos endpoints.
app.listen(PORT, () => {
  console.log(`Servidor local de API rodando em http://localhost:${PORT}`);
  console.log(`APOD: http://localhost:${PORT}/api/nasa-apod`);
  console.log(`Notícias: http://localhost:${PORT}/api/nasa-news-translated`);
  console.log(`Proxy: http://localhost:${PORT}/api/image-proxy?url=`);
});
