import { NavLink } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"; // Ícones de redes sociais

const Footer = () => {
  return (
    <footer className="bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 text-white/80">
      <div className="container mx-auto max-w-6xl">
        {/* Grid para layout responsivo: 1 coluna em mobile, 3 colunas em telas médias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left">
          {/* Seção 1: Logo e Slogan */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="img/astrolobby.png"
                alt="LOGO Astrolobby"
                className="w-16"
              />
              <h2 className="text-white text-3xl font-bold tracking-wider">
                Astro<span className="text-secondaryTheme">lobby</span>
              </h2>
            </div>
            <p className="text-sm max-w-xs">
              Sua porta de entrada para o universo. Notícias, descobertas e a
              beleza do cosmos.
            </p>
          </div>

          {/* Seção 2: Navegação */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold text-white mb-4">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <NavLink
                  to={""}
                  className="hover:text-violet-400 transition-colors"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"explore"}
                  className="hover:text-violet-400 transition-colors"
                >
                  Explore
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"tech"}
                  className="hover:text-violet-400 transition-colors"
                >
                  Tecnologia
                </NavLink>
              </li>
              <li>
                {/* Link para a seção de notícias (rolagem suave) */}
                <a
                  href="#notice"
                  className="hover:text-violet-400 transition-colors"
                >
                  Notícias
                </a>
              </li>
            </ul>
          </div>

          {/* Seção 3: Redes Sociais e Contato (Exemplo) */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold text-white mb-4">
              Conecte-se
            </h3>
            <div className="flex space-x-6 mb-6">
              <a
                href="https://github.com/seu-usuario"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-white hover:text-violet-400 transition-colors text-2xl"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com/in/seu-usuario"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white hover:text-violet-400 transition-colors text-2xl"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://twitter.com/seu-usuario"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-white hover:text-violet-400 transition-colors text-2xl"
              >
                <FaTwitter />
              </a>
            </div>
            <p className="text-sm">
              Entre em contato:{" "}
              <a
                href="mailto:contato@astrolobby.com"
                className="hover:text-violet-400 transition-colors"
              >
                contato@astrolobby.com
              </a>
            </p>
          </div>
        </div>

        {/* Linha separadora */}
        <hr className="border-gray-700 my-10" />

        {/* Direitos Autorais */}
        <div className="text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Astrolobby. Todos os direitos
            reservados.
          </p>
          <p className="mt-2">
            Desenvolvido por{" "}
            <a
              href="https://jairolopes-dev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondaryTheme text-lg hover:text-violet-300 transition-colors duration-300 font-semibold animate-pulse"
            >
              Jairo Lopes
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
