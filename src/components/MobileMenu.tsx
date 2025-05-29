import { NavLink } from "react-router-dom";
import { IoClose } from "react-icons/io5"; // Ícone de fechar

// Interface para as props do MobileMenu
interface MobileMenuProps {
  isOpen: boolean; // Indica se o menu está aberto ou fechado
  onClose: () => void; // Função para fechar o menu
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    // Container principal do menu lateral
    // REMOVIDO: bg-black/70 (o overlay de tela cheia)
    // ADICIONADO: 'inset-y-0 right-0' para grudar nas laterais
    // ADICIONADO: 'overflow-hidden' para não mostrar o conteúdo que desliza para fora
    <div
      className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        lg:hidden`} // 'lg:hidden' garante que ele só aparece em telas menores
    >
      {/* Container do conteúdo real do menu (sidebar) */}
      {/* ADICIONADO: bg-black/80 aqui para o painel lateral ter seu próprio fundo */}
      <div className="w-64 sm:w-80 bg-black/80 h-full p-6 flex flex-col items-center shadow-lg">
        {/* Botão de Fechar */}
        <button onClick={onClose} className="self-end mb-8 text-white">
          <IoClose size={30} />
        </button>

        {/* Links de Navegação */}
        <div className="bg-black/90 flex flex-col gap-8 w-full text-center">
          <NavLink
            to={""}
            onClick={onClose} // Fecha o menu ao clicar no link
            className={({ isActive }) =>
              isActive
                ? "text-violet-500 text-2xl font-semibold border-b-2 border-violet-500 pb-1"
                : "text-white hover:text-violet-500 transition-colors text-2xl font-semibold"
            }
          >
            Home
          </NavLink>

          <NavLink
            to={"explore"}
            onClick={onClose} // Fecha o menu ao clicar no link
            className={({ isActive }) =>
              isActive
                ? "text-violet-500 text-2xl font-semibold border-b-2 border-violet-500 pb-1"
                : "text-white hover:text-violet-500 transition-colors text-2xl font-semibold"
            }
          >
            Explore
          </NavLink>

          <NavLink
            to={"tech"}
            onClick={onClose} // Fecha o menu ao clicar no link
            className={({ isActive }) =>
              isActive
                ? "text-violet-500 text-2xl font-semibold border-b-2 border-violet-500 pb-1"
                : "text-white hover:text-violet-500 transition-colors text-2xl font-semibold"
            }
          >
            Tecnologia
          </NavLink>

          {/* Link para Notícias (mantido como âncora por enquanto) */}
          <a
            href="#notice"
            onClick={onClose} // Fecha o menu ao clicar no link
            className="text-white hover:bg-violet-600 transition-colors bg-violet-500 p-3 rounded-lg text-2xl font-semibold mt-4"
          >
            Notícias
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
