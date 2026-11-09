"use client";

import { useEffect, useRef } from "react";
import doctor from "./assets/Doctor.svg";
import "./BlobVisual.css";

const clamp = (value) => Math.max(-1, Math.min(1, value));

export default function BlobVisual({
  imageSrc = doctor,
  imageAlt = "Doctor illustration",
  experience = "20+",
  experienceLabel = "years experience",
  days = "7",
  daysLabel = "days a week",
  className = "",
  ...props
}) {
  const root = useRef(null);
  const stage = useRef(null);

  useEffect(() => {
    const visual = root.current;
    const layer = stage.current;
    const pointerArea = visual.closest("[data-hero-pointer-area], #hero") || visual;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const current = { x: 0, y: 0, angle: 0 };
    const target = { x: 0, y: 0, angle: 0 };
    let frame = 0;

    function draw() {
      frame = 0;
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      current.angle += (target.angle - current.angle) * 0.1;

      const distance = Math.max(
        Math.abs(target.x - current.x),
        Math.abs(target.y - current.y),
        Math.abs(target.angle - current.angle),
      );
      if (distance < 0.01) Object.assign(current, target);

      layer.style.transform = `translate(${current.x}px, ${current.y}px) rotate(${current.angle}deg)`;
      if (distance >= 0.01) frame = window.requestAnimationFrame(draw);
    }

    function startFrame() {
      if (!frame && !reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    }

    function move(event) {
      if (event.pointerType === "touch" || reducedMotion.matches) return;
      const { left, top, width, height } = visual.getBoundingClientRect();
      if (!width || !height) return;

      const x = clamp((event.clientX - left) / (width / 2) - 1);
      const y = clamp((event.clientY - top) / (height / 2) - 1);
      Object.assign(target, { x: x * 10, y: y * 10, angle: x * 1.2 });
      startFrame();
    }

    function leave() {
      Object.assign(target, { x: 0, y: 0, angle: 0 });
      startFrame();
    }

    function reset() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      Object.assign(current, { x: 0, y: 0, angle: 0 });
      Object.assign(target, current);
      layer.style.removeProperty("transform");
    }

    pointerArea.addEventListener("pointermove", move);
    pointerArea.addEventListener("pointerleave", leave);
    reducedMotion.addEventListener("change", reset);

    return () => {
      pointerArea.removeEventListener("pointermove", move);
      pointerArea.removeEventListener("pointerleave", leave);
      reducedMotion.removeEventListener("change", reset);
      reset();
    };
  }, []);

  return (
    <div {...props} ref={root} className={`blob-visual ${className}`.trim()}>
      <div ref={stage} className="blob-visual__stage">
        <div className="blob-visual__halo" aria-hidden="true" />
        <svg className="blob-visual__grid" viewBox="0 0 400 400" aria-hidden="true">
          <path
            d="M0 340H400 M0 200H400 M40 380V20 M360 380V20"
            stroke="var(--blob-white)"
            strokeOpacity=".18"
            strokeWidth="1"
          />
        </svg>
        <img className="blob-visual__image" src={imageSrc} alt={imageAlt} />
        {experience != null && (
          <div className="blob-visual__chip blob-visual__chip--experience">
            <strong>{experience}</strong>
            <span>{experienceLabel}</span>
          </div>
        )}
        {days != null && (
          <div className="blob-visual__chip blob-visual__chip--days">
            <strong>{days}</strong>
            <span>{daysLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
