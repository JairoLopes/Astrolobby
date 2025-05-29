// api/nasa-apod.js
import axios from "axios"; // Usar import/export para Vercel Functions
import * as deepl from "deepl-node"; // Importar DeepL corretamente

const NASA_APOD_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

let deeplTranslator = null;
if (DEEPL_API_KEY) {
  try {
    deeplTranslator = new deepl.Translator(DEEPL_API_KEY);
  } catch (e) {
    console.error(
      "Erro ao inicializar o tradutor DeepL (APOD). Verifique sua DEEPL_API_KEY:",
      e.message
    );
  }
} else {
  console.warn(
    "DEEPL_API_KEY não encontrada. A Notícia do Dia não será traduzida."
  );
}

async function translateText(text, targetLang = "pt-BR") {
  if (!deeplTranslator || !text) {
    return text;
  }
  try {
    const result = await deeplTranslator.translateText(text, null, targetLang);
    return result.text;
  } catch (error) {
    console.error("Erro ao traduzir texto com DeepL (APOD):", error.message);
    return text;
  }
}

// Função principal da Serverless Function
export default async function (req, res) {
  // Configura CORS para permitir requisições do seu frontend Vercel
  res.setHeader("Access-Control-Allow-Origin", "https://astrolobby.vercel.app"); // Ou '*' para testar
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Lidar com requisições OPTIONS (preflight CORS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const APOD_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_APOD_API_KEY}`;
    const response = await axios.get(APOD_API_URL);
    const apodData = response.data;

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

    res.status(200).json(dailyNewsItem);
  } catch (error) {
    console.error("Erro ao buscar a APOD (APOD API):", error.message);
    res
      .status(500)
      .json({ message: "Erro ao buscar a Notícia do Dia (APOD)." });
  }
}
