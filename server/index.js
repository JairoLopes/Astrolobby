// Importações necessárias
const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Importa o axios para fazer requisições HTTP
const dotenv = require("dotenv"); // Importa o dotenv para carregar variáveis de ambiente do .env
const deepl = require("deepl-node"); // Importa a biblioteca DeepL

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 5000; // Define a porta do servidor, padrão 5000

app.use(cors()); // Habilita o CORS para permitir requisições do frontend
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// **Variáveis de ambiente e chaves da API**
const NASA_APOD_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY"; // Chave da NASA para APOD
const DEEPL_API_KEY = process.env.DEEPL_API_KEY; // Sua chave DeepL

// Inicializa o tradutor DeepL (apenas se a chave estiver disponível)
let deeplTranslator = null;
if (DEEPL_API_KEY) {
  try {
    deeplTranslator = new deepl.Translator(DEEPL_API_KEY);
    console.log("Tradutor DeepL inicializado com sucesso.");
  } catch (e) {
    console.error(
      "Erro ao inicializar o tradutor DeepL. Verifique sua DEEPL_API_KEY:",
      e.message
    );
    deeplTranslator = null; // Garante que o tradutor não seja usado se houver erro
  }
} else {
  console.warn(
    "DEEPL_API_KEY não encontrada no .env. As notícias não serão traduzidas."
  );
}

// Função auxiliar para traduzir texto usando DeepL
async function translateText(text, targetLang = "pt-BR") {
  if (!deeplTranslator || !text) {
    return text; // Retorna o texto original se o tradutor não estiver disponível ou o texto for vazio
  }
  try {
    const result = await deeplTranslator.translateText(text, null, targetLang);
    return result.text;
  } catch (error) {
    console.error("Erro ao traduzir texto com DeepL:", error.message);
    return text; // Retorna o texto original em caso de erro na tradução
  }
}

// --- Endpoint para Últimas Notícias (API de Imagem e Vídeo da NASA) ---
// Este endpoint busca notícias da NASA Image and Video Library, as traduz e as formata.
app.get("/api/nasa-news-translated", async (req, res) => {
  // Parâmetros de busca padrão (podem ser substituídos por query parameters na requisição)
  const searchTerm = req.query.q || "space";
  const mediaTypes = req.query.media_type || "image,video";
  const pageSize = req.query.page_size || 5;

  // URL da API de Imagem e Vídeo da NASA, SEM os parâmetros 'sort' e 'sort_order'
  // Esta API geralmente não exige uma API Key para buscas públicas
  const NASA_LIB_API_URL = `https://images-api.nasa.gov/search?q=${searchTerm}&media_type=${mediaTypes}&page_size=${pageSize}`;

  try {
    const response = await axios.get(NASA_LIB_API_URL);
    const items = response.data.collection.items;

    const formattedNews = [];
    for (const item of items) {
      const itemData = item.data && item.data.length > 0 ? item.data[0] : {};
      const itemLinks = item.links && item.links.length > 0 ? item.links : [];

      let mediaUrl = null;
      let finalMediaType = itemData.media_type;

      // --- INÍCIO DA LÓGICA ALTERADA PARA PRIORIZAR IMAGENS ---
      const potentialImageUrls = itemLinks
        .map((link) => link.href)
        .filter((url) => /\.(jpg|jpeg|png|gif|webp|tiff)$/i.test(url));
      const potentialVideoUrls = itemLinks
        .map((link) => link.href)
        .filter((url) => /\.(mp4|webm)$/i.test(url));

      if (potentialImageUrls.length > 0) {
        // Prioriza a imagem de thumbnail ou a primeira imagem encontrada
        mediaUrl =
          potentialImageUrls.find((url) => url.includes("~thumb")) ||
          potentialImageUrls[0];
        finalMediaType = "image";
      } else if (finalMediaType === "video" && item.href) {
        // Se não houver imagens, tenta pegar o vídeo principal do asset link
        try {
          const assetResponse = await axios.get(item.href);
          mediaUrl = assetResponse.data.find((url) =>
            /\.(mp4|webm)$/i.test(url)
          );
        } catch (assetError) {
          console.error(
            `Erro ao buscar assets de vídeo para ${item.id}:`,
            assetError.message
          );
        }
        if (!mediaUrl && potentialVideoUrls.length > 0) {
          mediaUrl = potentialVideoUrls[0]; // Fallback para vídeos em links diretos
        }
        finalMediaType = "video";
      } else if (potentialVideoUrls.length > 0) {
        // Se não há imagens e o tipo original não é vídeo (ou asset link falhou), usa o primeiro vídeo direto
        mediaUrl = potentialVideoUrls[0];
        finalMediaType = "video";
      }
      // --- FIM DA LÓGICA ALTERADA PARA PRIORIZAR IMAGENS ---

      // Formata a data para o padrão DD/MM/AAAA
      const date = itemData.date_created
        ? new Date(itemData.date_created).toLocaleDateString("pt-BR")
        : "Data desconhecida";

      // --- Tradução com DeepL para Últimas Notícias ---
      const originalTitle = itemData.title || "Título Desconhecido";
      const originalExplanation =
        itemData.description || "Nenhuma descrição disponível.";
      let translatedTitle = originalTitle;
      let translatedExplanation = originalExplanation;
      let isTranslated = false;

      if (deeplTranslator) {
        translatedTitle = await translateText(originalTitle, "pt-BR");
        translatedExplanation = await translateText(
          originalExplanation,
          "pt-BR"
        );
        isTranslated = true;
      }
      // --- Fim da Tradução para Últimas Notícias ---

      formattedNews.push({
        id: itemData.nasa_id || item.href,
        title: translatedTitle,
        explanation: translatedExplanation,
        url: mediaUrl,
        media_type: finalMediaType, // media_type agora reflete se pegamos imagem ou vídeo
        date: date,
        originalTitle: originalTitle,
        originalExplanation: originalExplanation,
        translated: isTranslated,
        translatedBy: isTranslated ? "DeepL" : null,
      });
    }

    res.json(formattedNews);
  } catch (error) {
    console.error(
      "Erro ao buscar notícias da NASA (Image/Video API):",
      error.response
        ? `Status: ${error.response.status}, Data: ${JSON.stringify(
            error.response.data
          )}`
        : error.message
    );
    res.status(500).json({ message: "Erro ao buscar notícias da NASA." });
  }
});

// --- NOVO Endpoint para a Notícia do Dia (APOD - Astronomy Picture of the Day) ---
// Este endpoint busca a imagem ou vídeo astronômico do dia, que muda diariamente.
app.get("/api/nasa-apod", async (req, res) => {
  try {
    const APOD_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_APOD_API_KEY}`;
    const response = await axios.get(APOD_API_URL);
    const apodData = response.data;

    // --- Tradução com DeepL para Notícia do Dia (APOD) ---
    const originalApodTitle = apodData.title || "Título Desconhecido";
    const originalApodExplanation =
      apodData.explanation || "Nenhuma descrição disponível.";
    let translatedApodTitle = originalApodTitle;
    let translatedApodExplanation = originalApodExplanation;
    let isTranslated = false;

    if (deeplTranslator) {
      translatedApodTitle = await translateText(originalApodTitle, "pt-BR");
      translatedApodExplanation = await translateText(
        originalApodExplanation,
        "pt-BR"
      );
      isTranslated = true;
    }
    // --- Fim da Tradução para Notícia do Dia (APOD) ---

    // Mapeia os dados da APOD para o formato NewsItem para consistência no frontend
    const dailyNewsItem = {
      id: apodData.date,
      title: translatedApodTitle,
      explanation: translatedApodExplanation,
      url: apodData.hdurl || apodData.url || null,
      media_type: apodData.media_type === "image" ? "image" : "video",
      date: new Date(apodData.date).toLocaleDateString("pt-BR"),
      originalTitle: originalApodTitle,
      originalExplanation: originalApodExplanation,
      translated: isTranslated,
      translatedBy: isTranslated ? "DeepL" : null,
    };

    res.json(dailyNewsItem);
  } catch (error) {
    console.error(
      "Erro ao buscar a APOD (APOD API):",
      error.response
        ? `Status: ${error.response.status}, Data: ${JSON.stringify(
            error.response.data
          )}`
        : error.message
    );
    res
      .status(500)
      .json({ message: "Erro ao buscar a Notícia do Dia (APOD)." });
  }
});

// --- Endpoint para Proxy de Mídia (Imagens e Vídeos) ---
// Essencial para contornar problemas de CORS e hotlinking ao exibir mídias da NASA.
app.get("/api/image-proxy", async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).json({ error: "URL da imagem não fornecida." });
  }

  try {
    const response = await axios.get(imageUrl, { responseType: "stream" });
    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Erro no proxy de imagem/vídeo:", error.message);
    res.status(500).json({ error: "Falha ao fazer proxy da imagem/vídeo." });
  }
});

// Inicia o servidor e exibe os endpoints disponíveis
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
  console.log(
    `Endpoint de notícias traduzidas: http://localhost:${PORT}/api/nasa-news-translated`
  );
  console.log(
    `Endpoint da Notícia do Dia (APOD): http://localhost:${PORT}/api/nasa-apod`
  );
  console.log(
    `Endpoint de proxy de mídia: http://localhost:${PORT}/api/image-proxy?url=`
  );
});
