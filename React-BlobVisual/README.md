# BlobVisual

The original hero artwork as a standalone React component. It includes the morphing gradient, original doctor SVG, floating chips, entry fade, and smoothed pointer movement.

## Run the preview

With Node 22.12 or newer, open this folder in PowerShell.

```powershell
npm ci --include=dev
npm run dev
```

Open the address Vite prints. The preview displays only the visual. To make a production build, run `npm run build`.

## Reuse it

Copy `src/components/BlobVisual/` into your React project, including its `assets/` directory. The JSX imports the CSS and default SVG. React is the only runtime dependency.

```jsx
import BlobVisual from "./components/BlobVisual/BlobVisual.jsx";

<BlobVisual
  imageSrc={myIllustration}
  imageAlt="My illustration"
  experience="12+"
  experienceLabel="years experience"
  days="5"
  daysLabel="days a week"
/>
```

Use `experience={null}` or `days={null}` to hide either chip. The visual tracks the pointer within itself. Add `data-hero-pointer-area` to a surrounding hero to track the pointer across that section. It also recognizes a surrounding `id="hero"`. With reduced motion enabled, the artwork stays still. The preview loads Inter and Fraunces, with system font fallbacks.
