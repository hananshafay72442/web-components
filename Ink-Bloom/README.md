# Ink Bloom

A floating React theme toggle that reveals the next theme through an expanding ink contour. The shape comes from the supplied recording. The seed follows the bottom-right button, and the default 2.6-second duration follows the slower, fully visible wipe.

## Run the demo

Use Node.js 22.12 or newer. From the folder containing `package.json`, run:

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Use `npm run build` to create a production build in `dist`.

## Use the toggle in another React app

Copy the entire `src/components/InkThemeToggle` folder into your project. It contains the button, its CSS Module, the reveal mask, and the texture. The component uses React, React DOM, and a bundler that supports CSS Modules and WebP imports, such as Vite.

Mount one toggle near the root of your app. Keep it outside transformed containers so its fixed position is relative to the viewport.

```jsx
import InkThemeToggle from './components/InkThemeToggle/InkThemeToggle';

export default function App() {
  return (
    <>
      <main>Your page content</main>
      <InkThemeToggle />
    </>
  );
}
```

The component sets `data-theme="light"` or `data-theme="dark"` on the HTML element. Style the rest of your app with theme variables:

```css
:root {
  color-scheme: light;
  --page: #f3efe8;
  --text: #211d20;
}

:root[data-theme='dark'] {
  color-scheme: dark;
  --page: #151317;
  --text: #f4eee6;
}

body {
  background: var(--page);
  color: var(--text);
}
```

The default duration is `2600` milliseconds. Use `<InkThemeToggle duration={650} />` for a quicker pass, or `duration={0}` for an instant switch. The optional `--ink-toggle-inset` CSS variable controls the bottom and right margins.

## How the reveal works

1. The browser captures the current page. React applies the next palette and updates the button icon. The browser captures that state too.
2. The incoming snapshot is masked by `ink-arrival.webp`, a 36 KB texture that records when each patch of the page changes in the reference. The three color channels encode consecutive thirds of the motion for a smoother edge.
3. A native SVG filter advances through those times, revealing the new background, type, and controls together. The texture is aligned with the button center and transposed for portrait screens.
4. The browser releases the snapshots after the animation. React does no per-frame work. The demo fonts are separate from the reusable component.

The first visit follows the system color scheme. A manual choice is saved under `ink-bloom-theme`. Reduced-motion preferences and browsers without same-document View Transitions use an instant theme switch. The small script in `index.html` restores the saved choice before the demo's first paint.
