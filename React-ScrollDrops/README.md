# ScrollDrops — standalone React component

## Run this demo

Use Node 22.12 or newer. Open a terminal in this project folder, then install its dependencies.

```bash
npm ci --include=dev
npm run dev
```

If Vite is missing after moving the project, delete the old `node_modules` folder and rerun the install command with this lockfile. Build with `npm run build`. The demo's page styling lives in `src/demo.css`; the component imports only its own CSS.

## Copy into your repository

Copy `src/components/ScrollDrops/` into your project. It contains just the JSX and CSS. No navbar, router, backend, or global stylesheet is required.

```bash
npm install gsap @gsap/react
```

## ScrollDrops

```jsx
import ScrollDrops from './components/ScrollDrops/ScrollDrops.jsx';

<ScrollDrops
  id="story"
  aria-labelledby="story-title"
  theme="light"
  scrollDistance={1.35}
  topOffset={112}
>
  <div style={{ maxWidth: 1100, margin: 'auto', padding: '64px 24px' }}>
    <h2 id="story-title">A story worth staying for.</h2>
    <p>Your content stays still while the droplets stretch and fade.</p>
  </div>
</ScrollDrops>
```

The section arrives at the center, holds briefly, and consumes further scroll input to animate the drops. At the end, it releases and normal page scrolling resumes. Scrolling backward rewinds the sequence. It uses native scrolling and GSAP pin spacing, with no wheel/touch blocking or global scroll lock.

| Prop | Default | Use |
| --- | --- | --- |
| `children` | None | Your section content, rendered above the drops. |
| `compact` | `true` | Content determines section height. With `false`, uses the original full-height/sticky layout. |
| `pinOnScroll` | `true` | Centered pause + scroll animation. Set `false` for an ordinary scrolling background. |
| `count` | `36` | Number of decorative drops; clamped to 0–160. Try 24–48. |
| `seed` | `11` | Deterministic placement. Change it to get a different repeatable arrangement. |
| `scrollDistance` | `1.35` | Animation scroll distance in viewport heights, minimum 700px. Clamped to 0.5–4. Try 1.8 for a slower story. |
| `topOffset` | `112` | Minimum distance below the viewport top; leave room for your fixed header. |
| `theme` | Inherited | `"light"` or `"dark"`; otherwise inherits an ancestor's `data-theme="dark"`. |
| `className`, `style`, section attributes | None | Extra classes, palette overrides, `id`, `aria-labelledby`, etc. |

A mint, sage, and teal palette replaces the original blue/white haze. Each drop has a gentle highlight, a deeper edge, and a subtle inset reflection. The dark palette is brighter and clearer against a forest background. Customize the component's own variables, with no host-app variables required:

```jsx
<ScrollDrops style={{
  '--drops-background': '#f4f7ef',
  '--drop-highlight': '#d5e7bd',
  '--drop-mid': '#8aad7b',
  '--drop-shadow': '#537e65',
  '--drops-field-opacity': 0.8,
}}>
  {/* your content */}
</ScrollDrops>
```

### Responsive behavior and integration

- Pinning is enabled on viewports at least 800px wide and 600px tall, only when the complete section fits below `topOffset`. Keep desktop content reasonably short (roughly 500–600px).
- Smaller/taller-content layouts scroll normally so text is never trapped outside the viewport. Drops still respond to scroll when motion is enabled.
- Reduced-motion users get a static background and normal scrolling. Forced-color users get readable content without decorative drops.
- GSAP contexts, observers, listeners, and pending animation frames clean up on unmount. React StrictMode is supported.
- Keep the section in normal document flow. Avoid a transformed ancestor, nested scroll container, or competing smooth-scroll library unless you configure GSAP for it.
- Reserve image dimensions above the section. A ResizeObserver refreshes positions for layout changes within the nearest `main`; for unusual external layout shifts, call `ScrollTrigger.refresh()` after your layout settles.
- Theme changes do not recreate the animation; only CSS colors change.


## Validation

The standalone demo builds successfully with Vite. The component behavior was browser-checked before splitting the demos.
