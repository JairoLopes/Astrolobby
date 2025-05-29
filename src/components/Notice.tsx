import { useState, useEffect } from "react";
import { IoMdPlanet } from "react-icons/io";

// Interface que define a estrutura de cada item de notícia.
// Ela é flexível o suficiente para dados de imagem e vídeo.
interface NewsItem {
  id: string; // ID único para a chave de lista no React
  title: string;
  explanation: string;
  url: string | null; // URL da mídia (imagem ou vídeo), pode ser null se não encontrada
  media_type: "image" | "video"; // Indica se é uma imagem ou vídeo
  date: string; // Data da notícia (string no formato "DD/MM/AAAA" vinda do backend)
  originalTitle?: string; // Opcional: título original antes da tradução
  originalExplanation?: string; // Opcional: explicação original antes da tradução
  translated?: boolean; // Opcional: indica se foi traduzido
  translatedBy?: string; // Opcional: ferramenta de tradução
}

const Notice = () => {
  // Estado para armazenar a lista de notícias gerais (as "últimas notícias")
  const [newsData, setNewsData] = useState<NewsItem[] | null>(null);
  // Estado para armazenar a notícia diária (o item vindo da API da APOD)
  const [dailyNews, setDailyNews] = useState<NewsItem | null>(null);
  // Estado para controlar o estado de carregamento
  const [loading, setLoading] = useState(true);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState<string | null>(null);
  // Estado para controlar qual aba está ativa: 'daily' (Notícia do Dia) ou 'latest' (Últimas Notícias)
  const [activeTab, setActiveTab] = useState<"daily" | "latest">("daily");

  // --- URLs dos Endpoints do Backend (AGORA OTIMIZADAS PARA VERCEL) ---
  //
  // As variáveis de ambiente (VITE_...) são usadas quando o projeto está em produção na Vercel.
  // Se elas não existirem (ou seja, quando você está desenvolvendo localmente),
  // ele automaticamente usa os caminhos de proxy para o seu 'localhost:5000'.
  //
  // IMPORTANTE:
  // - No Vercel Dashboard, defina VITE_BACKEND_API_URL_NEWS, VITE_BACKEND_APOD_API_URL e VITE_BACKEND_PROXY_URL
  //   com valores como "https://astrolobby.vercel.app/api/nasa-news-translated" (use seu próprio domínio da Vercel).
  // - No seu .env (ou .env.local) na raiz do seu projeto frontend, defina-os para seu "http://localhost:5000/api/..."
  //   para desenvolvimento local.

  const BACKEND_NEWS_API_URL =
    import.meta.env.VITE_BACKEND_API_URL_NEWS ||
    // **Ajustado:** Caminho relativo para a Serverless Function na Vercel
    // Se VITE_BACKEND_API_URL_NEWS não estiver definido, usará este caminho.
    // Lembre-se que para o DEV LOCAL, você deve definir esta variável no seu .env do frontend
    // ex: VITE_BACKEND_API_URL_NEWS=http://localhost:5000/api/nasa-news-translated?q=space&page_size=5
    "/api/nasa-news-translated?q=space&page_size=5";

  const BACKEND_APOD_API_URL =
    import.meta.env.VITE_BACKEND_APOD_API_URL ||
    // **Ajustado:** Caminho relativo para a Serverless Function na Vercel
    // Para DEV LOCAL: VITE_BACKEND_APOD_API_URL=http://localhost:5000/api/nasa-apod
    "/api/nasa-apod";

  const BACKEND_PROXY_URL =
    import.meta.env.VITE_BACKEND_PROXY_URL ||
    // **Ajustado:** Caminho relativo para a Serverless Function na Vercel
    // Para DEV LOCAL: VITE_BACKEND_PROXY_URL=http://localhost:5000/api/image-proxy?url=
    "/api/image-proxy?url=";

  // useEffect para buscar os dados das notícias quando o componente é montado
  useEffect(() => {
    const fetchAllNewsData = async () => {
      try {
        setLoading(true); // Ativa o estado de carregamento
        setError(null); // Limpa qualquer erro anterior

        // Faz requisições simultâneas para a APOD e as últimas notícias
        const [apodResponse, newsResponse] = await Promise.all([
          // As URLs agora são resolvidas automaticamente pela Vercel no deploy
          // e pelos valores do .env localmente.
          fetch(BACKEND_APOD_API_URL),
          fetch(BACKEND_NEWS_API_URL),
        ]);

        // Processa a resposta da APOD
        if (!apodResponse.ok) {
          const errorData = await apodResponse.json();
          throw new Error(
            errorData.message ||
              `Erro APOD HTTP! Status: ${apodResponse.status}`
          );
        }
        const apodData: NewsItem = await apodResponse.json();
        setDailyNews(apodData);

        // Processa a resposta das últimas notícias
        if (!newsResponse.ok) {
          const errorData = await newsResponse.json();
          throw new Error(
            errorData.message ||
              `Erro Notícias HTTP! Status: ${newsResponse.status}`
          );
        }
        const newsList: NewsItem[] = await newsResponse.json();

        // Lógica de Ordenação das Últimas Notícias (da mais recente para a menos recente)
        const sortedNewsList = newsList.sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split("/");
          const dateA = new Date(`${yearA}-${monthA}-${dayA}`);

          const [dayB, monthB, yearB] = b.date.split("/");
          const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

          if (isNaN(dateA.getTime())) return 1; // Coloca datas inválidas no final
          if (isNaN(dateB.getTime())) return -1; // Coloca datas inválidas no final

          return dateB.getTime() - dateA.getTime(); // Ordem decrescente (mais recente primeiro)
        });

        setNewsData(sortedNewsList);
      } catch (err: unknown) {
        let errorMessage = "Erro desconhecido ao carregar notícias.";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }

        console.error("Erro ao buscar dados:", err);
        setError(
          `Não foi possível carregar as informações. Erro: ${errorMessage}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllNewsData();
  }, [BACKEND_NEWS_API_URL, BACKEND_APOD_API_URL]); // Dependências: re-executa se as URLs do backend mudarem (o que não deve ocorrer)

  // A data da aba agora será a data da notícia do dia, se disponível, senão a data atual.
  const dailyNewsDate = dailyNews
    ? dailyNews.date
    : new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  // Componente auxiliar para renderizar um item de notícia (reutilizado)
  const renderNewsItem = (item: NewsItem) => (
    <div
      key={item.id}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-black/50 rounded-lg shadow-xl p-6 md:p-8 border border-white/10"
    >
      <div className="flex justify-center items-center min-h-[256px]">
        {/* Condicionalmente renderiza <img> para imagens ou <video> para vídeos */}
        {item.media_type === "image" && item.url ? (
          <img
            // Usa o endpoint de proxy do backend para carregar a imagem
            // BACKEND_PROXY_URL já inclui "?url=", então apenas encodeURIComponent(item.url) é necessário
            src={`${BACKEND_PROXY_URL}${encodeURIComponent(item.url)}`}
            alt={item.title}
            className="rounded-lg object-cover w-full h-auto max-h-96 md:max-h-full shadow-md"
          />
        ) : item.media_type === "video" && item.url ? (
          <video
            controls // Adiciona controles de reprodução ao vídeo
            // Usa o endpoint de proxy do backend para carregar o vídeo
            src={`${BACKEND_PROXY_URL}${encodeURIComponent(item.url)}`}
            title={item.title}
            className="w-full h-64 md:h-80 rounded-lg shadow-md object-cover"
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
        ) : (
          // Fallback para quando a mídia não estiver disponível ou não for suportada
          <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gray-800 rounded-lg text-gray-400">
            Média não disponível ou formato não suportado.
          </div>
        )}
      </div>

      {/* Bloco de conteúdo da notícia (título, explicação, data) */}
      <div className="flex flex-col justify-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-secondaryTheme">
          {item.title}
        </h3>
        <p className="text-sm md:text-base font-light text-white/90 leading-relaxed mb-4">
          {item.explanation}
        </p>
        <p className="text-xs md:text-[16px] text-thirdTheme italic">
          Data: {item.date}{" "}
          {item.translated &&
            item.translatedBy &&
            ` (Traduzido por ${item.translatedBy})`}
        </p>
      </div>
    </div>
  );

  return (
    <section
      id="notice"
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-black text-white"
    >
      {/* Camada de fundo escuro para o contraste */}
      <div className="absolute inset-0 bg-black opacity-80 -z-10"></div>

      <div className="container mx-auto max-w-4xl z-10 relative">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg mb-4 text-mainTheme">
          Notícias Cósmicas Recentes
        </h2>
        <p className="text-lg md:text-xl text-center text-white/90 mb-8">
          Aqui está o que há de mais recente, diretamente dos servidores da{" "}
          <strong className="text-thirdTheme font-bold">NASA</strong>.
        </p>

        <h3 className="text-3xl md:text-4xl font-bold text-center mb-6 text-secondaryTheme">
          Como Funciona?
        </h3>
        {/* --- INÍCIO DAS EXPLICAÇÕES DETALHADAS --- */}
        <p className="text-base md:text-lg text-center text-white/80 mb-4 max-w-2xl mx-auto">
          Nesta seção, você explora o universo através de duas abas principais:
        </p>
        <div className="flex flex-col gap-4 text-base md:text-lg text-white/80 mb-12 max-w-2xl mx-auto text-left">
          {/* EXPLICANDO A FOTO TIRADA */}
          <p className="mb-2">
            <span className="bg-gray-950/50 flex items-center text-2xl font-bold gap-2">
              <IoMdPlanet size={46} className="text-secondaryTheme" />
              Foto do dia (APOD)
            </span>
            Mergulhe em uma imagem ou vídeo fascinante do cosmos,{" "}
            <strong className="text-mainTheme">
              selecionada diariamente por astrônomos da{" "}
              <strong className="text-secondaryTheme">NASA</strong>
            </strong>
            . Cada item é acompanhado de uma explicação concisa, revelando os
            segredos por trás da cena. É uma viagem única e educativa a cada
            dia!
          </p>

          {/* EXPLICANDO A ULTIMAS NOTICIAS */}
          <p className="">
            <span className="bg-gray-950/50 flex items-center text-2xl font-bold gap-2">
              <IoMdPlanet size={46} className="text-secondaryTheme" />
              Últimas Notícias (APOD)
            </span>
            Mantenha-se atualizado com as notícias mais recentes da biblioteca
            da NASA. Navegue por uma coleção de imagens, com resumos objetivos
            que trazem os destaques da exploração espacial diretamente para
            você.
          </p>
        </div>
        {/* --- FIM DAS EXPLICAÇÕES DETALHADAS --- */}

        {/* --- Seção de Abas (Tabs) --- */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setActiveTab("daily")}
            // Estilos da aba ativa/inativa
            className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === "daily"
                ? "bg-mainTheme text-white shadow-lg"
                : "bg-gray-800 text-white/70 hover:bg-gray-700"
            }`}
          >
            Foto do dia ({dailyNewsDate})
          </button>
          <button
            onClick={() => setActiveTab("latest")}
            className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === "latest"
                ? "bg-mainTheme text-white shadow-lg"
                : "bg-gray-800 text-white/70 hover:bg-gray-700"
            }`}
          >
            Últimas Notícias
          </button>
        </div>
        {/* --- Fim da Seção de Abas (Tabs) --- */}

        {/* Exibe mensagem de carregamento */}
        {loading && (
          <p className="text-center text-xl font-light mt-8">
            Carregando as informações da NASA...
          </p>
        )}

        {/* Exibe mensagem de erro, se houver */}
        {error && (
          <p className="text-center text-xl text-red-400 font-light mt-8">
            {error}
          </p>
        )}

        {/* Conteúdo condicional baseado na aba ativa */}
        {!loading && !error && (
          <div>
            {/* Conteúdo da Notícia do Dia */}
            {activeTab === "daily" && (
              <div className="space-y-12">
                {dailyNews ? (
                  renderNewsItem(dailyNews)
                ) : (
                  <p className="text-center text-xl font-light">
                    Nenhuma Foto do Dia disponível no momento.
                  </p>
                )}
              </div>
            )}

            {/* Conteúdo das Últimas Notícias */}
            {activeTab === "latest" && (
              <div className="space-y-12">
                {newsData && newsData.length > 0 ? (
                  newsData.map((item) => renderNewsItem(item))
                ) : (
                  <p className="text-center text-xl font-light">
                    Nenhuma outra notícia recente disponível no momento.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Notice;
