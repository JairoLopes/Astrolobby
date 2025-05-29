// api/image-proxy.js ou api/image-proxy/index.js
// Certifique-se de que você tem 'node-fetch' instalado se for Node.js antigo,
// ou use o fetch nativo do Node.js 18+

export default async function (req, res) {
  // Pega a URL da imagem da query string (ex: /api/image-proxy?url=...)
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send("URL da imagem é necessária.");
  }

  try {
    // Faz a requisição para a URL da imagem original
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Erro ao buscar imagem: ${response.statusText}`);
    }

    // Copia os headers relevantes da resposta original (Content-Type, etc.)
    res.setHeader(
      "Content-Type",
      response.headers.get("Content-Type") || "application/octet-stream"
    );
    // Adicione headers CORS se necessário (geralmente para Vercel Functions não é preciso se o frontend estiver no mesmo domínio)
    // res.setHeader('Access-Control-Allow-Origin', '*');

    // Envia o stream da imagem diretamente para o cliente
    response.body.pipeTo(res.writable);
  } catch (error) {
    console.error("Erro no proxy de imagem:", error);
    res.status(500).send("Erro interno do servidor ao processar a imagem.");
  }
}
