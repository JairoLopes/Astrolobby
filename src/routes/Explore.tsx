const Explore = () => {
  return (
    <div className="-z-10 min-h-screen flex flex-col justify-center sm:justify-end items-center text-white p-4 sm:p-6 lg:p-8 ">
      <video
        className="hidden sm:block absolute inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        src="/video/astronauta.mp4" // vídeo de galáxia existente
      />
      {/* Video para mobile */}
      <video
        className="block sm:hidden absolute inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        src="/video/mobileVideo/earth.mp4"
      />

      {/* Criando camada overlay para melhorar a legibilidade do texto */}
      <div className="absolute inset-0 bg-black opacity-60 -z-10"></div>
      {/* -------------------------------------------------------------------- */}
      {/* BLOCO GERAL DOS SUB BLOCOS DE CONTEUDOS */}
      <div className="w-full h-full flex flex-col p-4 sm:p-6 sm:space-y-30">
        {/* Bloco de texto no canto superior direito */}
        <div className="flex justify-center min-sm:justify-end w-full home-desk:translate-y-20">
          <div className="max-w-xs md:max-w-sm sm:text-right bg-black/60 rounded-lg shadow-lg space-y-3 p-4 md:p-5 mb-4 md:mb-0">
            {" "}
            {/* Max-width, padding e margin responsivos */}
            <h1 className="text-mainTheme text-2xl md:text-3xl font-extrabold leading-tight tracking-wider drop-shadow-lg">
              Praticidade e rapidez
            </h1>
            <p className="text-sm md:text-base font-light drop-shadow-md">
              Chega de notícias complexas! Aqui na AstroLobby, transformamos as
              descobertas da{" "}
              <strong className="text-secondaryTheme font-bold">NASA</strong> em
              uma leitura rápida e envolvente, traduzida para você explorar o
              espaço sem complicação.
            </p>
          </div>
        </div>

        {/* Bloco de texto no canto inferior esquerdo */}
        <div className="flex justify-center sm:justify-start w-full mt-auto">
          <div className="max-w-xs md:max-w-sm text-left bg-black/40 rounded-lg shadow-lg space-y-3 p-4 md:p-5 mt-4 md:mt-0">
            {" "}
            {/* Max-width, padding e margin responsivos */}
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-wider drop-shadow-lg">
              Aprenda mais sobre o universo
            </h2>
            <p className="text-sm md:text-base font-light drop-shadow-md">
              Com nosso conteudo diário e as nóticias que a{" "}
              <strong className="text-secondaryTheme font-bold">NASA</strong>{" "}
              nos fornece, você sempre estará atualizado com informações
              autênticas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
