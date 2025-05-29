import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home.tsx";
import Explore from "./routes/Explore.tsx";
import Tech from "./routes/Tech.tsx";

const router = createBrowserRouter([
  {
    path: "", // Rota raiz "/"
    element: <App />, // renderiza o componente App

    children: [
      {
        path: "", // Rota "home"
        element: <Home />, // renderiza o componente Home
      },
      {
        path: "explore", // Rota "explore"
        element: <Explore />, // renderiza o componente Explore
      },
      {
        path: "tech", // Rota "tech"
        element: <Tech />, // renderiza o componente Tech
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
