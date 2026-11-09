import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BlobVisual from "./components/BlobVisual/BlobVisual.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BlobVisual />
  </StrictMode>,
);
