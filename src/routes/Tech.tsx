const Tech = () => {
  return (
    <div className="relative w-full min-h-screen -z-10 pt-navSpace flex flex-col items-center justify-center text-white p-4 sm:p-6 lg:p-8">
      {/* Camada do vídeo sendo position Absolute para sair do fluxo e se expandir pelo componente */}
      <video
        className="hidden sm:block absolute inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        src="/video/galaxia.mp4" // Vídeo para desktop (ou o original que você tinha)
      />
      {/* Vídeo para mobile */}
      <video
        className="block sm:hidden absolute inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        src="/video/mobileVideo/nebula.mp4" // Seu vídeo de nebulosa para mobile
      />

      {/* Criando camada overlay para melhorar a legibilidade do texto */}
      <div className="absolute inset-0 bg-black opacity-60 -z-10"></div>

      {/* Conteúdo de Apresentação da Rota Tech - Posicionado em Cantos */}
      <div className="relative z-10 w-full h-full flex flex-col md:gap-10 justify-between p-4 sm:p-6 lg:p-8">
        {/* Bloco de texto no canto superior esquerdo */}
        <div className="flex justify-start w-full home-desk:translate-y-20">
          <div className="max-w-xs md:max-w-sm text-left bg-black/40 rounded-lg shadow-lg space-y-3 p-4 md:p-5 mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-wider drop-shadow-lg">
              Nossa Conexão Direta com a NASA
            </h1>
            <p className="text-sm md:text-base font-light drop-shadow-md">
              Quando você acessa a{" "}
              <strong className="text-secondaryTheme font-bold">
                Astrolobby
              </strong>
              , nosso "cérebro" (chamado de backend) se conecta diretamente com
              os sistemas oficiais da NASA. É como se ele ligasse para a NASA e
              pedisse as últimas novidades.
            </p>
          </div>
        </div>

        {/* Bloco de texto no canto inferior direito */}
        <div className="flex justify-end w-full mt-auto home-desk:translate-y-12 lg:translate-y-0">
          <div className="max-w-xs md:max-w-sm text-right bg-black/60 rounded-lg shadow-lg space-y-3 p-4 md:p-5 mt-4 md:mt-0">
            <h2 className="text-mainTheme text-2xl md:text-3xl font-extrabold leading-tight tracking-wider drop-shadow-lg">
              Tradução Instantânea para Você
            </h2>
            <p className="text-sm md:text-base font-light drop-shadow-md">
              A maioria das informações da{" "}
              <strong className="text-secondaryTheme font-bold">NASA</strong>{" "}
              está em inglês. Para que você não perca nenhum detalhe, nosso
              sistema usa uma ferramenta de tradução avançada{" "}
              <strong className="text-thirdTheme font-bold">(o DeepL)</strong>{" "}
              para converter instantaneamente todos os títulos e explicações
              para o português.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tech;
