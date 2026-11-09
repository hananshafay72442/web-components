import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RippleButton from "./components/RippleButton/RippleButton.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RippleButton />
  </StrictMode>,
);
