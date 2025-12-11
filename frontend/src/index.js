import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Toaster } from "./Component/ui/sonner";
import { HashRouter } from "react-router-dom";   // ← Add this

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>                {/* ← Wrap your App with HashRouter */}
      <App />
      <Toaster />
    </HashRouter>
  </React.StrictMode>,
);
