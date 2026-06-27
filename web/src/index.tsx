import React from "react";
import { createRoot } from "react-dom/client";
import "../../infectiowasm/pkg/infectiowasm";
import "react-virtualized/styles.css";
import "./index.css";
import { LLMProvider } from "./contexts/useLLM";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { ChartExportProvider } from "./contexts/ChartExportProvider";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home";
import LearnMorePage from "./pages/learnMore";
import Chat from "./components/Chat";

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);

root.render(
  <ThemeProvider>
    <ChartExportProvider>
      <LLMProvider>
        <Chat />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn-more" element={<LearnMorePage />} />
          </Routes>
        </BrowserRouter>
      </LLMProvider>
    </ChartExportProvider>
  </ThemeProvider>
);
