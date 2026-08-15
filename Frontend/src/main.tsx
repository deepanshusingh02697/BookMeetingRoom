import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "./lib/apollo.ts";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
      <App />
      <ToastContainer />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
