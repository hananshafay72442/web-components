import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import ScrollDrops from "./components/ScrollDrops/ScrollDrops.jsx";
import "./demo.css";
function Demo() {
  const [dark, setDark] = useState(false);
  return (
    <div className="demo" data-theme={dark ? "dark" : "light"}>
      <a className="demo-skip" href="#main">
        Skip to content
      </a>
      <main id="main" tabIndex={-1}>
        <section className="demo-intro demo-wrap">
          <p className="demo-label">ScrollDrops / standalone React component</p>
          <h1>A moment<br/>to stay.</h1>
          <p>Scroll down. The next section settles in the center, then your scrolling animates the droplets before the page carries on.</p>
          <a className="demo-button" href="#story">Explore the drops</a>
        </section>
        <ScrollDrops
          id="story"
          aria-labelledby="story-heading"
          theme={dark ? "dark" : "light"}
          topOffset={24}
        >
          <div className="demo-story demo-wrap">
            <div className="demo-story-heading">
              <div>
                <p className="demo-label">A pause, with purpose</p>
                <h2 id="story-heading">
                  Some things deserve
                  <br />a little more time.
                </h2>
              </div>
              <p>
                Arrive. Stay for a moment. Let the background move while the
                story stays with you.
              </p>
            </div>
            <ol className="demo-steps">
              <li>
                <span>01</span>
                <h3>Find your place</h3>
                <p>The section settles into the center of the screen.</p>
              </li>
              <li>
                <span>02</span>
                <h3>Keep exploring</h3>
                <p>
                  Further scrolling brings the droplets to life behind the
                  content.
                </p>
              </li>
              <li>
                <span>03</span>
                <h3>Carry on</h3>
                <p>Once the animation completes, normal scrolling resumes.</p>
              </li>
            </ol>
            <div className="demo-story-note">
              Scroll to see the sequence <span aria-hidden="true">↓</span>
              <span>Reverse your scroll to rewind it.</span>
            </div>
          </div>
        </ScrollDrops>
        <section id="contact" className="demo-end demo-wrap">
          <p className="demo-label">Your next starting point</p>
          <h2>
            A different brand.
            <br />
            The same attention.
          </h2>
          <p>Replace the copy, set your links, and make the colors your own.</p>
          <a className="demo-button" href="#">
            Back to the beginning{" "}
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 18 18 6M6 6h12v12"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </a>
        </section>
      </main>
      <footer className="demo-wrap">
        ScrollDrops / standalone React component
      </footer>
      <button
        className="demo-theme"
        onClick={() => setDark((value) => !value)}
        aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      >
        {dark ? "☀" : "☾"}
      </button>
    </div>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
);
