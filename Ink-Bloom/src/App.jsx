import React from 'react';
import InkThemeToggle from './components/InkThemeToggle/InkThemeToggle';

export default function App() {
  return (
    <>
      <main className="specimen">
        <h1>
          <span className="opening">This is the</span>{' '}
          <span className="name">Ink <em>Bloom</em></span>{' '}
          <span className="closing">theme toggle animation.</span>
        </h1>
        <p className="instruction">Use the button in the corner to switch themes.</p>
      </main>
      <InkThemeToggle duration={1000} />
    </>
  );
}
