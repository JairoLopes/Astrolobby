import { useState } from "react"; // Importe useState
import { NavLink } from "react-router-dom";
import { CgMenuRightAlt } from "react-icons/cg";
import MobileMenu from "./MobileMenu"; // Importe o novo componente

const Navbar = () => {
  // Estado para controlar a visibilidade do menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Função para abrir o menu
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  // Função para fechar o menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 right-0 w-full z-[90] bg-black/20 backdrop-blur-sm py-2">
      {/* Sub container que engloba a navbar DESKTOP*/}
      <div className="hidden container mx-auto lg:flex justify-between items-center px-6">
        {/* CONTAINER DA LOGO */}
        <a href="#">
          <div className="flex items-center gap-2">
            <img src="img/astrolobby.png" alt="LOGO" className="w-20" />

            {/* Titulo da logo */}
            <h2 className="text-white text-2xl font-bold tracking-wider">
              Astro<span className="text-secondaryTheme">lobby</span>
            </h2>
          </div>
        </a>

        {/* Container do Menu */}
        <div className="flex items-center gap-6">
          {/* LINK PARA A ROTA HOME */}
          <NavLink
            to={""}
            className={({ isActive }) =>
              isActive
                ? "text-secondaryTheme text-xl font-semibold"
                : "text-xl font-semibold"
            }
          >
            Home
          </NavLink>

          {/* LINK PARA A ROTA EXPLORE */}
          <NavLink
            to={"explore"}
            className={({ isActive }) =>
              isActive
                ? "text-secondaryTheme text-xl font-semibold"
                : "text-xl font-semibold"
            }
          >
            Explore
          </NavLink>

          {/* LINK PARA A ROTA SOBRE */}
          <NavLink
            to={"tech"}
            className={({ isActive }) =>
              isActive
                ? "text-secondaryTheme text-xl font-semibold"
                : "text-xl font-semibold"
            }
          >
            Tecnologia
          </NavLink>
        </div>

        {/* Container Noticias */}
        <div>
          <a
            href="#notice"
            className="text-lg text-white font-bold bg-mainTheme p-3 rounded"
          >
            Notícias
          </a>
        </div>
      </div>

      {/* Sub container que engloba a navbar Mobile*/}
      <div className="flex container mx-auto lg:hidden justify-between items-center px-6">
        {/* CONTAINER DA LOGO */}
        <div className="flex items-center gap-2">
          <img src="img/astrolobby.png" alt="LOGO" className="w-20" />
        </div>

        {/* Menu Hamburguer - Adicionado onClick para abrir o menu mobile */}
        <button onClick={openMobileMenu} aria-label="Abrir menu">
          <CgMenuRightAlt size={35} className="text-white/80" />
        </button>
      </div>

      {/* Renderiza o MobileMenu, passando o estado e a função para fechar */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </nav>
  );
};

export default Navbar;
