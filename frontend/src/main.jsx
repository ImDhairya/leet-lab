import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import App from "./App.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1038878165161-k4uh5rqauarsm7hcjobudcp0h31i0nlg.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
