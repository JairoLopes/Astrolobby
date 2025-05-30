// api/nasa-news-translated.js
import axios from "axios"; // Usar import/export para Vercel Functions
import * as deepl from "deepl-node"; // Importar DeepL corretamente

// Variáveis de ambiente são acessadas diretamente em Vercel Functions
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

// Inicializa o tradutor DeepL fora do handler para reutilização em 'cold starts'
let deeplTranslator = null;
if (DEEPL_API_KEY) {
  try {
    deeplTranslator = new deepl.Translator(DEEPL_API_KEY);
  } catch (e) {
    console.error(
      "Erro ao inicializar o tradutor DeepL (API News). Verifique sua DEEPL_API_KEY:",
      e.message
    );
  }
} else {
  console.warn(
    "DEEPL_API_KEY não encontrada. As notícias não serão traduzidas."
  );
}

// Função auxiliar para traduzir texto usando DeepL (copiada e adaptada do seu index.js)
async function translateText(text, targetLang = "pt-BR") {
  if (!deeplTranslator || !text) {
    return text;
  }
  try {
    const result = await deeplTranslator.translateText(text, null, targetLang);
    return result.text;
  } catch (error) {
    console.error(
      "Erro ao traduzir texto com DeepL (API News):",
      error.message
    );
    return text;
  }
}

// Função principal da Serverless Function
export default async function (req, res) {
  // Lidar com requisições OPTIONS (preflight CORS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const searchTerm = req.query.q || "space";
  const mediaTypes = req.query.media_type || "image,video";
  const pageSize = req.query.page_size || 5;

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

      const potentialImageUrls = itemLinks
        .map((link) => link.href)
        .filter((url) => /\.(jpg|jpeg|png|gif|webp|tiff)$/i.test(url));
      const potentialVideoUrls = itemLinks
        .map((link) => link.href)
        .filter((url) => /\.(mp4|webm)$/i.test(url));

      if (potentialImageUrls.length > 0) {
        mediaUrl =
          potentialImageUrls.find((url) => url.includes("~thumb")) ||
          potentialImageUrls[0];
        finalMediaType = "image";
      } else if (finalMediaType === "video" && item.href) {
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
          mediaUrl = potentialVideoUrls[0];
        }
        finalMediaType = "video";
      } else if (potentialVideoUrls.length > 0) {
        mediaUrl = potentialVideoUrls[0];
        finalMediaType = "video";
      }

      const date = itemData.date_created
        ? new Date(itemData.date_created).toLocaleDateString("pt-BR")
        : "Data desconhecida";

      const originalTitle = itemData.title || "Título Desconhecido";
      const originalExplanation =
        itemData.description || "Nenhuma descrição disponível.";
      let translatedTitle = originalTitle;
      let translatedExplanation = originalExplanation;
      let isTranslated = false;

      if (deeplTranslator) {
        translatedTitle = await translateText(originalTitle, "pt-BR");
        // CORREÇÃO AQUI: mudado de originalApodExplanation para originalExplanation
        translatedExplanation = await translateText(
          originalExplanation,
          "pt-BR"
        );
        isTranslated = true;
      }

      formattedNews.push({
        id: itemData.nasa_id || item.href,
        title: translatedTitle,
        explanation: translatedExplanation,
        url: mediaUrl,
        media_type: finalMediaType,
        date: date,
        originalTitle: originalTitle,
        originalExplanation: originalExplanation,
        translated: isTranslated,
        translatedBy: isTranslated ? "DeepL" : null,
      });
    }

    res.status(200).json(formattedNews);
  } catch (error) {
    console.error(
      "Erro ao buscar notícias da NASA (Image/Video API):",
      error.message
    );
    res.status(500).json({ message: "Erro ao buscar notícias da NASA." });
  }
}
