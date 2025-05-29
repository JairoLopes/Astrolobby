import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import Notice from "./components/Notice";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollTop"; // Importe o novo componente

function App() {
  return (
    // max-w-[1800px] mx-auto: limita a largura máxima do conteúdo e o centraliza
    // overflow-x-hidden: previne barras de rolagem horizontais indesejadas
    <div className="overflow-x-hidden max-w-[1800px] mx-auto text-white">
      <ScrollToTop /> {/* Adicione o componente aqui, no topo do seu layout */}
      <Navbar />
      <Outlet />
      {/* Sessão de notícias espaciais */}
      <Notice />
      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
