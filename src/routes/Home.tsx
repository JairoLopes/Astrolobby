import { slideUpFadeIn, growIn } from "../animation/animraions";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="relative w-full min-h-screen pt-navSpace flex flex-col items-center justify-center text-white p-6">
      {/* Camada do video sendo position Absolute para sair do fluxo e se expandir pelo componente */}
      {/* Video para desktop */}
      <video
        className="hidden sm:block absolute inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        src="/video/terra.mp4"
      />

      {/* Video para mobile */}
      <video
        className="block sm:hidden absolute inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        src="/video/universo.mp4"
      />

      {/* Criando camada overlay para melhorar a legibilidade do texto */}
      <div className="absolute inset-0 bg-black opacity-60 -z-10"></div>

      {/* Conteúdo de Apresentação - Centralizado */}
      <div className="bg-black/40 -translate-y-10 relative z-10 text-center max-w-4xl mx-auto space-y-6 pb-3">
        <motion.h1
          initial={growIn.initial}
          whileInView={growIn.animate}
          transition={{ duration: 1, delay: 0.25 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight tracking-wider drop-shadow-lg"
        >
          Astro<span className="text-secondaryTheme">lobby</span>
        </motion.h1>

        <motion.p
          initial={slideUpFadeIn.initial}
          whileInView={slideUpFadeIn.animate}
          transition={{ duration: 1, delay: 0.25 }}
          className="text-xl md:text-2xl font-light max-w-2xl mx-auto drop-shadow-md"
        >
          Sua porta de entrada para o cosmos. Desvende os mistérios do universo
          e explore as últimas descobertas.
        </motion.p>

        <motion.a
          initial={growIn.initial}
          whileInView={growIn.animate}
          transition={{ duration: 0.6, delay: 0 }}
          href="#notice"
          className="mt-8 active:scale-90 hover:bg-mainTheme inline-block bg-secondaryTheme active:sca text-white font-bold py-3 px-8 rounded-full transition duration-400 text-lg drop-shadow-lg"
        >
          Se atualize
        </motion.a>
      </div>
    </div>
  );
};

export default Home;
