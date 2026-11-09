# GlassNavbar — standalone React component

## Run this demo

Use Node 22.12 or newer. Open a terminal in this project folder, then install its dependencies.

```bash
npm ci --include=dev
npm run dev
```

If Vite is missing after moving the project, delete the old `node_modules` folder and rerun the install command with this lockfile. Build with `npm run build`. The preview displays only the navbar. Its sample links reload the same preview with a different URL.

## Copy into your repository

Copy `src/components/GlassNavbar/` into your project. It contains the JSX, its CSS, and its pointer-motion hook. The component only needs React and GSAP. No ScrollDrops files are included.

```bash
npm install gsap
```

## GlassNavbar

```jsx
import GlassNavbar from './components/GlassNavbar/GlassNavbar.jsx';

const links = [
  { href: '/#work', label: 'Work', description: 'Selected projects' },
  { href: '/about', label: 'About', description: 'Meet the team' },
];

export default function Header() {
  return (
    <GlassNavbar
      brand="Your Studio"
      brandHref="/"
      links={links}
      secondaryAction={{ href: '/login', label: 'Sign in' }}
      action={{ href: '/contact', label: 'Let’s talk' }}
      activeHref="/about"
      overHero
    />
  );
}
```

| Prop | Default | Use |
| --- | --- | --- |
| `brand` | `"Fieldwork"` | Brand text. |
| `brandHref` | `"#"` | Brand destination. |
| `brandIcon` | Inline leaf mark | Custom icon node; decorative wrapper is hidden from assistive technology. |
| `links` | Two demo links | Array of `{ href, label, description?, active? }`. Keep labels short; 2–4 primary links work best. |
| `secondaryAction` | None | Optional `{ href, label }` beside the main CTA. |
| `action` | Demo contact link | Main `{ href, label }`; pass `null` to hide. |
| `activeHref` | None | Active link destination; a link's explicit `active` takes priority. |
| `overHero` | `true` | Slightly clearer glass at the top of an image hero. Pass `false` on inner pages. |
| `menuNote` | Short demo note | Mobile menu note; pass an empty string to hide. |
| `LinkComponent` | `"a"` | Anchor-compatible component forwarding `href`, events, className, and aria attributes. |
| `routeKey` | None | Set to your router's location key/path to close mobile navigation on route changes. |
| `className`, `style` | None | Extra root class / inline styles. |

The navbar is fixed. Your hero can extend beneath it; on ordinary pages add about `112px` top padding to your own main content. The component deliberately does not modify your page layout. Put it outside transformed, clipped, or scrolling ancestor containers.

The ivory glass design stays light when your page is dark, matching the original navbar. `--gn-ink`, `--gn-accent`, `--gn-hover`, and `--gn-max-width` can be overridden through the `style` prop. For example:

```jsx
<GlassNavbar style={{ '--gn-max-width': '1240px', '--gn-accent': '#254c3b' }} />
```

### React Router adapter (optional)

Ordinary anchors work without a router. For client-side routing, define this adapter outside your component, then pass it to `LinkComponent`:

```jsx
import { Link, useLocation } from 'react-router-dom';

function RouterAnchor({ href, ...props }) {
  return <Link to={href} {...props} />;
}

function Header() {
  const location = useLocation();
  return <GlassNavbar
    LinkComponent={RouterAnchor}
    routeKey={location.key}
    activeHref={location.pathname + location.hash}
    links={links}
  />;
}
```

Use ordinary anchors instead for external URLs. Hash targets must exist on your page; your router controls cross-page hash scrolling.

### Interaction and accessibility

- Pointer glow, trailing light, magnetic link content, a sliding hover pill, and CTA ink fill.
- Effects stay inside the header; link hit areas do not move.
- Mobile disclosure menu with unique IDs, `aria-expanded`, inactive-menu `inert`, Escape, outside dismissal, and breakpoint focus recovery.
- A nonmodal menu: the page remains scrollable and Tab follows normal document order.
- Decorative motion is disabled for reduced motion, coarse pointers, and forced colors.


## Validation

The standalone demo builds successfully with Vite. The component behavior was browser-checked before splitting the demos.
