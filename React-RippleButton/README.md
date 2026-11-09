# RippleButton

The original coral appointment button as a standalone React component. Its fill expands from the pointer's entry point and contracts towards the exit point. Keyboard focus starts the ripple at the center. Reduced motion switches the colors immediately.

## Run the preview

With Node 22.12 or newer, open this folder in PowerShell.

```powershell
npm ci --include=dev
npm run dev
```

Open the address Vite prints. The preview displays only the button. To make a production build, run `npm run build`.

## Reuse it

Copy `src/components/RippleButton/` into your React project. The JSX imports its stylesheet, so copy both files. React is the only runtime dependency.

```jsx
import RippleButton from "./components/RippleButton/RippleButton.jsx";

<RippleButton onClick={openBooking}>Book a visit</RippleButton>
```

The component accepts normal button props, including `type`, `disabled`, and `onClick`. Set `showArrow={false}` to hide the arrow. It defaults to `type="button"`. Override `--ripple-color`, `--ripple-border`, `--ripple-surface`, and `--ripple-hover-text` through the `style` prop. The preview loads Inter, with system font fallbacks.
