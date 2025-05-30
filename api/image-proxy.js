// api/image-proxy.js

// Importa 'Readable' da API de streams do Node.js.
import { Readable } from "stream";

export default async function (req, res) {
  // Pega a URL da imagem da query string (ex: /api/image-proxy?url=...)
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send("URL da imagem é necessária.");
  }

  try {
    // Faz a requisição para a URL da imagem original
    // O Node.js 18+ tem 'fetch' nativo, mas axios com responseType: 'stream' é outra alternativa.
    const response = await fetch(imageUrl);

    // Verifica se a requisição foi bem-sucedida (status 2xx)
    if (!response.ok) {
      // Se a imagem original não for encontrada ou houver outro erro HTTP, retorna um erro correspondente
      throw new Error(`Erro ao buscar imagem: ${response.statusText}`);
    }

    // Copia os headers relevantes da resposta original para o cliente (navegador).
    // Isso é crucial para que o navegador saiba o tipo de conteúdo (image/jpeg, image/png, etc.).
    res.setHeader(
      "Content-Type",
      response.headers.get("Content-Type") || "application/octet-stream"
    );
    // Adiciona headers de cache para que as imagens sejam armazenadas em cache no navegador, melhorando a performance.
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    // --- CORREÇÃO AQUI ---
    // Converte a Web ReadableStream (response.body) para uma Node.js ReadableStream
    // e então "pipe" (envia) diretamente para o objeto de resposta do Express (res).
    // O 'res' é um Node.js Writable Stream, então 'pipe' funciona perfeitamente.
    Readable.fromWeb(response.body).pipe(res);
  } catch (error) {
    console.error("Erro no proxy de imagem:", error);
    // Tratamento de erro mais específico:
    if (error.message && error.message.includes("Not Found")) {
      res
        .status(404)
        .send(
          "Erro: Imagem não encontrada na origem (URL inválida ou recurso removido)."
        );
    } else {
      res.status(500).send("Erro interno do servidor ao processar a imagem.");
    }
  }
}
