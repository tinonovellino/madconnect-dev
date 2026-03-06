import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PlatformProvider } from "./context/PlatformContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <PlatformProvider>
          <App />
        </PlatformProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
