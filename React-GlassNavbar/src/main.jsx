import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GlassNavbar from "./components/GlassNavbar/GlassNavbar.jsx";

const links = [
  { href: "/?page=features", label: "Features" },
  { href: "/?page=approach", label: "Our approach" },
];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlassNavbar
      brandHref="/"
      links={links}
      action={{ href: "/?page=contact", label: "Get in touch" }}
      activeHref={window.location.pathname + window.location.search}
      overHero={false}
      menuNote=""
    />
  </StrictMode>,
);
