import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Hook para obter a rota atual

  useEffect(() => {
    // Quando 'pathname' (a rota) muda, rola a janela para o topo
    window.scrollTo(0, 0);
  }, [pathname]); // Dependência: executa o efeito toda vez que 'pathname' muda

  return null; // Este componente não renderiza nada no DOM
};

export default ScrollToTop;
