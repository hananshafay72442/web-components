import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import InkMask, { alignInkMask } from './InkMask';
import styles from './InkThemeToggle.module.css';

const storageKey = 'ink-bloom-theme';
const reducedMotion = '(prefers-reduced-motion: reduce)';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // The toggle also works when a browser blocks local storage.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThemeIcon({ dark }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      {dark ? (
        <>
          <circle cx="12" cy="12" r="3.8" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      ) : (
        <path d="M20.3 14.1A8.8 8.8 0 0 1 9.9 3.7 8.8 8.8 0 1 0 20.3 14.1Z" />
      )}
    </svg>
  );
}

export default function InkThemeToggle({ duration = 2600 }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const svgRef = useRef(null);
  const imageRef = useRef(null);
  const activeTransition = useRef(null);
  const maskId = 'ink-bloom-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const milliseconds = Number.isFinite(duration) ? Math.max(0, duration) : 2600;

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useLayoutEffect(() => {
    svgRef.current.pauseAnimations();
    return () => activeTransition.current?.skipTransition();
  }, []);

  async function toggle(event) {
    if (activeTransition.current) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    const svg = svgRef.current;

    function applyTheme() {
      // Both snapshots must see the correct theme and button icon.
      flushSync(() => setTheme(next));
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        // Persistence is optional.
      }
    }

    if (!document.startViewTransition || !milliseconds || window.matchMedia(reducedMotion).matches) {
      applyTheme();
      return;
    }

    alignInkMask(imageRef.current, event.currentTarget);
    svg.setCurrentTime(0);
    root.dataset.inkBloom = '';
    root.style.setProperty('--ink-bloom-mask', 'url("#' + maskId + '")');
    root.style.setProperty('--ink-bloom-duration', milliseconds + 'ms');

    let transition;
    try {
      transition = document.startViewTransition(applyTheme);
      activeTransition.current = transition;
      await transition.ready;
      svg.unpauseAnimations();
    } catch {
      // A resize or hidden tab can skip the visual transition.
      if (transition) transition.skipTransition();
      else applyTheme();
    } finally {
      if (transition) await transition.finished.catch(() => {});
      svg.pauseAnimations();
      delete root.dataset.inkBloom;
      root.style.removeProperty('--ink-bloom-mask');
      root.style.removeProperty('--ink-bloom-duration');
      activeTransition.current = null;
    }
  }

  const label = theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
  return (
    <>
      <InkMask id={maskId} svgRef={svgRef} imageRef={imageRef} duration={milliseconds || 1} />
      <button type="button" className={styles.toggle} onClick={toggle}
        aria-label={label} title={label}>
        <ThemeIcon dark={theme === 'dark'} />
      </button>
    </>
  );
}
