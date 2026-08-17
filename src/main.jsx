import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { PrototypeProvider } from "./store/PrototypeStore";
import { ToastProvider } from "./components/ui";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/layout.css";
import "./styles/business.css";
import "./styles/pages.css";
import "./styles/conversation.css";
import "./styles/candidate-review.css";
import "./styles/business-review.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <PrototypeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </PrototypeProvider>
    </HashRouter>
  </React.StrictMode>,
);
