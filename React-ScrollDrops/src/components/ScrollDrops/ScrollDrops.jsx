"use client";

import React, { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./ScrollDrops.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// A repeatable layout prevents hydration mismatches and jumps on re-render.
function createDrops(count, seed) {
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  return Array.from({ length: count }, (_, id) => {
    const depth = random();
    const size = 0.1 + depth * 1.9;

    return {
      id,
      size,
      top: random() * 200,
      left: random() * (100 - size),
      opacity: 0.1 + depth * 0.8,
      stretch: 1 + depth * 8,
    };
  });
}

/**
 * Scroll-linked gradient drops. Optional children stay above the background.
 * pinOnScroll holds the compact section while drops animate on roomy screens.
 */
export default function ScrollDrops({
  children,
  compact = true,
  pinOnScroll = true,
  count = 36,
  scrollDistance = 1.35,
  topOffset = 112,
  theme,
  seed = 11,
  className = "",
  style,
  ...sectionProps
}) {
  const safeDistance = Number.isFinite(scrollDistance)
    ? Math.min(4, Math.max(0.5, scrollDistance))
    : 1.35;
  const safeOffset = Number.isFinite(topOffset) ? Math.max(0, topOffset) : 112;
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const safeCount = Number.isFinite(count)
    ? Math.min(160, Math.max(0, Math.floor(count)))
    : 36;
  const drops = useMemo(() => createDrops(safeCount, seed), [safeCount, seed]);

  useGSAP(
    () => {
      const elements = sectionRef.current.querySelectorAll(".sd-drop");
      if (!elements.length) return;

      const media = gsap.matchMedia();

      media.add(
        {
          motion:
            "(prefers-reduced-motion: no-preference) and (forced-colors: none)",
          roomy: "(min-width: 800px) and (min-height: 600px)",
        },
        (context) => {
          if (!context.conditions.motion) return;
          // Hold only when the complete section fits below the navbar.
          const pinned =
            pinOnScroll &&
            context.conditions.roomy &&
            stageRef.current.clientHeight <=
              window.innerHeight - safeOffset - 16;
          const animationStart = pinned ? 0.12 : 0;

          // Position, stretching, and fading share one reversible timeline.
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: pinned
                ? () =>
                    `top ${Math.max(safeOffset, (window.innerHeight - sectionRef.current.offsetHeight) / 2)}px`
                : "top 90%",
              end: pinned
                ? () => `+=${Math.max(700, window.innerHeight * safeDistance)}`
                : compact
                  ? "bottom top"
                  : "bottom bottom",
              pin: pinned ? sectionRef.current : false,
              pinSpacing: true,
              anticipatePin: pinned ? 1 : 0,
              scrub: pinned ? true : 1,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "power2.inOut", stagger: 0.008 },
          });

          // A short scroll hold separates arriving from animating the drops.
          if (pinned) timeline.to({}, { duration: animationStart }, 0);

          timeline.fromTo(
            elements,
            { y: 0, "--drop-stretch": 1 },
            {
              y: () => -stageRef.current.clientHeight,
              "--drop-stretch": (index) => drops[index].stretch,
              duration: 1,
            },
            animationStart,
          );

          timeline.fromTo(
            elements,
            { opacity: 1 },
            { opacity: 0, duration: 0.5, immediateRender: false },
            animationStart + 0.5,
          );
          if (pinned) timeline.to({}, { duration: 0.12 });

          // Recalculate travel when a containing layout changes the stage height.
          const layout = sectionRef.current.closest("main");
          let height = stageRef.current.clientHeight;
          let layoutHeight = layout?.offsetHeight;
          let refreshFrame;
          const observer = new ResizeObserver(() => {
            const nextHeight = stageRef.current?.clientHeight;
            const nextLayoutHeight = layout?.offsetHeight;
            if (
              !nextHeight ||
              (nextHeight === height && nextLayoutHeight === layoutHeight)
            )
              return;
            height = nextHeight;
            layoutHeight = nextLayoutHeight;
            cancelAnimationFrame(refreshFrame);
            refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
          });
          observer.observe(stageRef.current);
          // Async content above this section can change its scroll position.
          if (layout) observer.observe(layout);

          return () => {
            observer.disconnect();
            cancelAnimationFrame(refreshFrame);
          };
        },
      );

      return () => media.revert();
    },
    {
      scope: sectionRef,
      dependencies: [drops, compact, pinOnScroll, safeDistance, safeOffset],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      {...sectionProps}
      data-theme={theme}
      ref={sectionRef}
      className={`scroll-drops ${compact ? "sd-compact" : ""} ${className}`.trim()}
      style={style}
    >
      <div ref={stageRef} className="sd-stage">
        <div className="sd-field" aria-hidden="true">
          {drops.map((drop) => (
            <span
              key={drop.id}
              className="sd-drop"
              style={{
                top: `${drop.top}%`,
                left: `${drop.left}%`,
                width: `${drop.size}%`,
                "--drop-opacity": drop.opacity,
              }}
            >
              <span className="sd-color" />
            </span>
          ))}
        </div>
        {children != null && <div className="sd-content">{children}</div>}
      </div>
    </section>
  );
}
